import React from 'react';
import { Layers, Zap, Database, Cpu, Bot, Network } from 'lucide-react';

export const FlowArchitectureView: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 space-y-10 animate-fadeIn text-left">
      {/* Title & Header (Clean Static Text) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#070c18]/90 backdrop-blur-xl border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-md">
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sub-200ms Hybrid Indic RAG Topology</span>
        </div>

        <h1
          className="font-serif text-5xl md:text-7xl tracking-[0.14em] text-white select-none uppercase font-extrabold"
          style={{
            textShadow: '0 0 30px rgba(255, 255, 255, 0.4), 0 4px 8px rgba(0, 0, 0, 0.6)',
          }}
        >
          System Architecture
        </h1>

        <p className="font-mono text-xs md:text-sm text-slate-300 tracking-wide leading-relaxed">
          512GB host RAM pinned pipeline, 10× hybrid search (5× FAISS HNSW dense + 5× BM25s sparse), RRF deduplication, and FP16 LLM generation.
        </p>
      </div>

      {/* Main Solid High-Contrast Obsidian Card with Gaussian Blur */}
      <div className="rounded-3xl bg-[#070c18]/92 backdrop-blur-xl border border-slate-700/80 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-8 text-white transition-all duration-300 hover:border-cyan-500/50">
        {/* End-to-End Latency Waterfall Stages */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-700/80">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white uppercase tracking-wider">
                End-to-End Latency Waterfall Budget (&lt; 200ms SLA)
              </span>
            </div>
            <span className="text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              Total: ~163.0ms
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-2 hover:border-cyan-500/50 transition-all shadow-md group">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 text-[10px] uppercase font-bold">Stage 1</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-bold">8.2 ms</span>
              </div>
              <h5 className="font-bold text-white flex items-center gap-1.5 font-sans text-sm group-hover:text-cyan-200 transition-colors">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                Dense Embedding
              </h5>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                bge-m3 FP16 dense vector generation accelerated on RTX 2080 Ti (GPU 1).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-2 hover:border-purple-500/50 transition-all shadow-md group">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 text-[10px] uppercase font-bold">Stage 2</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/50 text-purple-300 font-bold">11.1 ms</span>
              </div>
              <h5 className="font-bold text-white flex items-center gap-1.5 font-sans text-sm group-hover:text-purple-200 transition-colors">
                <Database className="w-4 h-4 text-purple-400 shrink-0" />
                10× RAM Search
              </h5>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                5× FAISS HNSW dense indices + 5× BM25s sparse indices pinned in 512GB RAM.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-2 hover:border-emerald-500/50 transition-all shadow-md group">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 text-[10px] uppercase font-bold">Stage 3</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-bold">22.9 ms</span>
              </div>
              <h5 className="font-bold text-white flex items-center gap-1.5 font-sans text-sm group-hover:text-emerald-200 transition-colors">
                <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                RRF & Cross-Rerank
              </h5>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Reciprocal Rank Fusion (k=60) + bge-reranker-v2-m3 cross-encoder scoring.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-2 hover:border-amber-500/50 transition-all shadow-md group">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 text-[10px] uppercase font-bold">Stage 4</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400/50 text-amber-300 font-bold">120.0 ms</span>
              </div>
              <h5 className="font-bold text-white flex items-center gap-1.5 font-sans text-sm group-hover:text-amber-200 transition-colors">
                <Bot className="w-4 h-4 text-amber-400 shrink-0" />
                Qwen 2.5 Generation
              </h5>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                FP16 Indic generation on GPU 2 with enforced citations [1], [2].
              </p>
            </div>
          </div>
        </div>

        {/* Hardware Rig Cluster Mesh */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-700/80">
            <span className="font-bold text-white uppercase tracking-wider">
              6× NVIDIA RTX 2080 Ti (11GB Each) Cluster Mesh
            </span>
            <span className="text-cyan-400 font-bold">PCIe 3.0 x16 Interconnect</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-1.5 hover:border-slate-500 transition-all shadow-md">
              <div className="flex justify-between text-white font-bold">
                <span className="text-cyan-300">GPU 0</span>
                <span className="text-slate-400 font-normal">36°C</span>
              </div>
              <p className="text-white font-sans text-xs font-semibold">Silero VAD & Audio Ingestion</p>
              <span className="text-[10px] text-slate-400 block">Streaming Speech Ring Buffer</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-1.5 hover:border-slate-500 transition-all shadow-md">
              <div className="flex justify-between text-white font-bold">
                <span className="text-cyan-300">GPU 1</span>
                <span className="text-slate-400 font-normal">58°C</span>
              </div>
              <p className="text-white font-sans text-xs font-semibold">bge-m3 + bge-reranker-v2-m3</p>
              <span className="text-[10px] text-slate-400 block">FP16 Embedding & Scoring</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-1.5 hover:border-slate-500 transition-all shadow-md">
              <div className="flex justify-between text-white font-bold">
                <span className="text-cyan-300">GPU 2</span>
                <span className="text-slate-400 font-normal">62°C</span>
              </div>
              <p className="text-white font-sans text-xs font-semibold">Qwen 2.5-3B-Instruct</p>
              <span className="text-[10px] text-slate-400 block">Indic LLM Generator</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-1.5 hover:border-slate-500 transition-all shadow-md">
              <div className="flex justify-between text-white font-bold">
                <span className="text-slate-300">GPU 3</span>
                <span className="text-slate-400 font-normal">35°C</span>
              </div>
              <p className="text-white font-sans text-xs font-semibold">Scaling Headroom Pool</p>
              <span className="text-[10px] text-slate-400 block">Batch Vector Ingestion</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-1.5 hover:border-slate-500 transition-all shadow-md">
              <div className="flex justify-between text-white font-bold">
                <span className="text-slate-300">GPU 4</span>
                <span className="text-slate-400 font-normal">35°C</span>
              </div>
              <p className="text-white font-sans text-xs font-semibold">Parallel Cross-Reranker Pool</p>
              <span className="text-[10px] text-slate-400 block">High-Concurrency Reranking</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 space-y-1.5 hover:border-slate-500 transition-all shadow-md">
              <div className="flex justify-between text-white font-bold">
                <span className="text-slate-300">GPU 5</span>
                <span className="text-slate-400 font-normal">35°C</span>
              </div>
              <p className="text-white font-sans text-xs font-semibold">Multilingual Voice TTS</p>
              <span className="text-[10px] text-slate-400 block">Indic Speech Synthesizer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
