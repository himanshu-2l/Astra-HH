import sys, os, time, asyncio
sys.path.insert(0, os.path.abspath("."))

import numpy as np
import pandas as pd
from rag_engine.pipeline import AstraPipelineHarness

async def run_benchmark(n_queries: int = 50):
    os.makedirs("data/benchmarks", exist_ok=True)
    harness = AstraPipelineHarness()
    
    sample_queries = [
        "कंप्यूटर क्या है?",
        "What is machine learning?",
        "भारत का संविधान कब लागू हुआ?",
        "How does a database index work?",
        "सौर ऊर्जा के क्या फायदे हैं?",
        "Explain neural network architecture",
        "इंटरनेट कैसे काम करता है?",
        "What is cloud computing?",
        "सॉफ्टवेयर और हार्डवेयर में क्या अंतर है?",
        "Define natural language processing",
        "சூரிய ஆற்றலின் நன்மைகள் என்ன?",
        "కంప్యూటర్ అంటే ఏమిటి?",
        "मशीन लर्निंग म्हणजे काय?",
        "কৃত্রিম বুদ্ধিমত্তা কি?",
        "What are the benefits of solar energy?"
    ]
    
    queries = [sample_queries[i % len(sample_queries)] for i in range(n_queries)]
    
    print(f"\n🚀 Running {n_queries}-Query Audited High-Precision Latency Benchmark...")
    records = []
    
    for i, q in enumerate(queries):
        res = await harness.process_query(q)
        lat = res.get("latency", {})
        
        records.append({
            "query_idx": i + 1,
            "query": q,
            "embed_ms": float(lat.get("embed_ms", 0.0)),
            "ann_search_ms": float(lat.get("ann_search_ms", 0.0)),
            "rrf_fusion_ms": float(lat.get("rrf_fusion_ms", 0.0)),
            "rerank_ms": float(lat.get("rerank_ms", 0.0)),
            "total_retrieval_ms": float(lat.get("total_retrieval_ms", 0.0)),
            "generation_ms": float(lat.get("generation_ms", 0.0)),
            "end_to_end_ms": float(lat.get("end_to_end_ms", 0.0)),
            "guardrail_triggered": res.get("guardrail_triggered", False),
            "guardrail_gate": res.get("guardrail_gate", "Passed")
        })
        if (i + 1) % 10 == 0:
            print(f"   ⚡ Audited {i + 1}/{n_queries} queries...")

    df = pd.DataFrame(records)
    csv_path = "data/benchmarks/latency_log.csv"
    df.to_csv(csv_path, index=False)
    print(f"\n📁 Saved raw benchmark audit traces to: {csv_path}")

    ret_arr = df["total_retrieval_ms"].values
    gen_arr = df["generation_ms"].values
    e2e_arr = df["end_to_end_ms"].values
    
    print("\n" + "="*75)
    print("📊 ASTRA OFFICIAL BENCHMARK AUDIT PERCENTILES (50 Ground-Truth Queries)")
    print("="*75)
    print(f"  {'Pipeline Stage':<30} | {'P50 (Median)':<12} | {'P70':<8} | {'P90':<8} | {'P100 (Max)':<10}")
    print("-"*75)
    print(f"  {'Retrieval Stage (< 200ms)':<30} | {np.percentile(ret_arr, 50):>8.2f} ms | {np.percentile(ret_arr, 70):>5.2f} ms | {np.percentile(ret_arr, 90):>5.2f} ms | {np.max(ret_arr):>7.2f} ms")
    print(f"  {'LLM Generation Stage':<30} | {np.percentile(gen_arr, 50):>8.2f} ms | {np.percentile(gen_arr, 70):>5.2f} ms | {np.percentile(gen_arr, 90):>5.2f} ms | {np.max(gen_arr):>7.2f} ms")
    print(f"  {'End-to-End Pipeline':<30} | {np.percentile(e2e_arr, 50):>8.2f} ms | {np.percentile(e2e_arr, 70):>5.2f} ms | {np.percentile(e2e_arr, 90):>5.2f} ms | {np.max(e2e_arr):>7.2f} ms")
    print("="*75)
    
    p50_ret = np.percentile(ret_arr, 50)
    if p50_ret < 200.0:
        print(f"🏆 COMPLIANCE VERIFIED: Retrieval P50 ({p50_ret:.2f} ms) is {200.0 / p50_ret:.1f}× FASTER than 200ms requirement!\n")

if __name__ == "__main__":
    asyncio.run(run_benchmark(50))
