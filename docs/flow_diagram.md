# EcoSort System Flow Diagram

This diagram visualizes the flow of data through the **EcoSort** AI Waste Segregation system, from user input to TF-IDF retrieval, prompt construction, IBM Granite processing, and final UI rendering.

```mermaid
flowchart TD
    A([User Input: Waste Item]) --> B[Text Preprocessing]
    B --> C{RAG Retrieval Engine}
    
    subgraph SWM_Rules_RAG [Lightweight RAG Engine]
        D[(data/waste_rules.md\nSWM Rules 2016)] --> E[Chunking by Section]
        E --> F[TfidfVectorizer & Cosine Similarity]
        C -->|Query Vector| F
        F --> G[Top Matched Rule Chunk + Source Title]
    end

    G --> H[Prompt Formulation in llm.py]
    B --> H

    subgraph Decision_Mode [Inference Decision Engine]
        H --> I{WATSONX_API_KEY Set?}
        I -->|Yes| J[IBM watsonx.ai SDK\nModel: IBM Granite 13b]
        I -->|No / Error| K[Deterministic Rule-Based Fallback Engine]
        J --> L[Structured JSON Output]
        K --> L
    end

    subgraph UI_Presentation [Streamlit Presentation Layer]
        L --> M[Bin Color Badge\n🟢 Wet / 🔵 Dry / 🟡 E-Waste / 🔴 Hazardous]
        L --> N[Reason & Reduce/Reuse Tip]
        L --> O{Is Hazardous / Biomedical?}
        O -->|Yes| P[⚠️ Prominent Safety Alert & Advisory]
        O -->|No| Q[Standard Handling]
        G --> R[📚 'Source Used' Verification Accordion]
        S[Sidebar: Responsible AI & SDG 12]
    end

    M --> T([User Takes Action at Bin])
    N --> T
    P --> T
    R --> T
```
