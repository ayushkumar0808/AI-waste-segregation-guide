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

# --- Custom Styling ---
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1b4332;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1rem;
        color: #495057;
        margin-bottom: 1.5rem;
    }
    .stButton>button {
        border-radius: 8px;
        transition: all 0.2s ease;
    }
</style>
""", unsafe_allow_html=True)

# --- Initialize RAG System (Cached) ---
@st.cache_resource
def get_rag_system():
    return WasteRulesRAG("data/waste_rules.md")

try:
    rag_engine = get_rag_system()
except Exception as e:
    rag_engine = None

# --- Sidebar: Responsible AI & SDG Focus ---
with st.sidebar:
    st.markdown("### 🌱 EcoSort Mission")
    st.markdown("""
    **Primary SDG:**  
    🎯 **SDG 12:** Responsible Consumption & Production  
    
    **Secondary SDGs:**  
    🏙️ **SDG 11:** Sustainable Cities & Communities  
    🌍 **SDG 13:** Climate Action  
    """)
    st.divider()

    st.markdown("### ⚖️ Responsible AI Principles")
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

# --- App Header Banner ---
st.markdown('<div class="main-header">♻️ EcoSort: AI Waste Segregation Guide</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Automated waste segregation assistant aligned with <b>UN SDG 12</b> and India\'s <b>Solid Waste Management Rules 2016</b>.</div>', unsafe_allow_html=True)

# --- Tabs for Complete Experience ---
tab_app, tab_rules, tab_docs = st.tabs([
    "📱 Interactive Waste Classifier",
    "📜 SWM Rules 2016 Explorer",
    "📊 System Architecture & Docs"
])

# ==========================================
# TAB 1: INTERACTIVE CLASSIFIER
# ==========================================
with tab_app:
    st.markdown("**Quick test suggestions (Click to classify instantly):**")
    cols = st.columns(5)
    preset_items = [
        "Used pizza box",
        "Old mobile battery",
        "Banana peels",
        "Plastic milk pouch",
        "Expired paracetamol syrup"
    ]

    if "waste_item" not in st.session_state:
        st.session_state["waste_item"] = "Used pizza box"

    for i, item in enumerate(preset_items):
        if cols[i].button(item, key=f"preset_{i}", use_container_width=True):
            st.session_state["waste_item"] = item

    waste_input = st.text_input(
        label="Enter any waste item to classify:",
        value=st.session_state.get("waste_item", "Used pizza box"),
        placeholder="e.g. used pizza box, broken headphone, vegetable peels, medicine blister pack...",
        key="waste_input_field"
    )

    with st.expander("📸 Optional: Upload Image of Waste (Multimodal Feature)"):
        st.info("💡 **TODO for Next Version:** Multimodal image classification using IBM Granite Vision models.")
        uploaded_file = st.file_uploader("Upload an item picture (JPG, PNG)", type=["jpg", "jpeg", "png"], disabled=True)
        st.caption("Current prototype focuses on instant natural-language text queries.")

    current_query = waste_input.strip() if waste_input.strip() else st.session_state.get("waste_item", "Used pizza box")

    if current_query:
        with st.spinner("Retrieving SWM Rules 2016 context and classifying..."):
            if rag_engine:
                retrieved_chunks = rag_engine.retrieve(current_query, top_k=1)
                top_chunk = retrieved_chunks[0]
                retrieved_context = top_chunk["content"]
                source_title = top_chunk["title"]
            else:
                retrieved_context = "SWM Rules 2016 General Guidelines."
                source_title = "SWM Rules 2016 Reference"

            result = classify_waste(current_query, retrieved_context)

        category = result.get("category", "General Waste")
        bin_color = result.get("bin_color", "Check locally")
        reason = result.get("reason", "Follow standard municipal waste segregation.")
        tip = result.get("tip", "Reduce consumption and recycle clean materials.")
        is_hazardous = result.get("is_hazardous", False)
        mode = result.get("mode", "Demo Mode")

        st.divider()

        st.subheader(f"Results for: *\"{current_query}\"*")
        st.caption(f"🤖 Engine Mode: **{mode}**")

        res_col1, res_col2 = st.columns([1, 2])

        with res_col1:
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
            st.markdown("**🧐 Why this category? (Transparency & Explainability):**")
            st.write(reason)
            st.markdown("**💡 Eco Tip (Reduce / Reuse / Upcycle):**")
            st.write(tip)

        if is_hazardous or "hazardous" in category.lower() or "e-waste" in category.lower() or "sanitary" in category.lower():
            st.warning("""
            ⚠️ **Safety & Health Advisory:**  
            This item is categorized as **Hazardous, Biomedical, or E-Waste**.  
            Please do **NOT** mix it with regular municipal trash. Store it safely and hand it over to 
            authorized campus e-waste drives or your local municipal collection centers.
            """)

        st.markdown("---")
        st.markdown("#### 📚 Source Used (RAG Grounding):")
        with st.expander(f"Verified Reference: {source_title}", expanded=True):
            st.markdown("**Matched Rule Context:**")
            st.text(retrieved_context)
            st.caption("Extracted from India's Solid Waste Management Rules 2016 (Ministry of Environment, Forest and Climate Change).")

# ==========================================
# TAB 2: SWM RULES 2016 EXPLORER
# ==========================================
with tab_rules:
    st.subheader("📜 India Solid Waste Management Rules 2016 Summary")
    st.markdown("""
    Under the **Solid Waste Management Rules 2016** issued by the Ministry of Environment, Forest and Climate Change (MoEFCC), 
    waste generators in India are required to segregate waste at source into distinct streams:
    """)

    rule_col1, rule_col2 = st.columns(2)

    with rule_col1:
        with st.expander("🟢 1. Wet Waste (Biodegradable Waste)", expanded=True):
            st.markdown("""
            - **Bin Color:** Green
            - **Examples:** Vegetable and fruit peels, cooked food leftovers, tea leaves, garden waste, eggshells, spoiled grains.
            - **Handling:** Collected daily. Suitable for household/community composting or biomethanation plants.
            """)

    with rule_col2:
        with st.expander("🔵 2. Dry Waste (Recyclable Non-Biodegradable)", expanded=True):
            st.markdown("""
            - **Bin Color:** Blue
            - **Examples:** Clean paper, cardboard cartons, plastics (milk pouches, bottles, food wrappers rinsed clean), glass bottles, metal cans.
            - **Handling:** Sent to Material Recovery Facilities (MRFs) and registered recyclers. Soiled paper/pizza boxes with heavy oil residue cannot be recycled.
            """)

    rule_col3, rule_col4 = st.columns(2)

    with rule_col3:
        with st.expander("🔴 3. Domestic Hazardous & Sanitary Waste", expanded=True):
            st.markdown("""
            - **Bin Color:** Red / Wrap Securely
            - **Examples:** Discarded paint cans, aerosol sprays, pesticide containers, CFL bulbs, expired medicines, sanitary napkins, diapers.
            - **Handling:** Must be securely wrapped in newspaper or designated pouches to protect sanitation workers. Handed over to authorized hazardous waste operators.
            """)

    with rule_col4:
        with st.expander("🟡 4. E-Waste (Electronic Waste)", expanded=True):
            st.markdown("""
            - **Bin Color:** Yellow / Orange Bin (Deposit Points)
            - **Examples:** Old mobile batteries, chargers, earphone cables, broken keyboards, discarded remote controls, LEDs.
            - **Handling:** Regulated under E-Waste (Management) Rules. Must be deposited at authorized collection centers, manufacturer buy-backs, or designated campus e-waste bins.
            """)

# ==========================================
# TAB 3: SYSTEM ARCHITECTURE & DOCS
# ==========================================
with tab_docs:
    st.subheader("📊 System Architecture & Flowchart")
    st.markdown("""
    This application utilizes a **Lightweight RAG (Retrieval-Augmented Generation)** architecture:
    1. **Query Preprocessing:** Cleans and normalizes user query.
    2. **TF-IDF Vector Retrieval:** `scikit-learn` computes cosine similarity against chunks of `data/waste_rules.md`.
    3. **Prompt Formulation:** Assembles the Granite prompt with context and strict JSON formatting instructions.
    4. **Inference / Fallback:** Connects to IBM watsonx.ai Granite model or utilizes deterministic rule matching if offline.
    5. **Streamlit UI:** Displays color badge, explanation, eco-tip, and citations.
    """)

    st.markdown("#### Mermaid Flow Diagram:")
    st.code("""
