import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Settings, 
  History, 
  FileText, 
  Cpu, 
  CheckCircle2,
  Share2
} from 'lucide-react';

export function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenSettings, 
  savedCount,
  isExecuting 
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-indigo-900/30 px-4 lg:px-8 py-3.5 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            {isExecuting && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                AgenticIQ
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-medium">
                  Multi-Agent AI v2.5
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">Autonomous Research & Executive Report Assistant</p>
          </div>
        </div>

        {/* Center Tabs Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'workspace'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Research Workspace
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Saved Reports
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-400/20 text-indigo-300 font-mono">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Status & Configuration */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] text-cyan-300">Engine: Active (5 Agents)</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="Configure Agents & API Keys"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Agent Studio</span>
          </button>
        </div>

      </div>
    </header>
  );
}
