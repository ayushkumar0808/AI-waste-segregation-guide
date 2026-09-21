# EcoSort: AI Waste Segregation Guide
**1M1B – IBM SkillsBuild Virtual Internship Project**

EcoSort is a beginner-friendly, AI-assisted waste segregation prototype designed to help students, hostel residents, households, and waste workers correctly segregate waste according to **India's Solid Waste Management (SWM) Rules 2016** and **UN Sustainable Development Goal 12 (Responsible Consumption & Production)**.

---

## 🌟 Key Features
- 🔍 **Natural Language Queries:** Type common waste items like *"used pizza box"* or *"old phone charger"*.
- 🏷️ **Smart Categorization:** Outputs bin color (Green, Blue, Yellow/Orange, Red), category, transparent reasoning, and a reduce/reuse tip.
- 📚 **Lightweight RAG Engine:** Retrieves matching clauses from `data/waste_rules.md` using `scikit-learn`'s TF-IDF and displays the verified source in the UI.
- 🤖 **Dual-Mode AI:** Uses **IBM watsonx.ai (IBM Granite)** when credentials are provided, or seamlessly switches to offline **Demo Mode** with deterministic rules.
- ⚖️ **Responsible AI Sidebar:** Addresses Fairness, Transparency, Privacy by Design (no login, no user tracking), and Ethics.
- ⚠️ **Hazardous Waste Alerts:** Shows clear safety advisories for e-waste, chemical, and sanitary waste items.

---

## 💻 Windows Setup & Execution Guide

### Prerequisites
- Windows 10 or 11
- [Python 3.10+](https://www.python.org/downloads/) installed (Make sure to check **"Add Python to PATH"** during installation!)

### Step 1: Open Command Prompt or PowerShell
Navigate to your project folder:
```cmd
cd path\to\ecosort
```

### Step 2: Create and Activate a Python Virtual Environment
Creating a virtual environment ensures dependencies do not conflict with other Python software:
```cmd
python -m venv venv
venv\Scripts\activate
```
*(You will see `(venv)` appear at the start of your command prompt line).*

### Step 3: Install Required Dependencies
Install the required packages using pip:
```cmd
pip install -r requirements.txt
```

### Step 4: Configure IBM watsonx.ai (Optional)
If you have an IBM watsonx.ai account:
1. Copy `.env.example` to `.env`:
   ```cmd
   copy .env.example .env
   ```
2. Open `.env` in Notepad and add your credentials:
   ```env
   WATSONX_API_KEY=your_actual_api_key_here
   WATSONX_PROJECT_ID=your_watsonx_project_id_here
   WATSONX_URL=https://us-south.ml.cloud.ibm.com
   WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
   ```
> 💡 **Note for Beginners:** If you don't have an IBM watsonx API key yet, **you can skip this step!** The app will automatically run in **Demo Mode** using the built-in rule engine.

### Step 5: Run the Streamlit Application
Launch the app with:
```cmd
streamlit run app.py
```
Streamlit will automatically open your default browser at `http://localhost:8501`.

---

## 📁 Project Structure
```text
├── app.py                     # Streamlit frontend with bin badges, RAG display, and Responsible AI sidebar
├── llm.py                     # IBM Granite prompt template + offline fallback engine
├── rag.py                     # TF-IDF RAG system using scikit-learn (no vector database needed)
├── requirements.txt           # Python library dependencies
├── .env.example               # Template for IBM watsonx.ai environment variables
├── README.md                  # Setup instructions and documentation
├── data/
│   └── waste_rules.md         # Reference summary of India's SWM Rules 2016
└── docs/
    ├── flow_diagram.md        # Mermaid architecture flowchart
    └── sample_io.md           # 5 sample test inputs & expected outputs
```
