import json, time
import numpy as np
import bm25s
from typing import List, Dict, Any
from concurrent.futures import ThreadPoolExecutor
from rag_engine.embedding import GPUEmbedder
from rag_engine.index.faiss_index import FAISSIndexManager
from rag_engine.index.bm25_index import BM25IndexManager
from rag_engine.retrieval.rrf_fusion import reciprocal_rank_fusion
from rag_engine.retrieval.reranker import GPUReranker

STRATEGIES = ["parent_child", "semantic", "fixed_overlap", "metadata_aware", "passage_whole"]

class EnsembleRetriever:
    def __init__(self, embed_device: str = "cuda:1", rerank_device: str = "cuda:1"):
        print("🚀 Initializing Ensemble Retriever Engine...")
        self.embedder = GPUEmbedder(device=embed_device)
        self.reranker = GPUReranker(device=rerank_device)
        
        self.faiss_mgr = FAISSIndexManager()
        self.faiss_mgr.load_all_to_ram()
        
        self.bm25_mgr = BM25IndexManager()
        self.bm25_mgr.load_all_to_ram()
        
        # Persistent thread pool to avoid per-query thread initialization overhead
        self.executor = ThreadPoolExecutor(max_workers=5)
        
        # Load all chunk lookup metadata into memory
        print("📖 Loading chunk lookup mappings into RAM...")
        self.chunk_lookups = {}
        for s in STRATEGIES:
            lookup = []
            with open(f"data/chunks/{s}.jsonl", "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        lookup.append(json.loads(line))
            self.chunk_lookups[s] = lookup
            
        # Full end-to-end warmup
        print("🔥 Running end-to-end retrieval warmup...")
        self.search("warmup pipeline query", top_k=3)
        print("✅ Ensemble Retriever fully loaded, warmed up, and primed in RAM!")

    def search(self, query: str, top_k: int = 5) -> Dict[str, Any]:
        t0 = time.perf_counter()
        
        # 1. Query Embedding
        t_emb_start = time.perf_counter()
        query_emb = self.embedder.encode_query(query)
        t_emb = (time.perf_counter() - t_emb_start) * 1000
        
        # 2. Parallel Search across all 5 FAISS + 5 BM25s indices
        t_search_start = time.perf_counter()
        
        # Tokenize BM25 once for all 5 strategies
        query_tokens = bm25s.tokenize([query], stopwords="en")
        
        def search_strategy(strategy):
            # Dense Search
            dense_scores, dense_ids = self.faiss_mgr.search_strategy(strategy, query_emb, top_k=30)
            dense_results = [self.chunk_lookups[strategy][idx] for idx in dense_ids if idx < len(self.chunk_lookups[strategy])]
            
            # Sparse Search with pre-tokenized query
            sparse_ids, sparse_scores = self.bm25_mgr.search_strategy_tokens(strategy, query_tokens, top_k=30)
            sparse_results = [self.chunk_lookups[strategy][idx] for idx in sparse_ids if idx < len(self.chunk_lookups[strategy])]
            
            return dense_results, sparse_results

        results = list(self.executor.map(search_strategy, STRATEGIES))
        ranked_lists = []
        for dense_res, sparse_res in results:
            ranked_lists.append(dense_res)
            ranked_lists.append(sparse_res)
                
        t_search = (time.perf_counter() - t_search_start) * 1000
        
        # 3. RRF Fusion
        t_fuse_start = time.perf_counter()
        fused_candidates = reciprocal_rank_fusion(ranked_lists, k=60, top_n=30)
        t_fuse = (time.perf_counter() - t_fuse_start) * 1000
        
        # 4. Cross-Encoder Re-ranking
        t_rerank_start = time.perf_counter()
        top_chunks = self.reranker.rerank(query, fused_candidates, top_k=top_k, max_candidates=10)
        t_rerank = (time.perf_counter() - t_rerank_start) * 1000
        
        total_latency = (time.perf_counter() - t0) * 1000
        
        return {
            "query": query,
            "top_chunks": top_chunks,
            "latency": {
                "embed_ms": round(t_emb, 2),
                "ann_search_ms": round(t_search, 2),
                "rrf_fusion_ms": round(t_fuse, 2),
                "rerank_ms": round(t_rerank, 2),
                "total_retrieval_ms": round(total_latency, 2)
            }
        }
