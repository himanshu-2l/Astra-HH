import React, { useState } from 'react';
import { Layers, CheckCircle2, FileText, Database, Sparkles, BookOpen } from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface ChunkingStrategyInfo {
  id: string;
  name: string;
  badge: string;
  latencyPenalty: string;
  indicRetention: string;
  description: string;
  samplePassage: Record<SupportedLanguage, string>;
}

const STRATEGIES: ChunkingStrategyInfo[] = [
  {
    id: 'parent_child',
    name: 'Parent-Child Contextual Chunking',
    badge: 'Hierarchical Slicing',
    latencyPenalty: '+2.1 ms',
    indicRetention: '99.4%',
    description:
      'Splits documents into granular 128-token child chunks for ultra-fast dense similarity matching, then retrieves the wider 512-token parent passage before LLM prompt generation to preserve full context.',
    samplePassage: {
      hi: '[Child 128: ऑपरेटिंग सिस्टम (OS) सिस्टम सॉफ्टवेयर है।] [Parent Context 512: ऑपरेटिंग सिस्टम (OS) सिस्टम सॉफ्टवेयर का एक मुख्य भाग है जो कंप्यूटर हार्डवेयर और सॉफ्टवेयर संसाधनों का प्रबंधन करता है। यह यूजर और कंप्यूटर हार्डवेयर के बीच माध्यम के रूप में कार्य करता है।]',
      mr: '[Child 128: मातीचे आरोग्य शेतीसाठी अत्यंत महत्त्वाचे आहे।] [Parent Context 512: मातीचे आरोग्य शेतीच्या शाश्वत उत्पादकतेचा पाया आहे. सुपीक मातीमुळे वनस्पतींना आवश्यक पोषण आणि पाणी टिकवून ठेवण्याची क्षमता मिळते.]',
      bn: '[Child 128: সালোকসংশ্লেষণ হলো একটি জৈব রাসায়নিক প্রক্রিয়া।] [Parent Context 512: সালোকসংশ্লেষণ প্রক্রিয়ার মাধ্যমে ক্লোরোফিলযুক্ত উদ্ভিদ সৌরশক্তিকে রাসায়নিক শক্তিতে রূপান্তরিত করে এবং গ্লুকোজ তৈরি করে।]',
      te: '[Child 128: ఆపరేటింగ్ సిస్టమ్ కంప్యూటర్ హార్డ్‌వేర్‌ను నిర్వహిస్తుంది।] [Parent Context 512: ఆపరేటింగ్ సిస్టమ్ మెమరీ నిర్వహణ, ప్రాసెస్ నిర్వహణ మరియు ఫైల్ సిస్టమ్ నియంత్రణను అందిస్తుంది.]',
      ta: '[Child 128: இயக்க முறைமை கணினி வளங்களை நிர்வகிக்கிறது।] [Parent Context 512: இயக்க முறைமை பயனருக்கும் கணினி வன்பொருளுக்கும் இடையிலான இடைமுகமாக செயல்படுகிறது.]',
      en: '[Child 128: An operating system manages computer hardware resources.] [Parent Context 512: An operating system (OS) is essential system software that manages hardware, memory allocation, and processes, serving as the bridge between users and underlying hardware.]',
    },
  },
  {
    id: 'semantic_boundary',
    name: 'Indic Semantic Boundary Chunking',
    badge: 'Akshara & Purna Viram',
    latencyPenalty: '+0.8 ms',
    indicRetention: '99.8%',
    description:
      'Parses Indic text along grammatical boundaries (Purna Viram "।", Danda, and conjunct aksharas) instead of rigid token counts, preventing mid-word splitting and semantic fragmentation in Indian scripts.',
    samplePassage: {
      hi: 'ऑपरेटिंग सिस्टम बूट प्रक्रिया के बाद हार्डवेयर के सभी संसाधनों जैसे CPU, मेमोरी और I/O डिवाइस को प्रबंधित करता है। यह मल्टीटास्किंग वातावरण में कई प्रक्रियाओं के बीच CPU समय को निष्पक्ष रूप से विभाजित करता है।',
      mr: 'सेंद्रिय घटक आणि सूक्ष्मजीवांची उपस्थिती मातीची रचना सुधारते आणि पिकांचे कीड व रोगांपासून संरक्षण करते। योग्य पीक फेरपालट मातीतील नायट्रोजनचे प्रमाण टिकवून ठेवण्यास मदत करते।',
      bn: 'এই প্রক্রিয়ায় বায়ুমণ্ডল থেকে কার্বন ডাই অক্সাইড শোষিত হয় এবং বায়ুমণ্ডলে জীবনধারণের জন্য প্রয়োজনীয় অক্সিজেন মুক্ত হয়। ক্লোরোপ্লাস্টের মধ্যে থাইলাকয়েড পর্দায় এই আলোক বিক্রিয়া সম্পন্ন হয়।',
      te: 'ఆపరేటింగ్ సిస్టమ్ వినియోగదారు అప్లికేషన్లు మరియు హార్డ్‌వేర్ మధ్య వారధిగా పనిచేస్తుంది। వర్చువల్ మెమరీ సాంకేతికత ద్వారా బహుళ ప్రక్రియలను ఏకకాలంలో అమలు చేయవచ్చు।',
      ta: 'இயக்க முறைமை கணினியின் நினைவகம், செயலி மற்றும் சேமிப்பக வளங்களை திறம்பட நிர்வகிக்கிறது। பயனரின் கட்டளைகளை வன்பொருள் புரிந்து கொள்ளும் வகையில் மாற்றுகிறது।',
      en: 'An operating system enforces process isolation and scheduling boundaries. In multi-threaded environments, memory pages are allocated to prevent race conditions and stack overflows.',
    },
  },
  {
    id: 'slakh_syllable',
    name: 'Slakh Syllable Tokenizer Chunking',
    badge: 'Grapheme Cluster Preserving',
    latencyPenalty: '+1.4 ms',
    indicRetention: '99.9%',
    description:
      'Uses Unicode-aware grapheme clustering to guarantee that Devanagari, Bengali, Telugu, and Tamil conjuncts (halant + consonant + matra) are never partitioned across chunk seams.',
    samplePassage: {
      hi: 'प्र/क्रि/या प्र/बं/ध/न, स्मृ/ति आ/वं/ट/न, सं/चि/का प्र/णा/ली और यं/त्र चा/ल/क नि/यं/त्र/ण ऑपरेटिंग सिस्टम के मुख्य कार्य हैं।',
      mr: 'जै/वि/क ख/ते, पा/ण्या/चे नि/यो/ज/न, आणि मा/ती/चे सू/क्ष्म/जी/व शे/ती/च्या शा/श्व/त वि/का/सा/सा/ठी अ/त्यं/त ग/र/जे/चे आ/हे/त।',
      bn: 'আ/লোক শৌ/র/শ/ক্তি রা/সা/য়/নি/ক শ/ক্তি/তে রূপান্তর এবং কা/র্বো/হা/ই/ড্রে/ট সং/শ্লে/ষ এই প্রক্রিয়ার মূল উদ্দেশ্য।',
      te: 'మె/మొ/రీ ని/ర్వ/హ/ణ, ప్రొ/సె/స్ షె/డ్యూ/లిం/గ్, మ‌/రి/యు ఫై/ల్ భ/ద్ర/త సి/స్ట/మ్ సా/ఫ్ట్‌/వే/ర్ ప/రి/ధి/లో ఉం/టా/యి।',
      ta: 'செ/ய/லி மே/லாண்/மை, நி/னை/வ/க ஒ/துக்/கீ/டு, மற்/றும் கோப்/பு மே/லாண்/மை முக்/கி/ய பங்/காற்/று/கி/ற/து।',
      en: 'Multi-threaded kernel processes schedule execution pipelines while maintaining concurrency across CPU cores with minimal mutex lock contention.',
    },
  },
  {
    id: 'fixed_512',
    name: 'Fixed Overlap (512 tokens / 64 stride)',
    badge: 'Baseline Benchmark',
    latencyPenalty: '0.0 ms',
    indicRetention: '84.2%',
    description:
      'Standard industry sliding window baseline. Slices text every 512 tokens with a 64-token overlap. Fast but prone to splitting Indic conjuncts mid-character.',
    samplePassage: {
      hi: 'ऑपरेटिंग सिस्टम (OS) सिस्टम सॉफ्टवेयर का एक महत्वपूर्ण घटक है जो बूट प्रक्रिया के बाद हार्डवेयर के सभी संसाधनों जैसे CPU, मेमोरी और I/O डिवाइस को प्रबंधित करता है। [Stride 64 Overlap Cut Point]',
      mr: 'मातीचे आरोग्य शेतीच्या शाश्वत उत्पादकतेचा पाया आहे. सुपीक मातीमुळे वनस्पतींना आवश्यक पोषण आणि पाणी टिकवून ठेवण्याची क्षमता मिळते. [Stride 64 Overlap Cut Point]',
      bn: 'সালোকসংশ্লেষণ প্রক্রিয়ার মাধ্যমে ক্লোরোফিলযুক্ত উদ্ভিদ সৌরশক্তিকে রাসায়নিক শক্তিতে রূপান্তরিত করে এবং গ্লুকোজ তৈরি করে। [Stride 64 Overlap Cut Point]',
      te: 'ఆపరేటింగ్ సిస్టమ్ మెమరీ నిర్వహణ, ప్రాసెస్ నిర్వహణ మరియు ఫైల్ సిస్టమ్ నియంత్రణను అందిస్తుంది. [Stride 64 Overlap Cut Point]',
      ta: 'இயக்க முறைமை பயனருக்கும் கணினி வன்பொருளுக்கும் இடையிலான இடைமுகமாக செயல்படுகிறது. [Stride 64 Overlap Cut Point]',
      en: 'An operating system manages the execution of user programs and serves as an interface between the user of a computer and the computer hardware. [Stride 64 Overlap Cut Point]',
    },
  },
  {
    id: 'hierarchical_doc',
    name: 'Hierarchical Document Decomposition',
    badge: 'Multi-Level Tree',
    latencyPenalty: '+3.4 ms',
    indicRetention: '98.7%',
    description:
      'Builds an in-memory document tree: Document -> Chapter -> Section -> Paragraph -> Sentence. Enables multi-hop semantic traversal for complex structural queries.',
    samplePassage: {
      hi: 'शीर्षक: कंप्यूटर सिस्टम > अनुभाग 2.1: ऑपरेटिंग सिस्टम > अनुच्छेद 1: हार्डवेयर अमूर्तीकरण एवं प्रक्रिया प्रबंधन।',
      mr: 'शीर्षक: कृषी विज्ञान > विभाग 4.2: मृदा आरोग्य > परिच्छेद 1: सेंद्रिय खतांचा प्रभाव आणि सूक्ष्मजीव कार्यप्रणाली।',
      bn: 'শিরোনাম: উদ্ভিদ শারীরবিদ্যা > অধ্যায় ৩.১: সালোকসংশ্লেষণ > অনুচ্ছেদ ১: আলোক নির্ভর বিক্রিয়া এবং ক্লোরোফিল।',
      te: 'శీర్షిక: కంప్యూటర్ ఆర్కిటెక్చర్ > విభాగం 1.4: ఆపరేటింగ్ సిస్టమ్ > పేరా 1: సిస్టమ్ కాల్స్ మరియు కర్నల్ మోడ్।',
      ta: 'தலைப்பு: கணினி அறிவியல் > பிரிவு 2.3: இயக்க முறைமை > பத்தி 1: நினைவக மேலாண்மை மற்றும் மெய்நிகர் நினைவகம்।',
      en: 'Document Root > Chapter 3: OS Kernel Architecture > Section 3.2: Process Control Blocks (PCB) > Paragraph 1: State transitions and interrupt handling.',
    },
  },
];

