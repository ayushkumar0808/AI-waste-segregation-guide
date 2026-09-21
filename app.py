"""
app.py - EcoSort: AI Waste Segregation Guide
A beginner-friendly Streamlit web app for the 1M1B - IBM SkillsBuild Virtual Internship.
Aligns with UN SDG 12 (Responsible Consumption & Production) & India's SWM Rules 2016.
"""

import streamlit as st
from rag import WasteRulesRAG
from llm import classify_waste

# --- Page Configuration ---
st.set_page_config(
    page_title="EcoSort - AI Waste Segregation Guide",
    page_icon="♻️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Initialize RAG System (Cached) ---
@st.cache_resource
def get_rag_system():
    return WasteRulesRAG("data/waste_rules.md")

rag_engine = get_rag_system()

# --- Sidebar: Responsible AI & SDG Focus ---
with st.sidebar:
    st.title("🌱 EcoSort Mission")
    st.markdown("""
    **Primary SDG:**  
    🎯 **SDG 12:** Responsible Consumption & Production  
    
    **Secondary SDGs:**  
    🏙️ **SDG 11:** Sustainable Cities & Communities  
    🌍 **SDG 13:** Climate Action
    """)
    st.divider()

    st.subheader("⚖️ Responsible AI Principles")
    with st.expander("1. Fairness & Inclusivity", expanded=False):
        st.write("""
        Designed for students, hostel residents, and domestic waste handlers. 
        Categorizations use plain-language terms aligned with nationwide Indian standards.
        """)

    with st.expander("2. Transparency & Explainability", expanded=True):
        st.write("""
        Every classification cites the exact section of India's **Solid Waste Management Rules 2016**
        retrieved via transparent TF-IDF matching, and explains *why* the item belongs in that bin.
        """)

    with st.expander("3. Privacy by Design", expanded=False):
        st.write("""
        Zero personal data collection. No logins, tracking cookies, or session logging. 
        Queries are processed in-memory.
        """)

    with st.expander("4. Safety & Ethics", expanded=False):
        st.write("""
        Guards against hazardous and biomedical waste by displaying safety protocols 
        and advising users to contact authorized municipal agencies.
        """)

    st.divider()
    st.caption("1M1B – IBM SkillsBuild Internship Prototype | Powered by IBM Granite / watsonx.ai")

# --- Main App Header ---
st.title("♻️ EcoSort: AI Waste Segregation Guide")
st.markdown("""
Welcome to **EcoSort**! Not sure which bin to throw an item into?  
Type the waste item below to get the **bin colour**, **SWM 2016 rule clause**, and a practical **reduce/reuse tip**.
""")

# --- Quick Test Presets ---
st.write("**Quick sample suggestions:**")
cols = st.columns(5)
preset_items = [
    "Used pizza box",
    "Old mobile battery",
    "Banana peels",
    "Empty plastic milk pouch",
    "Expired paracetamol syrup"
]

selected_preset = None
for i, item in enumerate(preset_items):
    if cols[i].button(item, key=f"preset_{i}", use_container_width=True):
        selected_preset = item

# --- Input Area ---
default_val = selected_preset if selected_preset else ""
waste_input = st.text_input(
    label="Enter a waste item:",
    value=default_val,
    placeholder="e.g. used pizza box, broken headphone, vegetable peels...",
    key="waste_input_field"
)

# Optional image upload hook (Marked as a clear multimodal TODO)
with st.expander("📸 Optional: Upload Image of Waste (Multimodal Feature)"):
    st.info("💡 **TODO for Next Version:** Multimodal image classification using IBM Granite Vision models.")
    uploaded_file = st.file_uploader("Upload an item picture (JPG, PNG)", type=["jpg", "jpeg", "png"], disabled=True)
    st.caption("Current prototype focuses on instant natural-language text queries.")

# --- Process Classification ---
if waste_input.strip():
    with st.spinner("Retrieving SWM Rules 2016 and classifying..."):
        # 1. RAG Retrieval via TF-IDF
        retrieved_chunks = rag_engine.retrieve(waste_input, top_k=1)
        top_chunk = retrieved_chunks[0]
        retrieved_context = top_chunk["content"]
        source_title = top_chunk["title"]

        # 2. LLM / Fallback Classification
        result = classify_waste(waste_input, retrieved_context)

    category = result.get("category", "General Waste")
    bin_color = result.get("bin_color", "Check locally")
    reason = result.get("reason", "Follow standard municipal waste segregation.")
    tip = result.get("tip", "Reduce consumption and recycle clean materials.")
    is_hazardous = result.get("is_hazardous", False)
    mode = result.get("mode", "Demo Mode")

    st.divider()

    # --- Display Result Cards ---
    st.subheader(f"Results for: *\"{waste_input}\"*")

    # Status Banner
    st.caption(f"🤖 Engine Mode: **{mode}**")

    res_col1, res_col2 = st.columns([1, 2])

    with res_col1:
        # Determine Color Badge Styling
        bin_lower = bin_color.lower()
        if "green" in bin_lower:
            st.success(f"### 🟢 Bin: {bin_color}\n**Category:** {category}")
        elif "blue" in bin_lower:
            st.info(f"### 🔵 Bin: {bin_color}\n**Category:** {category}")
        elif "yellow" in bin_lower or "orange" in bin_lower:
            st.warning(f"### 🟡 Bin: {bin_color}\n**Category:** {category}")
        elif "red" in bin_lower or "black" in bin_lower:
            st.error(f"### 🔴 Bin: {bin_color}\n**Category:** {category}")
        else:
            st.info(f"### 📦 Bin: {bin_color}\n**Category:** {category}")

    with res_col2:
        st.markdown(f"**🧐 Why this category? (Transparency):**")
        st.write(reason)
        st.markdown(f"**💡 Eco Tip (Reduce / Reuse):**")
        st.write(tip)

    # --- Critical Safety Disclaimer for Hazardous / Biomedical Waste ---
    if is_hazardous or "hazardous" in category.lower() or "e-waste" in category.lower() or "sanitary" in category.lower():
        st.warning("""
        ⚠️ **Safety & Health Disclaimer:**  
        This item is categorized as **Hazardous, Biomedical, or E-Waste**.  
        Please do **NOT** mix it with regular municipal trash. Store it separately and hand it over to 
        authorized campus e-waste drives or your local municipal collection centers.
        """)

    # --- RAG Source Attribution ---
    st.markdown("---")
    st.markdown("#### 📚 Source Used (RAG Grounding):")
    with st.expander(f"Verified Reference: {source_title}", expanded=True):
        st.markdown(f"**Matched Rule Context:**")
        st.text(retrieved_context)
        st.caption("Extracted from India's Solid Waste Management Rules 2016 (Ministry of Environment, Forest and Climate Change).")

else:
    st.info("👆 Type any waste item or click one of the quick suggestions above to see segregation instructions.")
