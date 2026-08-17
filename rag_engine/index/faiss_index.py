import faiss
import numpy as np
from pathlib import Path
from typing import Dict, Tuple

STRATEGIES = ["parent_child", "semantic", "fixed_overlap", "metadata_aware", "passage_whole"]

class FAISSIndexManager:
    def __init__(self, index_dir: str = "data/indices"):
        self.index_dir = Path(index_dir)
        self.index_dir.mkdir(parents=True, exist_ok=True)
        self.indices: Dict[str, faiss.Index] = {}

    def build_and_save(self, embeddings: np.ndarray, strategy: str, M: int = 32, ef_construction: int = 200) -> str:
        # Dynamically detect dimension (1024 for bge-m3)
        dim = embeddings.shape[1]
        idx = faiss.IndexHNSWFlat(dim, M, faiss.METRIC_INNER_PRODUCT)
        idx.hnsw.efConstruction = ef_construction
        idx.hnsw.efSearch = 64
        idx.add(embeddings.astype(np.float32))
        out_path = self.index_dir / f"faiss_{strategy}.bin"
        faiss.write_index(idx, str(out_path))
        return str(out_path)

    def load_all_to_ram(self):
        print("🧠 Loading all 5 FAISS indices directly into 512GB Host RAM...")
        for s in STRATEGIES:
            p = self.index_dir / f"faiss_{s}.bin"
            if not p.exists():
                raise FileNotFoundError(f"Missing index {p}. Build it first.")
            idx = faiss.read_index(str(p))
            idx.hnsw.efSearch = 64
            self.indices[s] = idx
            print(f"   • {s:16s}: {idx.ntotal:,} vectors active in RAM (dim={idx.d})")
        print("✅ All vector indices resident in RAM (0ms disk swap latency)!")

    def search_strategy(self, strategy: str, query_emb: np.ndarray, top_k: int = 50) -> Tuple[np.ndarray, np.ndarray]:
        q = query_emb.reshape(1, -1).astype(np.float32)
        scores, ids = self.indices[strategy].search(q, top_k)
        return scores[0], ids[0]
