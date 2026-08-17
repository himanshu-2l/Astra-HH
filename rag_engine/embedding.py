import torch
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List

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
        torch.cuda.empty_cache()
        print(f"Embedding model ready on {device} (VRAM optimized)!")

    def encode_texts(self, texts: List[str], batch_size: int = 64) -> np.ndarray:
        torch.cuda.empty_cache()
        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=True,
            normalize_embeddings=True,
            convert_to_numpy=True
        )
        return embeddings.astype(np.float32)

    def encode_query(self, query: str) -> np.ndarray:
        emb = self.model.encode(
            [query],
            normalize_embeddings=True,
            convert_to_numpy=True
        )
        return emb[0].astype(np.float32)
