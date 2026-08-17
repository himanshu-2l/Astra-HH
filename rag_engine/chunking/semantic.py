import re
from typing import List, Dict, Any

# Indic Purna Viram (\u0964) + standard terminators
SENTENCE_SPLIT_REGEX = re.compile(r'(?<=[\u0964?!.\n])\s+')

def chunk_semantic(doc_id: str, text: str, lang: str, max_tokens: int = 256) -> List[Dict[str, Any]]:
    sentences = [s.strip() for s in SENTENCE_SPLIT_REGEX.split(text) if s.strip()]
    if not sentences:
        return []
    chunks = []
    current_sentences = []
    current_tokens = 0
    chunk_idx = 0
    for sent in sentences:
        sent_tokens = len(sent.split())
        if current_tokens + sent_tokens > max_tokens and current_sentences:
            chunks.append({
                'chunk_id': f"{doc_id}_semantic_{chunk_idx}",
                'doc_id': doc_id,
                'text': ' '.join(current_sentences),
                'strategy': 'semantic',
                'language': lang,
                'tokens': current_tokens
            })
            chunk_idx += 1
            current_sentences = [sent]
            current_tokens = sent_tokens
        else:
            current_sentences.append(sent)
            current_tokens += sent_tokens
    if current_sentences:
        chunks.append({
            'chunk_id': f"{doc_id}_semantic_{chunk_idx}",
            'doc_id': doc_id,
            'text': ' '.join(current_sentences),
            'strategy': 'semantic',
            'language': lang,
            'tokens': current_tokens
        })
    return chunks
