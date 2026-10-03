# 🤖 AgenticIQ — Multi-Agent AI Research Swarm (Python Streamlit)

A Python/Streamlit app that orchestrates 5 sequential agent steps to research a
topic and produce an executive report, with **real Claude API calls and real
web search** — not hardcoded or randomly-generated data.

> **Note on this revision:** the original version of this project looked
> convincing but did not actually do any AI or research — every "citation,"
> statistic, and fact-check verdict was hardcoded (or `random.uniform()`),
> identical for any topic you typed in. This revision replaces that with real
> Claude reasoning and a real internet search, and is explicit in the UI and
> in the generated report about which parts are live vs. unavailable, instead
> of quietly inventing sources.

---

## 🌟 How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Planner Agent  │ ──► │ Web Miner Agent │ ──► │ Synthesizer Agent│
│   (Claude)      │     │ (real search)   │     │    (Claude)      │
└─────────────────┘     └─────────────────┘     └──────────────────┘
                                                          │
┌─────────────────┐                             ┌─────────▼────────┐
│ Report Architect│ ◄────────────────────────── │Fact Checker Agent│
│   (template)    │                             │    (Claude)      │
└─────────────────┘                             └──────────────────┘
```

1. **Planner Agent** — asks Claude to break the topic into 4 report pillars and 4 concrete sub-questions.
2. **Web Miner Agent** — runs a real DuckDuckGo search for each sub-question and keeps the actual titles/URLs/snippets returned.
3. **Deep Data Synthesizer** — asks Claude to pull key takeaways from the *retrieved* snippets, and produce a clearly-labeled illustrative trajectory chart (not a verified dataset).
4. **Fact Checker Agent** — asks Claude to grade each takeaway against the retrieved evidence (VERIFIED / PARTIALLY VERIFIED / UNVERIFIED).
5. **Report Architect** — assembles everything, including real source links, into a Markdown report exportable as PDF / Markdown / JSON.

### Demo Mode
If no Anthropic API key is set, or the web search returns nothing (no
internet, or the `ddgs` package isn't installed), the app runs in **Demo
Mode**: it still produces a report shell (structure, section headers) but
clearly labels that no facts were verified and shows no chart or citations,
rather than fabricating them.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
python -m pip install -r requirements.txt
```

### 2. Get an Anthropic API key
Create one at https://console.anthropic.com and either:
- paste it into the "Anthropic API Key" field in the app's sidebar, or
- set it as an environment variable before launching:
  ```bash
  export ANTHROPIC_API_KEY=sk-ant-...
  ```

### 3. Launch the app
```bash
python -m streamlit run app.py
```
It opens at `http://localhost:8501`.

---

## 🎨 Key Features

- **Real multi-agent pipeline**: Claude does the planning, synthesis, and fact-checking; DuckDuckGo does the actual web research.
- **Honest fallback**: no API key or no internet → the app says so, instead of presenting invented statistics as verified research.
- **Preset Launchpad**: 1-click blueprints for Quantum Computing, AI in Healthcare, Solid-State Batteries, and Cybersecurity.
- **Interactive Plotly chart** (only rendered when there's real evidence to base it on).
- **Multi-Format Exports**: PDF (`.pdf`), Markdown (`.md`), JSON (`.json`).
- **Persistent Local History**: saved reports stored in `research_history.json`.

## ⚠️ Known limitations

- Web search quality depends on DuckDuckGo's free API, which is rate-limited and occasionally returns nothing for niche queries — that's when Demo Mode kicks in for that run.
- The chart trajectory is an AI-generated illustrative estimate grounded in the retrieved snippets, not audited market data — it's labeled as such in the UI and report.
- This is a single-pass pipeline (each agent runs once, in order), not an autonomous agent loop that re-plans or re-queries based on intermediate results.
