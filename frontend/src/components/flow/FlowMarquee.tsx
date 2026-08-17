import React from 'react';

const ASTRA_TECH_STACK = [
  { name: 'PyTorch (CUDA)', desc: '6× RTX 2080 Ti FP16 Inference' },
  { name: 'FAISS HNSW', desc: 'Dense Vector Search in RAM' },
  { name: 'bge-m3', desc: 'Dense Multilingual Embeddings' },
  { name: 'bge-reranker-v2-m3', desc: 'Cross-Encoder Reranker' },
  { name: 'Qwen 2.5-3B', desc: 'Indic LLM Generation on GPU 2' },
  { name: 'FastAPI', desc: 'Sub-200ms Python Async Engine' },
  { name: 'BM25s (Lexical)', desc: 'Parallel Sparse RAM Scoring' },
  { name: 'Reciprocal Rank Fusion', desc: 'RRF k=60 Dedup Fusion' },
  { name: 'React 18 + Vite', desc: 'Flow 3D Frontend' },
  { name: 'Three.js / WebGL', desc: 'Raymarching Cosmic Universe' },
  { name: 'Web Speech API', desc: 'Indic Speech-to-Text' },
  { name: '512 GB Host RAM', desc: 'RAM-Pinned Corpus Topologies' },
];

export const FlowMarquee: React.FC = () => {
  return (
    <div className="flex flex-col items-center mb-6 w-full">
      <p className="font-mono text-[11px] text-white/40 mb-3 tracking-[0.15em] uppercase">
        Engineered with 6× RTX 2080 Ti & RAM Architecture:
      </p>

      <div
        className="relative w-full max-w-4xl overflow-hidden h-9"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <div className="flex gap-8 animate-marquee h-full items-center whitespace-nowrap">
          {ASTRA_TECH_STACK.concat(ASTRA_TECH_STACK).map((item, idx) => (
            <div
              key={idx}
              className="text-white/60 hover:text-white transition-all duration-300 group relative flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-purple-950/20 cursor-default"
              title={item.desc}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all" />
              <span className="font-mono text-xs text-white/80 group-hover:text-white font-medium">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