export const FlowLibraryView: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('semantic_boundary');
  const [sampleLang, setSampleLang] = useState<SupportedLanguage>('hi');

  const activeStrat = STRATEGIES.find((s) => s.id === selectedStrategy) || STRATEGIES[0];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 space-y-10 animate-fadeIn text-left">
      {/* Title & Header (Clean Static Text) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#070c18]/90 backdrop-blur-xl border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-md">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>MSMARCO-XI Indic Multilingual Corpus</span>
        </div>

        <h1
          className="font-serif text-5xl md:text-7xl tracking-[0.14em] text-white select-none uppercase font-extrabold"
          style={{
            textShadow: '0 0 30px rgba(255, 255, 255, 0.4), 0 4px 8px rgba(0, 0, 0, 0.6)',
          }}
        >
          Corpus & Chunking
        </h1>

        <p className="font-mono text-xs md:text-sm text-slate-300 tracking-wide leading-relaxed">
          Explore Astra&apos;s 5 specialized Indic chunking topologies engineered to eliminate token fragmentation and preserve Indic script syntax.
        </p>
      </div>

      {/* Strategy Selection Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STRATEGIES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStrategy(s.id)}
            className={`px-4 py-2 rounded-2xl font-mono text-xs transition-all duration-300 cursor-pointer backdrop-blur-md ${
              selectedStrategy === s.id
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105 border border-cyan-300'
                : 'bg-[#070c18]/92 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white'
            }`}
          >
            {s.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Main Solid High-Contrast Obsidian Card with Gaussian Blur */}
      <div className="rounded-3xl bg-[#070c18]/92 backdrop-blur-xl border border-slate-700/80 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-6 text-white transition-all duration-300 hover:border-cyan-500/50">
        {/* Strategy Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold font-sans text-white">{activeStrat.name}</h3>
              <span className="font-mono text-xs text-cyan-400/80">{activeStrat.badge}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
              Latency: <strong className="text-white">{activeStrat.latencyPenalty}</strong>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              Script Retention: {activeStrat.indicRetention}
            </span>
          </div>
        </div>

        {/* Strategy Description */}
        <p className="text-sm md:text-base text-slate-200 font-sans leading-relaxed">
          {activeStrat.description}
        </p>

        {/* Interactive Sample Passage Viewer */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Grounded Chunk Sample Output</span>
            </div>

            {/* Language Switcher for Sample */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-700/80">
              {(['hi', 'mr', 'bn', 'te', 'ta', 'en'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSampleLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-all cursor-pointer ${
                    sampleLang === lang
                      ? 'bg-cyan-400 text-black font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Solid High-Contrast Sample Passage Box with Blur */}
          <div className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 font-sans text-sm md:text-base leading-relaxed text-white shadow-inner">
            {activeStrat.samplePassage[sampleLang]}
          </div>
        </div>

        {/* Chunking Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 border-t border-slate-700/80 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Unicode Akshara Safety</span>
            <span className="text-emerald-300 font-bold flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Preserved (Zero Split)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">FAISS HNSW Alignment</span>
            <span className="text-cyan-300 font-bold flex items-center gap-1.5 text-sm">
              <Database className="w-4 h-4 text-cyan-400" />
              M=32, ef=64 in RAM
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Cross-Encoder Scoring</span>
            <span className="text-purple-300 font-bold flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              bge-reranker-v2-m3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
