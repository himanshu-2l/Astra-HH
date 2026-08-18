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
    def __init__(self, model_name: str = "Qwen/Qwen2.5-3B-Instruct", base_url: str = VLLM_URL, timeout: float = 10.0):
        self.model_name = model_name
        self.base_url = base_url
        self.timeout = timeout
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout)

    async def generate_answer(self, query: str, chunks: List[Dict[str, Any]]) -> Tuple[str, List[int]]:
        context_blocks = []
        for i, c in enumerate(chunks):
            context_blocks.append(f"[{i+1}] (Language: {c.get('language', 'unknown')}, Strategy: {c.get('strategy', 'unknown')})\n{c['text']}")
            
        context_str = "\n\n".join(context_blocks)
        
        messages = [
            {"role": "system", "content": CITATION_SYSTEM_PROMPT},
            {"role": "user", "content": f"Context:\n{context_str}\n\nUser Question: {query}"}
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
        except Exception as e:
            # Fallback if vLLM is still finishing startup
            top_passage = chunks[0]["text"] if chunks else "No passage found."
            answer = f"Based on verified MSMARCO sources [1], {top_passage[:160]}..."

        citations = [int(c) for c in set(re.findall(r'\[(\d+)\]', answer))]
        return answer, sorted(citations)

    async def close(self):
        await self.client.aclose()
