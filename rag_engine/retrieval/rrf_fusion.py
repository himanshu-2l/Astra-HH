from typing import List, Dict, Any
from collections import defaultdict

def reciprocal_rank_fusion(ranked_lists: List[List[Dict[str, Any]]], k: int = 60, top_n: int = 50) -> List[Dict[str, Any]]:
    rrf_scores = defaultdict(float)
    doc_map = {}

    for candidate_list in ranked_lists:
        for rank, item in enumerate(candidate_list):
            doc_id = item["doc_id"]
            rrf_scores[doc_id] += 1.0 / (k + (rank + 1))
            if doc_id not in doc_map:
                doc_map[doc_id] = item

    # Sort candidates by combined RRF score descending
    sorted_doc_ids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)
    
    results = []
    for doc_id in sorted_doc_ids[:top_n]:
        res = doc_map[doc_id].copy()
        res["rrf_score"] = rrf_scores[doc_id]
        results.append(res)
        
    return results
