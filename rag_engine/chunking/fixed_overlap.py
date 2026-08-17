from typing import List, Dict, Any

def chunk_fixed_overlap(doc_id: str, text: str, lang: str, chunk_size: int = 256, overlap: int = 50) -> List[Dict[str, Any]]:
    words = text.split()
    if not words:
        return []
    chunks = []
    step = chunk_size - overlap
    chunk_idx = 0
    for i in range(0, len(words), step):
        chunk_words = words[i:i + chunk_size]
        if not chunk_words:
            break
        chunks.append({
            'chunk_id': f"{doc_id}_fixed_{chunk_idx}",
            'doc_id': doc_id,
            'text': ' '.join(chunk_words),
            'strategy': 'fixed_overlap',
            'language': lang,
            'tokens': len(chunk_words)
        })
        chunk_idx += 1
        if i + chunk_size >= len(words):
            break
    return chunks
