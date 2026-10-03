"""
Preset research templates, squad definitions, and depth configurations for AgenticIQ.
"""

PRESET_TOPICS = {
    "🚀 Quantum Computing Commercialization": {
        "topic": "Commercialization Roadmap for Quantum Computing in Financial Modeling & Cryptography (2026-2032)",
        "domain": "Technology & Quantum Physics",
        "depth": "In-Depth Analysis",
        "tone": "Analytical & Executive",
        "target_audience": "CTOs, Venture Capitalists, Tech Strategy Leads"
    },
    "🌱 Autonomous AI Agents in Healthcare": {
        "topic": "Impact of Autonomous AI Agent Swarms on Clinical Diagnostics & Medical Imaging Compliance",
        "domain": "Healthcare & Artificial Intelligence",
        "depth": "Technical Deep Dive",
        "tone": "Academic & Precise",
        "target_audience": "Medical Researchers, Chief Medical Officers, AI Safety Auditors"
    },
    "⚡ Solid-State Battery EV Revolution": {
        "topic": "Solid-State Battery Energy Density Benchmarks & Supply Chain Vulnerabilities for Electric Vehicles",
        "domain": "Clean Energy & Mobility",
        "depth": "Market Intelligence",
        "tone": "Strategic & Data-Driven",
        "target_audience": "Automotive OEMs, Clean Energy Investors, Supply Chain Directors"
    },
    "🔒 Post-Quantum Cyber Defense": {
        "topic": "Zero Trust Security Architectures & Post-Quantum Cryptography Migration for Enterprise Networks",
        "domain": "Cybersecurity & Enterprise IT",
        "depth": "Executive Briefing",
        "tone": "Actionable & Authoritative",
        "target_audience": "CISOs, Security Engineers, IT Risk Officers"
    }
}

RESEARCH_DEPTHS = {
    "Executive Briefing": {
        "description": "Concise summary tailored for C-suite decision-makers. Focuses on key ROI, risk vectors, and 3-5 action items.",
        "est_time": "15-30 secs",
        "agent_passes": 2
    },
    "In-Depth Analysis": {
        "description": "Comprehensive study with quantitative charts, multi-faceted data breakdown, and market dynamics.",
        "est_time": "30-45 secs",
        "agent_passes": 4
    },
    "Market Intelligence": {
        "description": "Focuses on market size (TAM/SAM), competitive landscapes, market share, and revenue growth projections.",
        "est_time": "35-50 secs",
        "agent_passes": 4
    },
    "Technical Deep Dive": {
        "description": "Rigorously technical architecture, performance benchmarks, algorithm comparisons, and security audits.",
        "est_time": "45-60 secs",
        "agent_passes": 5
    }
}

AGENT_SQUAD = [
    {
        "id": "planner",
        "name": "🎯 Planner & Orchestrator",
        "role": "Deconstructs topics into sub-questions, hypotheses, and scope boundaries.",
        "avatar": "🎯",
        "color": "#6366F1"
    },
    {
        "id": "miner",
        "name": "🔍 Web Miner & Fact Retriever",
        "role": "Queries indices, retrieves authoritative evidence, metrics, and citations.",
        "avatar": "🔍",
        "color": "#06B6D4"
    },
    {
        "id": "synthesizer",
        "name": "🧠 Deep Data Synthesizer",
        "role": "Integrates raw findings into analytical themes and quantitative data matrices.",
        "avatar": "🧠",
        "color": "#8B5CF6"
    },
    {
        "id": "checker",
        "name": "⚖️ Fact Checker & Auditor",
        "role": "Audits numerical assertions against source evidence and rates reliability.",
        "avatar": "⚖️",
        "color": "#10B981"
    },
    {
        "id": "architect",
        "name": "📝 Report Architect & Visualizer",
        "role": "Formats publication-grade Markdown layout, stat cards, and chart graphics.",
        "avatar": "📝",
        "color": "#F59E0B"
    }
]
