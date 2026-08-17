import asyncio
from typing import AsyncGenerator, Dict, Any
from rag_engine.voice.stt_client import SarvamRealtimeSTT
from rag_engine.pipeline import AstraPipelineHarness

class OverlappedVoicePipeline:
    def __init__(self, harness: AstraPipelineHarness, sarvam_api_key: str = "demo_key"):
        self.harness = harness
        self.stt = SarvamRealtimeSTT(api_key=sarvam_api_key)

    async def process_audio_stream(self, audio_chunk_generator) -> AsyncGenerator[Dict[str, Any], None]:
        prefetch_task = None
        final_query = ""

        async for stt_event in self.stt.stream_transcribe(audio_chunk_generator):
            text = stt_event["text"]
            
            # 1. Yield live transcript event to frontend
            yield {
                "event": "transcript_update",
                "type": stt_event["type"],
                "text": text
            }
            
            # 2. Trigger Overlapped Early Prefetch Retrieval on partial with >= 3 words
            words = text.strip().split()
            if len(words) >= 3 and prefetch_task is None:
                yield {"event": "retrieval_status", "status": "Prefetching retrieval in background..."}
                prefetch_task = asyncio.create_task(self.harness.retriever.search(text, top_k=3))
                
            if stt_event["type"] == "final":
                final_query = text
                break

        # 3. Finalize synthesis with prefetched or finalized query
        yield {"event": "retrieval_status", "status": "Finalizing RAG answer synthesis..."}
        result = await self.harness.process_query(final_query)
        yield {
            "event": "final_result",
            "data": result
        }
