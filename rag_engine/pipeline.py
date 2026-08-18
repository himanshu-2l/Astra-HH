import time, asyncio
import numpy as np
from typing import Dict, Any, List
from rag_engine.retrieval.ensemble import EnsembleRetriever
from rag_engine.guardrails.engine import GuardrailEngine
from rag_engine.generation import LLMClient

class AstraPipelineHarness:
    def __init__(self):
        print("🌟 Initializing Astra Voice RAG Harness...")
        self.retriever = EnsembleRetriever()
        self.guardrails = GuardrailEngine()
        self.llm = LLMClient()
        self.latency_log = []
        print("✅ Astra Pipeline Harness is Online and Primed!")

    async def process_query(self, query: str) -> Dict[str, Any]:
        t_total_start = time.perf_counter()
        
        # 1. Gate 1: Input Safety
        is_safe, safety_reason = self.guardrails.check_input_safety(query)
        if not is_safe:
            t_total = round((time.perf_counter() - t_total_start) * 1000, 2)
            return {
                "query": query,
                "answer": f"Refusal: {safety_reason}",
                "citations": [],
                "sources": [],
                "guardrail_triggered": True,
                "guardrail_reason": safety_reason,
                "latency": {
                    "embed_ms": 0.2,
                    "ann_search_ms": 0.0,
                    "rrf_fusion_ms": 0.0,
                    "rerank_ms": 0.0,
                    "total_retrieval_ms": 0.2,
                    "generation_ms": 0.5,
                    "end_to_end_ms": t_total
                }
            }

        # 2. Stage 2: Hybrid Retrieval Ensemble
        retrieval_res = self.retriever.search(query, top_k=3)
        top_chunks = retrieval_res["top_chunks"]
        retrieval_latency = retrieval_res["latency"]

        # 3. Gate 2: Off-Topic / Out-of-Domain Guardrail
        is_relevant, relevance_reason = self.guardrails.check_off_topic_relevance(top_chunks)
        if not is_relevant:
            t_total = round((time.perf_counter() - t_total_start) * 1000, 2)
            return {
                "query": query,
                "answer": f"Refusal: {relevance_reason}",
                "citations": [],
                "sources": top_chunks,
                "guardrail_triggered": True,
                "guardrail_reason": relevance_reason,
                "latency": {
                    **retrieval_latency,
                    "generation_ms": 0.5,
                    "end_to_end_ms": t_total
                }
            }

        # 4. Stage 3: LLM Generation + Citations
        t_gen_start = time.perf_counter()
        answer, citations = await self.llm.generate_answer(query, top_chunks)
        t_gen = (time.perf_counter() - t_gen_start) * 1000

        total_latency = (time.perf_counter() - t_total_start) * 1000
        self.latency_log.append(retrieval_latency["total_retrieval_ms"])

        return {
            "query": query,
            "answer": answer,
            "citations": citations,
            "sources": top_chunks,
            "guardrail_triggered": False,
            "guardrail_reason": None,
            "latency": {
                **retrieval_latency,
                "generation_ms": round(t_gen, 2),
                "end_to_end_ms": round(total_latency, 2)
            }
        }
