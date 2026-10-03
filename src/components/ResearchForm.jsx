import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Layers, 
  SlidersHorizontal, 
  BookOpen, 
  Bot, 
  ShieldCheck, 
  Globe, 
  FileText, 
  BrainCircuit,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../data/mockData';

export function ResearchForm({ onStartResearch, isExecuting, agents }) {
  const [prompt, setPrompt] = useState('');
  const [depth, setDepth] = useState('In-Depth Analysis');
  const [domain, setDomain] = useState('Artificial Intelligence & Software');
  const [tone, setTone] = useState('Analytical & Strategic');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState(['planner', 'searcher', 'synthesizer', 'factchecker', 'designer']);

  const handleSelectTemplate = (template) => {
    setPrompt(template.prompt);
    setDepth(template.depth);
    setDomain(template.domain);
  };

  const toggleAgent = (id) => {
    if (selectedAgents.includes(id)) {
      if (selectedAgents.length > 2) {
        setSelectedAgents(selectedAgents.filter(a => a !== id));
      }
    } else {
      setSelectedAgents([...selectedAgents, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting) return;

    onStartResearch({
      prompt,
      depth,
      domain,
      tone,
      selectedAgents
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white tracking-wide">Research Goal & Multi-Agent Dispatch</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200 transition-colors bg-indigo-950/40 border border-indigo-800/40 px-3 py-1 rounded-lg"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {showAdvanced ? 'Hide Controls' : 'Configure Controls'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Input Textarea */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Investigate the state of autonomous multi-agent AI frameworks, enterprise ROI metrics, and security guardrails in 2026..."
            rows={3}
            disabled={isExecuting}
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 resize-none transition-all outline-none"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={!prompt.trim() || isExecuting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg ${
                !prompt.trim() || isExecuting
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-indigo-500/30 scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Agents Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Launch Multi-Agent Pipeline
                </>
              )}
            </button>
          </div>
        </div>

        {/* Presets & Quick Templates */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            Quick Preset Prompts:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {SAMPLE_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectTemplate(tmpl)}
                disabled={isExecuting}
                className="text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 transition-all group"
              >
                <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                  {tmpl.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{tmpl.depth}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Controls Dropdowns */}
        {showAdvanced && (
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Research Depth</label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Executive Briefing">Executive Briefing (2 mins)</option>
                <option value="In-Depth Analysis">In-Depth Analysis (Standard)</option>
                <option value="Market Intelligence">Market Intelligence & Competitors</option>
                <option value="Technical Deep Dive">Technical Deep Dive & Architecture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Artificial Intelligence & Software">AI & Software Engineering</option>
                <option value="CleanTech & Energy">CleanTech & Renewable Energy</option>
                <option value="Cybersecurity & Cryptography">Cybersecurity & Quantum</option>
                <option value="Finance & Fintech">Finance & Digital Assets</option>
                <option value="BioTech & Healthcare">BioTech & Health Sciences</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Report Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Analytical & Strategic">Analytical & Strategic</option>
                <option value="Executive C-Suite">Executive C-Suite</option>
                <option value="Academic Literature">Academic Literature</option>
                <option value="Actionable Roadmap">Actionable Roadmap</option>
              </select>
            </div>
          </div>
        )}

        {/* Agent Team Selection Bar */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/50 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Active Agent Squad:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {agents.map((agent) => {
              const isSelected = selectedAgents.includes(agent.id);
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => toggleAgent(agent.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500/60 text-indigo-200 shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`}></span>
                  {agent.name.split('&')[0]}
                </button>
              );
            })}
          </div>
        </div>

      </form>
    </div>
  );
}