flowchart TD
    A[User Input: Waste Item] --> B[Text Preprocessing]
    B --> C[TF-IDF Retrieval on data/waste_rules.md]
    C --> D[Top Matched SWM 2016 Rule Chunk]
    D --> E[Granite Prompt in llm.py]
    E --> F{WATSONX_API_KEY Set?}
    F -->|Yes| G[IBM watsonx.ai Granite 13B Model]
    F -->|No| H[Rule-Based Fallback Engine]
    G --> I[Structured JSON Output]
    H --> I
    I --> J[Color Bin Badge + Reason + Tip + Safety Disclaimer]
    D --> K[Source Used Citation Accordion]
    """, language="markdown")

    st.markdown("#### Sample Test Inputs & Outputs:")
    st.markdown("""
    | Input Item | Category | Bin Color | Verified Rule Clause |
    | :--- | :--- | :--- | :--- |
    | **Used pizza box** | Dry Waste / Compostable | Blue / Green (if greasy) | Section 2: Dry Waste Recyclables |
    | **Old mobile battery** | E-Waste | Yellow / Orange | Section 4: E-Waste Management Rules |
    | **Banana peels** | Wet Waste | Green Bin | Section 1: Biodegradable Wet Waste |
    | **Plastic milk pouch** | Recyclable Dry Waste | Blue Bin | Section 2: Dry Waste Recyclables |
    | **Expired paracetamol** | Domestic Hazardous | Red Bin | Section 3: Domestic Hazardous Waste |
    """)
