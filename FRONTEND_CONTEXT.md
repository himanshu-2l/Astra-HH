# 🎨 ASTRA AI — Complete Frontend Development Context & Blueprint

> **For New Chat Sessions:** This document provides full technical context, API schemas, design system rules, and component architectures for developing the Astra Voice RAG frontend.

---

## 🏛️ 1. Project Overview & Architecture

* **Project Name:** Astra AI — Sub-200ms Voice-Enabled Multilingual Indic RAG Engine
* **Competition:** Hackathon Goa (HH Goa) 2026 Round 2
* **GitHub Repository:** [https://github.com/himanshu-2l/Astra-HH](https://github.com/himanshu-2l/Astra-HH)
* **Frontend Tech Stack:** React 18, Vite 6, TypeScript, Tailwind CSS, Lucide React Icons
* **Location:** `E:\ASTRA- HH-2\frontend\`
* **Backend:** FastAPI running on port 8001 (or via Cloudflare HTTPS Tunnel) on a 6× RTX 2080 Ti GPU server (512 GB Host RAM).

---

## 🎨 2. Design System & Theme Rules

* **Palette:**
  * Background: Cosmic Obsidian (`#04070d`, `#080c14`, `#0c121e`)
  * Neon Accents: Glowing Violet (`#a855f7`), Electric Cyan (`#06b6d4`, `#22d3ee`), Emerald Green (`#10b981`), Rose Red (`#f43f5e`)
* **Typography:**
  * UI Text: `Inter, sans-serif`
  * Metrics & Hardware Telemetry: `'JetBrains Mono', monospace`
* **Styling Classes:**
  * Glassmorphism panels: `glass-panel` (backdrop blur, subtle border)
  * Glow effects: `glow-purple`, `glow-cyan`, `shadow-glow-purple`, `shadow-glow-cyan`

---

## 🔌 3. Backend API Contract & Endpoints

### 1. `GET /health` (Polled every 3 seconds)
**Response:**
```json
{
  "status": "online",
  "gpus": [
    { "gpu_id": 0, "name": "RTX 2080 Ti", "utilization_pct": 5.0, "memory_used_mb": 512.0, "memory_total_mb": 11264.0, "temperature_c": 36.0 },
    { "gpu_id": 1, "name": "RTX 2080 Ti", "utilization_pct": 42.0, "memory_used_mb": 8400.0, "memory_total_mb": 11264.0, "temperature_c": 58.0 },
    { "gpu_id": 2, "name": "RTX 2080 Ti", "utilization_pct": 65.0, "memory_used_mb": 6200.0, "memory_total_mb": 11264.0, "temperature_c": 62.0 },
    { "gpu_id": 3, "name": "RTX 2080 Ti", "utilization_pct": 5.0, "memory_used_mb": 380.0, "memory_total_mb": 11264.0, "temperature_c": 35.0 },
    { "gpu_id": 4, "name": "RTX 2080 Ti", "utilization_pct": 5.0, "memory_used_mb": 380.0, "memory_total_mb": 11264.0, "temperature_c": 35.0 },
    { "gpu_id": 5, "name": "RTX 2080 Ti", "utilization_pct": 5.0, "memory_used_mb": 380.0, "memory_total_mb": 11264.0, "temperature_c": 35.0 }
  ]
}
```

### 2. `POST /query`
**Request Body:**
```json
{
  "query": "कंप्यूटर ऑपरेटिंग सिस्टम क्या है?",
  "language": "hi"
}
```
**Response Body:**
```json
{
  "query": "कंप्यूटर ऑपरेटिंग सिस्टम क्या है?",
  "language": "hi",
  "answer": "ऑपरेटिंग सिस्टम (OS) सिस्टम सॉफ्टवेयर का एक मुख्य भाग है [1] जो कंप्यूटर हार्डवेयर और सॉफ्टवेयर संसाधनों का प्रबंधन करता है [2]...",
  "citations": [1, 2],
  "sources": [
    {
      "doc_id": "MSMARCO_HI_48102",
      "strategy": "parent_child",
      "language": "hi",
      "rerank_score": 0.9616,
      "text": "ऑपरेटिंग सिस्टम हा सॉफ्टवेअरचा एक मुख्य भाग आहे जो बूटअपनंतर चालतो आणि संगणकाचे सर्व घटक नियंत्रित करतो."
    }
  ],
  "latency": {
    "embed_ms": 8.2,
    "ann_search_ms": 11.1,
    "rrf_fusion_ms": 0.5,
    "rerank_ms": 22.4,
    "total_retrieval_ms": 42.2,
    "generation_ms": 120.0,
    "end_to_end_ms": 163.0
  },
  "guardrails": {
    "passed": true
  }
}
```

---

## 🧩 4. Frontend Component Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                   # Top brand bar + SLA badge + Settings gear
│   │   ├── GpuTelemetryBar.tsx          # 6-GPU real-time load & VRAM progress meters
│   │   ├── VoiceStudio.tsx              # Web Speech API mic + waveform + language switcher
│   │   ├── LatencyWaterfall.tsx         # Real-time sub-50ms animated waterfall
│   │   ├── AnswerCitationInspector.tsx  # Grounded answer with clickable [1] citation spotlights
│   │   ├── GuardrailMonitor.tsx         # 3-Gate safety indicators & refusal banners
│   │   └── SettingsModal.tsx            # Localhost vs Remote Cloudflare tunnel URL switcher
│   ├── types/
│   │   └── index.ts                     # Full TypeScript interfaces
│   ├── App.tsx                          # Master dashboard layout
│   ├── index.css                        # Tailwind global classes & glassmorphism
│   └── main.tsx                         # React entrypoint
```

---

## 💻 5. How to Run the Frontend Locally

```bash
cd "E:\ASTRA- HH-2\frontend"
npm.cmd run dev
```
Runs at: **`http://localhost:5173/`**
