import React from 'react';
import { 
  Recycle, 
  Scale, 
  ShieldCheck, 
  Eye, 
  Lock, 
  AlertTriangle, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  Info, 
  Upload, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Code
} from 'lucide-react';
import { runTfidfAndClassify, SegregationResult, SWM_2016_RULES } from './data/rules';

const PRESET_EXAMPLES = [
  'Used pizza box',
  'Old mobile battery',
  'Banana peels',
  'Plastic milk pouch',
  'Expired paracetamol syrup'
];

export default function App() {
  const [inputValue, setInputValue] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'app' | 'docs' | 'rules'>('app');
  const [result, setResult] = React.useState<SegregationResult | null>(() => runTfidfAndClassify('Used pizza box'));
  const [showSourceDetails, setShowSourceDetails] = React.useState(true);
  const [activeExpander, setActiveExpander] = React.useState<string | null>('transparency');

  const handleClassify = (text: string) => {
    if (!text.trim()) return;
    setResult(runTfidfAndClassify(text));
  };

  const toggleExpander = (id: string) => {
    setActiveExpander(current => current === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner indicating Streamlit & Python files built */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-emerald-300">1M1B - IBM SkillsBuild Internship Project</span>
          <span className="text-emerald-300/60">|</span>
          <span>UN SDG 12: Responsible Consumption & Production</span>
        </div>
        <div className="flex items-center gap-3 text-emerald-200">
          <span className="hidden sm:inline">Streamlit files ready: <code>app.py</code>, <code>rag.py</code>, <code>llm.py</code></span>
        </div>
      </div>

      {/* Main App Layout with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto shadow-sm my-0 md:my-4 bg-white border border-slate-200 md:rounded-xl overflow-hidden">
        
        {/* Left Sidebar: Responsible AI & SDG Guidelines */}
        <aside className="w-full md:w-80 bg-slate-100/80 border-r border-slate-200 p-5 flex flex-col gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg mb-1">
              <Recycle className="w-6 h-6 text-emerald-600" />
              <span>EcoSort Mission</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI-guided household waste segregation for campus hostels, households, and sanitation teams.
            </p>
          </div>

          {/* SDG Badges */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sustainable Development Goals</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 p-1.5 bg-amber-50 text-amber-900 rounded font-medium border border-amber-200">
                <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">SDG 12</span>
                <span>Responsible Consumption</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-sky-50 text-sky-900 rounded border border-sky-200">
                <span className="bg-sky-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">SDG 11</span>
                <span>Sustainable Communities</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-teal-50 text-teal-900 rounded border border-teal-200">
                <span className="bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">SDG 13</span>
                <span>Climate Action</span>
              </div>
            </div>
          </div>

          {/* Responsible AI Considerations */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Responsible AI Principles</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Essential ethics framework developed for IBM SkillsBuild internship criteria.
            </p>

            <div className="space-y-2">
              {/* Fairness */}
              <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => toggleExpander('fairness')}
                  className="w-full flex items-center justify-between p-2.5 text-left font-medium text-xs text-slate-700 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    1. Fairness & Inclusivity
                  </span>
                  {activeExpander === 'fairness' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {activeExpander === 'fairness' && (
                  <div className="p-2.5 pt-0 text-xs text-slate-600 bg-white border-t border-slate-100">
                    Works across student hostels and diverse households using plain-language Indian terminology without regional bias.
                  </div>
                )}
              </div>

              {/* Transparency */}
              <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => toggleExpander('transparency')}
                  className="w-full flex items-center justify-between p-2.5 text-left font-medium text-xs text-slate-700 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    2. Transparency & RAG
                  </span>
                  {activeExpander === 'transparency' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {activeExpander === 'transparency' && (
                  <div className="p-2.5 pt-0 text-xs text-slate-600 bg-white border-t border-slate-100">
                    Every output cites the exact rule clause from India's Solid Waste Management Rules 2016 so users understand the biological and chemical reasoning.
                  </div>
                )}
              </div>

              {/* Privacy */}
              <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => toggleExpander('privacy')}
                  className="w-full flex items-center justify-between p-2.5 text-left font-medium text-xs text-slate-700 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    3. Privacy by Design
                  </span>
                  {activeExpander === 'privacy' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {activeExpander === 'privacy' && (
                  <div className="p-2.5 pt-0 text-xs text-slate-600 bg-white border-t border-slate-100">
                    Zero user tracking. No login or database persistence required. Runs purely in-memory.
                  </div>
                )}
              </div>

              {/* Safety */}
              <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => toggleExpander('safety')}
                  className="w-full flex items-center justify-between p-2.5 text-left font-medium text-xs text-slate-700 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    4. Safety & Sanitation Workers
                  </span>
                  {activeExpander === 'safety' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {activeExpander === 'safety' && (
                  <div className="p-2.5 pt-0 text-xs text-slate-600 bg-white border-t border-slate-100">
                    Protects waste handlers by strictly isolating sharps, biomedical diapers, and toxic e-waste into distinct safe disposal streams.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200 text-[11px] text-slate-400">
            IBM watsonx.ai & Granite ready · Scikit-Learn TF-IDF RAG
          </div>
        </aside>

        {/* Right Main Panel */}
        <main className="flex-1 p-6 md:p-8 flex flex-col">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>EcoSort: AI Waste Segregation Guide</span>
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Grounding waste segregation in India's Solid Waste Management Rules 2016 using TF-IDF RAG
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <button 
                onClick={() => setActiveTab('app')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'app' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
              >
                Prototype
              </button>
              <button 
                onClick={() => setActiveTab('rules')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'rules' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
              >
                SWM Rules
              </button>
              <button 
                onClick={() => setActiveTab('docs')}
                className={`px-3 py-1.5 rounded-md transition ${activeTab === 'docs' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'hover:text-slate-900'}`}
              >
                Architecture & Run
              </button>
            </div>
          </div>

          {activeTab === 'app' && (
            <div className="space-y-6">
              {/* Quick Preset Buttons */}
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-2">Try sample household waste items:</div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_EXAMPLES.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setInputValue(preset);
                        handleClassify(preset);
                      }}
                      className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-full text-slate-700 transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input Search Bar */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleClassify(inputValue);
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type any waste item (e.g. used pizza box, old battery, banana peels)..."
                    className="w-full px-4 py-3 pl-11 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-slate-900"
                  />
                  <Trash2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Segregate</span>
                </button>
              </form>

              {/* Optional Image Upload Multimodal Hook (Marked as clearly stated in spec) */}
              <div className="p-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>
                    <strong className="text-slate-700">Multimodal Image Upload:</strong> Marked as <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">TODO</span> for future IBM Granite Vision integration.
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Current version: Instant natural-language RAG</span>
              </div>

              {/* Classification Result Card */}
              {result && (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  {/* Bin Header */}
                  <div className={`p-5 flex flex-wrap items-center justify-between gap-4 border-b ${
                    result.binColor === 'Green' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' :
                    result.binColor === 'Blue' ? 'bg-sky-50 border-sky-200 text-sky-950' :
                    result.binColor === 'Yellow' ? 'bg-amber-50 border-amber-200 text-amber-950' :
                    'bg-rose-50 border-rose-200 text-rose-950'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner ${
                        result.binColor === 'Green' ? 'bg-emerald-600 text-white' :
                        result.binColor === 'Blue' ? 'bg-sky-600 text-white' :
                        result.binColor === 'Yellow' ? 'bg-amber-500 text-white' :
                        'bg-rose-600 text-white'
                      }`}>
                        {result.binColor === 'Green' && '🟢'}
                        {result.binColor === 'Blue' && '🔵'}
                        {result.binColor === 'Yellow' && '🟡'}
                        {result.binColor === 'Red' && '🔴'}
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-75">Designated Bin Color</div>
                        <div className="text-2xl font-bold tracking-tight">
                          {result.binColor} Bin ({result.category})
                        </div>
                      </div>
                    </div>
                    <div className="text-xs px-3 py-1.5 bg-white/80 rounded-full font-medium border border-slate-200 shadow-2xs">
                      Engine: <span className="text-emerald-700 font-semibold">{result.mode}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 grid md:grid-cols-2 gap-6">
                    {/* Reason */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Why this category? (Transparency)</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                        {result.reason}
                      </p>
                    </div>

                    {/* Eco Tip */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>One Reduce / Reuse Tip</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed bg-amber-50/50 p-3.5 rounded-lg border border-amber-200">
                        {result.tip}
                      </p>
                    </div>
                  </div>

                  {/* Safety Warning for Hazardous Waste */}
                  {result.isHazardous && (
                    <div className="mx-6 mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block mb-0.5">Critical Safety & Health Advisory:</strong>
                        This item contains hazardous, electronic, or biomedical contaminants. Under SWM Rules 2016, do NOT mix this with general hostel or domestic waste. Store separately and deposit at authorized collection centers or notify municipal authorities.
                      </div>
                    </div>
                  )}

                  {/* Source Used (RAG Grounding) */}
                  <div className="border-t border-slate-200 bg-slate-50/70 p-5">
                    <button
                      onClick={() => setShowSourceDetails(!showSourceDetails)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 mb-2 hover:text-emerald-700"
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>Source Used: {result.sourceUsed.title}</span>
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        Relevance: {(result.sourceUsed.relevanceScore * 100).toFixed(0)}% {showSourceDetails ? '▲' : '▼'}
                      </span>
                    </button>
                    {showSourceDetails && (
                      <div className="mt-2 text-xs text-slate-600 space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200">
                        <div className="font-semibold text-emerald-800">
                          Legal Clause: {result.sourceUsed.clause}
                        </div>
                        <p className="leading-relaxed font-mono text-[11px] text-slate-600 bg-slate-50 p-2 rounded">
                          "{result.sourceUsed.snippet}"
                        </p>
                        <div className="text-[11px] text-slate-400 italic">
                          Grounding retrieved from <code>data/waste_rules.md</code> using TF-IDF cosine similarity.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="text-sm text-slate-600 mb-2">
                Browse the complete reference knowledge base loaded from <code>data/waste_rules.md</code> representing India's <strong>Solid Waste Management Rules 2016</strong>.
              </div>
              <div className="grid gap-3">
                {SWM_2016_RULES.map((rule) => (
                  <div key={rule.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>{rule.title}</span>
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        rule.binColor === 'Green' ? 'bg-emerald-100 text-emerald-800' :
                        rule.binColor === 'Blue' ? 'bg-sky-100 text-sky-800' :
                        rule.binColor === 'Yellow' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {rule.binColor} Bin
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-700 mb-1">{rule.clause}</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{rule.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {rule.keywords.slice(0, 10).map((k) => (
                        <span key={k} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6 text-sm text-slate-700">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h3 className="font-bold text-emerald-900 mb-1 flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-700" />
                  <span>How to Run the Python Streamlit App</span>
                </h3>
                <p className="text-xs text-emerald-800 mb-3 leading-relaxed">
                  All required Python files have been generated in your workspace (<code>app.py</code>, <code>llm.py</code>, <code>rag.py</code>, <code>data/waste_rules.md</code>).
                </p>
                <div className="bg-slate-900 text-emerald-400 p-3.5 rounded-lg font-mono text-xs space-y-1.5">
                  <div className="text-slate-400"># 1. Create and activate virtual environment</div>
                  <div>python -m venv venv</div>
                  <div>venv\Scripts\activate   <span className="text-slate-500"># On Windows</span></div>
                  <div>source venv/bin/activate <span className="text-slate-500"># On Mac/Linux</span></div>
                  <div className="text-slate-400 pt-2"># 2. Install requirements</div>
                  <div>pip install -r requirements.txt</div>
                  <div className="text-slate-400 pt-2"># 3. Launch the Streamlit application</div>
                  <div className="text-yellow-300 font-bold">streamlit run app.py</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Generated Project Files Summary</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4">
                  <li><strong><code>app.py</code></strong>: The Streamlit user interface with bin color badges, RAG citation cards, quick sample buttons, and the Responsible AI sidebar.</li>
                  <li><strong><code>rag.py</code></strong>: Lightweight TF-IDF chunk retriever utilizing scikit-learn to parse <code>data/waste_rules.md</code> without requiring an external vector DB.</li>
                  <li><strong><code>llm.py</code></strong>: Integration with IBM watsonx.ai (Granite model) with automatic fallback to deterministic rule matching in Demo Mode.</li>
                  <li><strong><code>data/waste_rules.md</code></strong>: Plain-language legal summary of India's Solid Waste Management Rules 2016.</li>
                  <li><strong><code>docs/flow_diagram.md</code></strong>: Mermaid diagram representing the complete retrieval and classification lifecycle.</li>
                  <li><strong><code>docs/sample_io.md</code></strong>: 5 verified sample inputs and outputs for testing and evaluation.</li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
