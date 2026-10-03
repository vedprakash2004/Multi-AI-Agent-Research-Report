import React, { useState } from 'react';
import { History, Search, Trash2, ExternalLink, Calendar, ShieldCheck, Download, BookOpen } from 'lucide-react';
import { calculateTopicAuditScore } from '../services/multiAgentEngine';

export function ResearchHistory({ savedReports, onLoadReport, onDeleteReport }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = savedReports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.executiveSummary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Saved Research Library ({savedReports.length})
          </h2>
          <p className="text-xs text-slate-400">Access and re-export previously generated multi-agent reports</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          No saved reports found. Launch research tasks in the workspace and click "Save Report" to store them here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                    {report.domain}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {report.date}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {report.executiveSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {report.confidenceScore ?? report.audit_score ?? report.auditScore ?? calculateTopicAuditScore(report.title || report.topic)}% Verified
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteReport(report.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onLoadReport(report)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shadow-md shadow-indigo-500/20"
                  >
                    Open <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
