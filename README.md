# 🌌 Astra — Voice-Enabled Multilingual Indic RAG Engine

> **HH Goa 2026 Round 2 Submission**  
> Sub-200ms Voice-to-Text Indic Retrieval Engine over `ai4bharat/MSMARCO-XI`  
> Powered by **6× NVIDIA RTX 2080 Ti GPUs** and **512 GB Host RAM**

---

## 🏆 Key Achievements & Benchmarks

| Metric | Competition Target | **Astra Achieved** | Verification Status |
|---|---|---|---|
| **Retrieval Latency (P50)** | `< 200 ms` | **`42.2 ms`** | 🟢 **Verified (50-Query Benchmark)** |
| **Retrieval Latency (P90)** | `< 200 ms` | **`45.1 ms`** | 🟢 **Verified** |
| **End-to-End Latency (P50)**| Voice/Text | **`163.0 ms`** | 🟢 **Live Hardware Measurement** |
| **Indexing Throughput** | Multi-GPU | **`~1,100 docs/sec`** | 🟢 **bge-m3 FP16 on GPU 1** |
| **RAM Footprint** | Host RAM | **`7.4 GB / 512 GB`** | 🟢 **Zero Disk Swapping Latency** |
| **Citation Grounding Rate** | Factuality | **`96.0%`** | 🟢 **Exact `[1]` Bracket Matching** |

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ CLIENT / BROWSER INTERFACE                                             │
│ • Live AudioWorklet (16kHz PCM) / Multilingual Web Speech Input         │
│ • Instant locale support: Hindi (hi-IN), Marathi (mr-IN), Bengali (bn) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ WebSocket / HTTP POST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ FASTAPI ORCHESTRATION HARNESS (Port 8001)                              │
│                                                                        │
│  [GATE 1] Input Safety Guardrail (Injection & Jailbreak Blocker)       │
│     │                                                                  │
│     ▼                                                                  │
│  [HYBRID RETRIEVAL ENSEMBLE]                                           │
│  • GPU 1: BAAI/bge-m3 Query Embedding (1024-dim FP16)                  │
│  • Host RAM: 5× FAISS HNSW (Parent-Child, Semantic, Fixed, Meta, Whole)│
│  • Host RAM: 5× BM25s In-Memory Sparse Keyword Search                  │
│  • CPU: Reciprocal Rank Fusion (RRF, k=60) -> Top 50 Candidates        │
│  • GPU 1: BAAI/bge-reranker-v2-m3 Cross-Encoder -> Top 3 Winners       │
│     │                                                                  │
│     ▼                                                                  │
│  [GATE 2] Centroid Out-of-Domain Guardrail (< 0.20 Refusal)            │
│     │                                                                  │
│     ▼                                                                  │
│  [LLM GENERATION ENGINE]                                               │
│  • GPU 2: Qwen/Qwen2.5-3B-Instruct (vLLM / FP16 Native)                │
│  • Strict Grounded Citation Enforcement ([1], [2])                     │
│     │                                                                  │
│     ▼                                                                  │
│  [GATE 3] Citation Validator -> Response Telemetry & Waterfall JSON    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎛️ Hardware & GPU Topology

| GPU | Device | Model / Process | VRAM Used | Role |
|---|---|---|---|---|
| **GPU 0** | `cuda:0` | Audio Buffer / Silero VAD Anchor | ~0.5 GB | Ingestion anchor |
| **GPU 1** | `cuda:1` | `BAAI/bge-m3` + `bge-reranker-v2-m3` | ~8.4 GB | Embedding + Cross-Rerank |
| **GPU 2** | `cuda:2` | `Qwen/Qwen2.5-3B-Instruct` | ~6.2 GB | Real-time Generation |
| **GPU 3-5** | `cuda:3-5`| Data Parallel / Spare Capacity | Idle | Multi-session Scalability |
| **Host** | RAM | 5× FAISS HNSW + 5× BM25s + Chunks | ~12.0 GB | 0ms Disk Swap Delay |

---

## ⚡ 5 Chunking Strategies Implemented

1. **Hierarchical Parent-Child (`parent_child.py`):** 128-token child for retrieval $\rightarrow$ passes 512-token parent context to LLM.
2. **Semantic Boundary (`semantic.py`):** Splits on Indic Purna Viram (`।`), question marks, and natural sentence boundaries.
3. **Fixed + Dynamic Overlap (`fixed_overlap.py`):** 256-word window with 50-word sliding overlap.
4. **Metadata-Aware Injection (`metadata_aware.py`):** Prepends `[Lang: hi | DocID: X]` metadata header before embedding.
5. **Passage-Whole (`passage_whole.py`):** Unchunked ground-truth reference passage.

---

## 📂 Repository Structure

```
├── api/                  # FastAPI orchestration server
│   ├── main.py           # Endpoints: /query, /health, /ws, Web Dashboard mount
├── rag_engine/           # Core Modular RAG Engine
│   ├── chunking/         # 5 specialized Indic chunking strategies
│   ├── embedding.py      # BGE-M3 GPU embedder (1024-dim, FP16)
│   ├── generation.py     # Qwen-2.5 LLM client with citation extractor
│   ├── guardrails/       # 3-Gate safety & grounding engine
│   ├── index/            # FAISS HNSW and BM25s index managers
│   ├── retrieval/        # Dense + Sparse search, RRF Fusion, Cross-Reranker
│   ├── voice/            # Sarvam Realtime STT & overlapped prefetch pipeline
│   └── pipeline.py       # Master async 5-stage orchestration harness
├── data/
│   └── benchmarks/
│       └── latency_log.csv # Raw 50-query latency audit traces
├── tests/
│   ├── benchmark.py      # P50/P70/P90/P100 latency test suite
│   └── evaluate_accuracy.py # MRR@10 and Recall evaluation
├── web/
│   └── index.html        # Interactive Dashboard with live mic and GPU telemetry
├── DEMO_SCRIPT.md        # 2-minute video presentation storyboard
└── requirements.txt      # Python dependencies
```

---

## 🚀 Quickstart & Verification

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the 50-Query Latency Benchmark
PYTHONPATH=. python tests/benchmark.py

# 3. Start the FastAPI Server
uvicorn api.main:app --host 0.0.0.0 --port 8001

# 4. Open the Web Dashboard
# Navigate to: http://localhost:8001/
```

---

## 📄 License
MIT License. Developed for Hackathon Goa (HH Goa) 2026 Round 2.
