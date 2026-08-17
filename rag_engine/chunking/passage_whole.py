from typing import List, Dict, Any

def chunk_passage_whole(doc_id: str, text: str, lang: str) -> List[Dict[str, Any]]:
    words = text.split()
    if not words:
        return []
    return [{
        'chunk_id': f"{doc_id}_whole_0",
        'doc_id': doc_id,
        'text': text,
        'strategy': 'passage_whole',
        'language': lang,
        'tokens': len(words)
    }]
