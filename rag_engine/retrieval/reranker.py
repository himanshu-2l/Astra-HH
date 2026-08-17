import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from typing import List, Dict, Any

class GPUReranker:
    def __init__(self, model_name: str = "BAAI/bge-reranker-v2-m3", device: str = "cuda:1"):
        print(f"Loading re-ranker '{model_name}' on {device} (FP16)...")
        self.device = device
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_name,
            torch_dtype=torch.float16,
            use_safetensors=True
        ).to(device)
        self.model.eval()
        
        # GPU Warmup to eliminate CUDA kernel cold-start latency
        dummy_inputs = self.tokenizer([["warmup query", "warmup passage"]], return_tensors="pt").to(device)
        with torch.no_grad():
            self.model(**dummy_inputs)
        print(f"Re-ranker model warmed up and ready on {device}!")

    @torch.no_grad()
    def rerank(self, query: str, candidates: List[Dict[str, Any]], top_k: int = 5, max_candidates: int = 20) -> List[Dict[str, Any]]:
        if not candidates:
            return []
        
        # Take top 20 candidates for high-speed sub-25ms cross-attention
        eval_candidates = candidates[:max_candidates]
        pairs = [[query, c["text"]] for c in eval_candidates]
        
        inputs = self.tokenizer(
            pairs,
            padding=True,
            truncation=True,
            max_length=256,
            return_tensors="pt"
        ).to(self.device)

        scores = self.model(**inputs, return_dict=True).logits.view(-1).float()
        scores = torch.sigmoid(scores).cpu().numpy()

        scored_candidates = []
        for cand, score in zip(eval_candidates, scores):
            cand_copy = cand.copy()
            cand_copy["rerank_score"] = float(score)
            scored_candidates.append(cand_copy)

        scored_candidates.sort(key=lambda x: x["rerank_score"], reverse=True)
        return scored_candidates[:top_k]
