import React, { useRef, useEffect } from 'react';
import { 
  Terminal, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Brain, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export function ExecutionConsole({ logs, onClearLogs, isExecuting }) {
  const logEndRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.agentId.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogBadge = (type) => {
    switch (type) {
      case 'query':
        return <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">QUERY</span>;
      case 'thought':
        return <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono">THOUGHT</span>;
      case 'verified':
        return <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">AUDIT</span>;
      case 'success':
        return <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">SUCCESS</span>;
      case 'warning':
        return <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono">WARN</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">INFO</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 shadow-xl overflow-hidden mb-8">
      {/* Console Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white font-mono">Agent Communication & Audit Log</h3>
          {isExecuting && (
            <span className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono ml-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> Streaming...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-40"
            title="Copy logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0 || isExecuting}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 transition-colors disabled:opacity-40"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-slate-950/90 p-4 h-56 overflow-y-auto font-mono text-xs text-slate-300 space-y-2">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs">
            No agent activity yet. Launch a research task above to stream agent thoughts & queries.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/50 p-1 rounded transition-colors">
              <span className="text-slate-500 text-[10px] min-w-[55px] pt-0.5">{log.timestamp}</span>
              <span className="font-semibold text-indigo-400 min-w-[90px] text-[11px]">{`[${log.agentId}]`}</span>
              <div className="mr-1">{getLogBadge(log.type)}</div>
              <span className="flex-1 text-slate-200 break-words">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
