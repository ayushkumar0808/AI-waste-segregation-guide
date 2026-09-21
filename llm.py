"""
llm.py - AI classification logic for EcoSort.
Integrates with IBM watsonx.ai (Granite models) when API credentials are provided,
and seamlessly provides an offline rule-based demo mode so the prototype works anytime.
"""

import os
import json
import re
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def get_granite_prompt(waste_item: str, retrieved_context: str) -> str:
    """
    Constructs a clear, structured prompt for IBM Granite.
    Transparently guides the model to categorize the waste item, assign bin color,
    give a short reason grounded in the retrieved rules, and suggest a reduce/reuse tip.
    """
    return f"""You are EcoSort, an AI Waste Segregation Assistant built to support UN SDG 12 (Responsible Consumption & Production) and India's Solid Waste Management (SWM) Rules 2016.

Retrieved Context from Rules:
\"\"\"{retrieved_context}\"\"\"

User's Waste Item: "{waste_item}"

Your Task:
Analyze the item and return a strict JSON object with these exact keys:
- "category": One of ["Wet Waste", "Dry / Recyclable", "E-Waste", "Domestic Hazardous", "Sanitary Waste"]
- "bin_color": Standard bin color, e.g. "Green", "Blue", "Yellow / Orange", "Red / Black", or "Marked Wrapper"
- "reason": A brief (1-2 sentences) transparent explanation of why it belongs here, referencing the rule.
- "tip": One practical reduce or reuse tip for students and households.
- "is_hazardous": true if the item is hazardous, biomedical, chemical, or electronic; otherwise false.

Respond ONLY with a valid JSON object. Do not include markdown code block quotes.
"""


def _classify_rule_based_fallback(waste_item: str) -> Dict[str, Any]:
    """
    Intelligent rule-based fallback when IBM watsonx credentials are not configured.
    Ensures that beginners can run, test, and evaluate the prototype immediately.
    """
    item_lower = waste_item.lower().strip()

    # E-Waste keywords
    if any(k in item_lower for k in [
        "battery", "cell", "charger", "earphone", "cable", "phone", "laptop", 
        "wire", "circuit", "e-waste", "bulb", "cfl", "tube light", "electronic"
    ]):
        return {
            "category": "E-Waste",
            "bin_color": "Yellow / Orange Bin",
            "reason": "Contains electronic circuitry, heavy metals, or chemical cells that need dedicated collection under E-Waste Management Rules.",
            "tip": "Tape battery ends to prevent terminal shorts and deposit at campus or municipal e-waste collection bins.",
            "is_hazardous": True
        }

    # Domestic Hazardous / Chemical / Biomedical
    if any(k in item_lower for k in [
        "medicine", "tablet", "syrup", "paint", "spray", "pesticide", "chemical", 
        "mercury", "thermometer", "syringe", "needle", "sanitary", "diaper", "band-aid"
    ]):
        if any(s in item_lower for s in ["sanitary", "diaper", "band-aid"]):
            return {
                "category": "Sanitary Waste",
                "bin_color": "Red Bin / Marked Pouch",
                "reason": "Personal hygiene and biomedical items must be wrapped securely in newspaper or pouches to protect sanitation workers from biological infection.",
                "tip": "Never flush sanitary items down toilets; always wrap tightly before discarding.",
                "is_hazardous": True
            }
        return {
            "category": "Domestic Hazardous",
            "bin_color": "Red Bin or Black Box",
            "reason": "Contains potentially toxic, flammable, or bio-hazardous substances that contaminate municipal waste streams.",
            "tip": "Keep out of reach of children and drop off during dedicated municipal hazardous collection drives.",
            "is_hazardous": True
        }

    # Wet / Biodegradable
    if any(k in item_lower for k in [
        "food", "banana", "apple", "peel", "vegetable", "fruit", "egg", "tea", 
        "coffee", "bone", "curry", "rice", "bread", "leaves", "flower", "compost", "wet"
    ]):
        return {
            "category": "Wet Waste",
            "bin_color": "Green Bin",
            "reason": "Organic and biodegradable kitchen matter decomposes naturally through microbial composting or bio-methanation.",
            "tip": "Start a small hostel or balcony compost pot to turn food scraps into nutrient-rich soil.",
            "is_hazardous": False
        }

    # Special handling: Greasy pizza box
    if "pizza" in item_lower and any(w in item_lower for w in ["box", "grease", "oily", "used"]):
        return {
            "category": "Dry / Recyclable (Special Caution)",
            "bin_color": "Blue Bin (Clean parts) / Wet or RDF (Greasy parts)",
            "reason": "Cardboard saturated with grease and cheese oils cannot be re-pulped by paper recyclers. Separate clean lids (Blue) from greasy bases (Wet/RDF).",
            "tip": "Tear the clean top lid off for paper recycling; compost or dispose of the soiled bottom part separately.",
            "is_hazardous": False
        }

    # Dry / Recyclables default
    return {
        "category": "Dry / Recyclable",
        "bin_color": "Blue Bin",
        "reason": "Non-biodegradable, clean material suitable for segregation and mechanical recycling at material recovery facilities.",
        "tip": "Rinse off food residue and flatten boxes or bottles before binning to optimize storage space.",
        "is_hazardous": False
    }


def classify_waste(waste_item: str, retrieved_context: str) -> Dict[str, Any]:
    """
    Main classification function.
    Attempts to call IBM watsonx.ai Granite model; if credentials are missing
    or an error occurs, gracefully falls back to the deterministic rule engine.
    """
    api_key = os.getenv("WATSONX_API_KEY")
    project_id = os.getenv("WATSONX_PROJECT_ID")
    url = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
    model_id = os.getenv("WATSONX_MODEL_ID", "ibm/granite-13b-chat-v2")

    # If IBM watsonx credentials are not set, use Demo Mode
    if not api_key or not project_id or api_key == "YOUR_WATSONX_API_KEY":
        result = _classify_rule_based_fallback(waste_item)
        result["mode"] = "Demo Mode (Keyword Rules)"
        return result

    # Try calling IBM watsonx.ai SDK
    try:
        from ibm_watsonx_ai.foundation_models import Model
        from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

        parameters = {
            GenParams.DECODING_METHOD: "greedy",
            GenParams.MAX_NEW_TOKENS: 350,
            GenParams.TEMPERATURE: 0.1,
            GenParams.REPETITION_PENALTY: 1.05,
        }

        model = Model(
            model_id=model_id,
            params=parameters,
            credentials={"url": url, "apikey": api_key},
            project_id=project_id,
        )

        prompt = get_granite_prompt(waste_item, retrieved_context)
        response = model.generate_text(prompt=prompt)

        # Clean JSON from response text
        match = re.search(r"\{.*\}", response, re.DOTALL)
        if match:
            parsed = json.loads(match.group(0))
            parsed["mode"] = f"IBM Granite ({model_id})"
            return parsed
        else:
            fallback = _classify_rule_based_fallback(waste_item)
            fallback["mode"] = "IBM Granite (Raw Response Fallback)"
            fallback["reason"] = response.strip() or fallback["reason"]
            return fallback

    except Exception as e:
        # Graceful fallback on network or SDK errors
        fallback = _classify_rule_based_fallback(waste_item)
        fallback["mode"] = f"Demo Mode (SDK Fallback: {type(e).__name__})"
        return fallback
