import React from 'react';
import { 
  BrainCircuit, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Activity
} from 'lucide-react';

const ICON_MAP = {
  BrainCircuit: BrainCircuit,
  Globe: Globe,
  Sparkles: Sparkles,
  ShieldCheck: ShieldCheck,
  FileText: FileText
};

export function AgentGraph({ agents, currentStep, isExecuting }) {
  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 border border-slate-800 shadow-xl relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h2 className="text-base font-bold text-white">Live Multi-Agent Workflow Canvas</h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Active
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Completed
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 ml-2">
            <span className="w-2 h-2 rounded-full bg-slate-600"></span> Idle
          </span>
        </div>
      </div>

      {/* Agents Flow Grid / Network Line */}
      <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4">
        
        {agents.map((agent, index) => {
          const IconComponent = ICON_MAP[agent.icon] || BrainCircuit;
          const isActive = agent.status === 'active';
          const isCompleted = agent.status === 'completed';

          return (
            <div
              key={agent.id}
              className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'bg-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.03] z-10'
                  : isCompleted
                  ? 'bg-slate-900/60 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
              }`}
            >
              {/* Connector Arrow for desktop */}
              {index < agents.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                    isCompleted 
                      ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              <div>
                {/* Agent Icon Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${agent.color} shadow-md relative`}>
                    <IconComponent className="w-5 h-5 text-white" />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                {/* Agent Name & Role */}
                <h3 className="text-sm font-bold text-white mb-1">{agent.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">{agent.role}</p>
              </div>

              {/* Progress Bar & Task Description */}
              <div className="pt-3 border-t border-slate-800/60">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span className="truncate pr-2">{agent.currentTask}</span>
                  <span className="font-mono font-bold text-indigo-300">{agent.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted
                        ? 'bg-emerald-400'
                        : isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 animate-pulse'
                        : 'bg-slate-800'
                    }`}
                    style={{ width: `${agent.progress}%` }}
                  ></div>
                </div>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
