export interface GpuTelemetry {
  gpu_id: number;
  name: string;
  utilization_pct: number;
  memory_used_mb: number;
  memory_total_mb: number;
  temperature_c: number;
  role?: string;
  model?: string;
}

export interface LatencyBreakdown {
  embed_ms: number;
  ann_search_ms: number;
  rrf_fusion_ms: number;
  rerank_ms: number;
  total_retrieval_ms: number;
  generation_ms: number;
  end_to_end_ms: number;
}

export interface SourceChunk {
  doc_id?: string;
  passage_id?: string;
  strategy: string;
  language: string;
  score?: number;
  rerank_score?: number;
  text: string;
  metadata?: Record<string, any>;
}

export interface GuardrailStatus {
  passed: boolean;
  reason?: string;
  gate?: string;
  injection_detected?: boolean;
  out_of_domain?: boolean;
  grounding_failed?: boolean;
}

export interface QueryResponse {
  query: string;
  language: string;
  answer: string;
  citations: number[];
  sources: SourceChunk[];
  latency: LatencyBreakdown;
  guardrails: GuardrailStatus;
}

export interface HealthResponse {
  status: string;
  gpus: GpuTelemetry[];
}

export type SupportedLanguage = 'hi' | 'mr' | 'bn' | 'te' | 'ta' | 'en';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  native: string;
  speechLocale: string;
}
