// Pre-defined agent team definitions
export const INITIAL_AGENTS = [
  {
    id: 'planner',
    name: 'Planner & Orchestrator',
    role: 'Decomposes complex prompts into research tasks, hypotheses, & key questions.',
    icon: 'BrainCircuit',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500',
    glowColor: 'shadow-purple-500/50',
    status: 'idle', // idle, active, completed, error
    progress: 0,
    currentTask: 'Awaiting research goal...',
    temperature: 0.3,
    systemPrompt: 'You are an elite research coordinator. Analyze the prompt, identify core knowledge gaps, structure research axes, and assign subtasks.'
  },
  {
    id: 'searcher',
    name: 'Web Mining & Data Agent',
    role: 'Queries public databases, web indices, academic portals, and real-time feeds.',
    icon: 'Globe',
    color: 'from-blue-500 to-cyan-600',
    borderColor: 'border-cyan-500',
    glowColor: 'shadow-cyan-500/50',
    status: 'idle',
    progress: 0,
    currentTask: 'Idle',
    temperature: 0.2,
    systemPrompt: 'You extract verified facts, metrics, statistical benchmarks, and recent market developments across web and research literature.'
  },
  {
    id: 'synthesizer',
    name: 'Deep Synthesis Agent',
    role: 'Combines multi-source raw findings into coherent analytical arguments & visuals.',
    icon: 'Sparkles',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500',
    glowColor: 'shadow-emerald-500/50',
    status: 'idle',
    progress: 0,
    currentTask: 'Idle',
    temperature: 0.4,
    systemPrompt: 'You integrate disparate data streams into high-level thematic insights, comparative matrices, and strategic trends.'
  },
  {
    id: 'factchecker',
    name: 'Fact Checker & Auditor',
    role: 'Cross-verifies claims, evaluates source bias, checks statistical consistency.',
    icon: 'ShieldCheck',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500',
    glowColor: 'shadow-amber-500/50',
    status: 'idle',
    progress: 0,
    currentTask: 'Idle',
    temperature: 0.1,
    systemPrompt: 'You ruthlessly verify every numerical claim, cross-reference sources, score reliability from 0-100%, and flag hallucinations.'
  },
  {
    id: 'designer',
    name: 'Report Architect & Visualizer',
    role: 'Formats final Markdown report, builds interactive charts, executive summary, & citations.',
    icon: 'FileText',
    color: 'from-rose-500 to-pink-600',
    borderColor: 'border-rose-500',
    glowColor: 'shadow-rose-500/50',
    status: 'idle',
    progress: 0,
    currentTask: 'Idle',
    temperature: 0.3,
    systemPrompt: 'You construct publication-grade executive reports complete with executive summaries, visual chart payloads, and clickable references.'
  }
];

// Sample Research Templates for Quick Start
export const SAMPLE_TEMPLATES = [
  {
    title: 'Autonomous AI Agents in Enterprise 2026',
    depth: 'In-Depth Analysis',
    domain: 'Artificial Intelligence & Software',
    prompt: 'Investigate the state of multi-agent AI frameworks, enterprise ROI metrics, autonomous workflows, latency challenges, and security guardrails in 2026.'
  },
  {
    title: 'Next-Gen Solid-State Battery Commercialization',
    depth: 'Market Intelligence',
    domain: 'CleanTech & Automotive',
    prompt: 'Analyze energy density breakthroughs in solid-state batteries, key market players, manufacturing scaling bottlenecks, and cost projections through 2030.'
  },
  {
    title: 'Quantum Computing Impact on RSA Encryption',
    depth: 'Technical Deep Dive',
    domain: 'Cybersecurity & Quantum Physics',
    prompt: 'Evaluate Shor algorithm implementation readiness, post-quantum cryptography (PQC) NIST standards adoption, and enterprise transition roadmaps.'
  },
  {
    title: 'Global Renewable Energy Grid Storage & Microgrids',
    depth: 'Executive Briefing',
    domain: 'Energy & Infrastructure',
    prompt: 'Examine long-duration energy storage (LDES) adoption, grid stability technologies, regulatory incentives, and investment trends across EU and Americas.'
  }
];
