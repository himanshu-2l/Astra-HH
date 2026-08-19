import re
import httpx
from typing import List, Dict, Any, Tuple

VLLM_URL = "http://localhost:8002/v1"

CITATION_SYSTEM_PROMPT = (
    "You are Astra, a helpful and precise voice assistant. "
    "Answer the user query ONLY using the provided verified source passages. "
    "For every factual claim, cite the source number using bracket notation like [1], [2]. "
    "If the answer cannot be found in the provided sources, explicitly state: "
    "'I cannot find verified information in the provided context to answer this query.' "
    "Keep answers concise, direct, and conversational for voice playback."
)

class LLMClient:
    def __init__(self, vllm_url: str = "http://localhost:8002/v1", model_name: str = "Qwen/Qwen2.5-3B-Instruct", timeout: float = 30.0):
        self.vllm_url = vllm_url
        self.model_name = model_name
        self.timeout = timeout
        self.client = httpx.AsyncClient(base_url=self.vllm_url, timeout=self.timeout)

    async def generate_answer(self, query: str, chunks: List[Dict[str, Any]]) -> Tuple[str, List[int]]:
        context_parts = []
        for idx, c in enumerate(chunks, 1):
            context_parts.append(f"[{idx}] {c['text']}")
        
        context_str = "\n\n".join(context_parts)
        
        system_prompt = (
            "You are Astra, an ultra-fast, accurate Indic Voice RAG assistant. "
            "Answer the user query strictly using the provided numbered context passages. "
            "Keep the answer concise (1-2 sentences) and conversational for voice output. "
            "You MUST cite your claims using bracketed numbers like [1], [2] corresponding to the sources used."
        )
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context:\n{context_str}\n\nUser Question: {query}\n\nAnswer:"}
        ]
        
        try:
            resp = await self.client.post("/chat/completions", json={
                "model": self.model_name,
                "messages": messages,
                "max_tokens": 80,
                "temperature": 0.1,
                "stop": ["\n\n", "User Question:", "Context:"],
                "stream": False
            })
            resp.raise_for_status()
            answer = resp.json()["choices"][0]["message"]["content"]
            citations = [int(c) for c in set(re.findall(r'\[(\d+)\]', answer))]
            return answer, sorted(citations)
        except Exception as e:
            # Fallback if vLLM is still finishing startup or experiencing transient error
            top_passage = chunks[0]["text"] if chunks else "No passage found."
            answer = f"Answer generated from retrieved context [1]: {top_passage[:150]}..."
            return answer, [1]

    async def close(self):
        await self.client.aclose()
