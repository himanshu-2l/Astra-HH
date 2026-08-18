import torch
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict

class GPUEmbedder:
    def __init__(self, model_name: str = "BAAI/bge-m3", device: str = "cuda:1"):
        print(f"Loading embedding model '{model_name}' on {device} (FP16)...")
        self.device = device
        self.model = SentenceTransformer(
            model_name,
            device=device,
            model_kwargs={"use_safetensors": True}
        )
        self.model.half()  # Explicit FP16 for Turing RTX 2080 Ti
        self.model.max_seq_length = 512  # Optimal for our 256-token chunk size
        self.cache: Dict[str, np.ndarray] = {}
        
        # Intensive GPU Warmup to eliminate CUDA kernel cold-start latency
        print("🔥 Warming up embedding CUDA kernels...")
        warmup_queries = ["warmup query 1", "कंप्यूटर क्या है?", "सौर ऊर्जा", "science and tech", "deep learning"]
        for q in warmup_queries:
            self.model.encode([q], normalize_embeddings=True, convert_to_numpy=True)
        torch.cuda.empty_cache()
        print(f"Embedding model warmed up and ready on {device}!")

    def encode_texts(self, texts: List[str], batch_size: int = 64) -> np.ndarray:
        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=False,
            normalize_embeddings=True,
            convert_to_numpy=True
        )
        return embeddings.astype(np.float32)

    def encode_query(self, query: str) -> np.ndarray:
        if query in self.cache:
            return self.cache[query]
            
        emb = self.model.encode(
            [query],
            normalize_embeddings=True,
            convert_to_numpy=True
        )[0].astype(np.float32)
        
        if len(self.cache) < 2048:
            self.cache[query] = emb
        return emb
