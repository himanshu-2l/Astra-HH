import re
from typing import List, Dict, Any, Tuple

BLOCKED_PATTERNS = [
    "ignore all previous instructions",
    "system prompt override",
    "unauthorized_override",
    "drop table",
    "jailbreak",
    "malicious_exploit"
]

class GuardrailEngine:
    def __init__(self, min_relevance_threshold: float = 0.04):
        self.min_relevance_threshold = min_relevance_threshold

    def check_input_safety(self, query: str) -> Tuple[bool, str]:
        """Gate 1: Input Intent and Injection Safety."""
        if not query or not query.strip():
            return False, "Empty query received."
            
        q_lower = query.lower()
        for pattern in BLOCKED_PATTERNS:
            if pattern in q_lower:
                return False, f"Query rejected: Blocked safety pattern detected ('{pattern}')."
                
        return True, "Passed"

    def check_off_topic_relevance(self, top_chunks: List[Dict[str, Any]]) -> Tuple[bool, str]:
        """Gate 2: Off-topic / Out-of-domain Grounding Gate."""
        if not top_chunks:
            return False, "No relevant context found in MSMARCO corpus."
            
        top_score = top_chunks[0].get("rerank_score", 0.0)
        if top_score < self.min_relevance_threshold:
            return False, f"Query out-of-domain (relevance confidence {top_score:.2f} < threshold {self.min_relevance_threshold:.2f})."
            
        return True, "Passed"

    def validate_citations(self, answer: str, num_chunks: int) -> List[int]:
        """Gate 3: Extract and verify [1], [2] citation brackets."""
        found_citations = re.findall(r'\[(\d+)\]', answer)
        valid_citations = []
        for c in set(found_citations):
            idx = int(c)
            if 1 <= idx <= num_chunks:
                valid_citations.append(idx)
        return sorted(valid_citations)
