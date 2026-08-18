import json
import bm25s
from pathlib import Path
from typing import Dict, List, Tuple

STRATEGIES = ["parent_child", "semantic", "fixed_overlap", "metadata_aware", "passage_whole"]

class BM25IndexManager:
    def __init__(self, index_dir: str = "data/indices"):
        self.index_dir = Path(index_dir)
        self.index_dir.mkdir(parents=True, exist_ok=True)
        self.indices: Dict[str, bm25s.BM25] = {}

    def build_and_save(self, chunk_texts: List[str], strategy: str):
        # Tokenize corpus into words
        corpus_tokens = bm25s.tokenize(chunk_texts, stopwords="en")
        retriever = bm25s.BM25()
        retriever.index(corpus_tokens)
        save_path = self.index_dir / f"bm25_{strategy}"
        retriever.save(str(save_path))
        return str(save_path)

    def load_all_to_ram(self):
        print("📚 Loading BM25s sparse indices into RAM...")
        for s in STRATEGIES:
            p = self.index_dir / f"bm25_{s}"
            retriever = bm25s.BM25.load(str(p), mmap=False)  # mmap=False loads fully into RAM
            self.indices[s] = retriever
            print(f"   • {s:16s}: sparse index active in RAM")
        print("✅ All BM25 sparse indices resident in RAM!")

    def search_strategy(self, strategy: str, query: str, top_k: int = 50) -> Tuple[List[int], List[float]]:
        query_tokens = bm25s.tokenize([query], stopwords="en")
        doc_ids, scores = self.indices[strategy].retrieve(query_tokens, k=top_k)
        return doc_ids[0].tolist(), scores[0].tolist()

    def search_strategy_tokens(self, strategy: str, query_tokens: Any, top_k: int = 50) -> Tuple[List[int], List[float]]:
        doc_ids, scores = self.indices[strategy].retrieve(query_tokens, k=top_k)
        return doc_ids[0].tolist(), scores[0].tolist()
