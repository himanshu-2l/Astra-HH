from typing import List, Dict, Any

def chunk_parent_child(doc_id: str, text: str, lang: str, child_size: int = 128, parent_size: int = 512, child_overlap: int = 20) -> List[Dict[str, Any]]:
    words = text.split()
    if not words:
        return []
    parent_text = ' '.join(words[:parent_size])
    parent_id = f"{doc_id}_parent_0"
    chunks = []
    child_idx = 0
    step = child_size - child_overlap
    for i in range(0, len(words), step):
        child_words = words[i:i + child_size]
        if not child_words:
            break
        child_text = ' '.join(child_words)
        chunks.append({
            'chunk_id': f"{doc_id}_child_{child_idx}",
            'doc_id': doc_id,
            'parent_id': parent_id,
            'parent_text': parent_text,
            'text': child_text,
            'strategy': 'parent_child',
            'language': lang,
            'tokens': len(child_words)
        })
        child_idx += 1
        if i + child_size >= len(words):
            break
    return chunks
