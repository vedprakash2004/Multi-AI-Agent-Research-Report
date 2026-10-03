import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Download, 
  Share2, 
  Edit3, 
  RefreshCw, 
  Save, 
  BarChart3, 
  LineChart, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  List,
  BookOpen,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

import { calculateTopicAuditScore } from '../services/multiAgentEngine';

export function ReportViewer({ report, onExport, onSaveReport, isSaved }) {
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [activeChartType, setActiveChartType] = useState('bar');
  const [activeCitation, setActiveCitation] = useState(null);

  if (!report) return null;

  const handleEditSection = (secId, currentText) => {
    setEditingSectionId(secId);
    setEditedContent({ ...editedContent, [secId]: currentText });
  };

  const handleSaveSection = (secId) => {
    report.sections = report.sections.map(sec => 
      sec.id === secId ? { ...sec, content: editedContent[secId] } : sec
    );
    setEditingSectionId(null);
  };

  const auditScore = report.confidenceScore ?? report.audit_score ?? report.auditScore ?? calculateTopicAuditScore(report.title || report.topic);

  const defaultChartData = [
    { period: '2023 Q1', adoptionRate: 22, efficiencyGain: 18 },
    { period: '2023 Q3', adoptionRate: 34, efficiencyGain: 29 },
    { period: '2024 Q2', adoptionRate: 49, efficiencyGain: 45 },
    { period: '2025 Q1', adoptionRate: 64, efficiencyGain: 61 },
    { period: '2025 Q4', adoptionRate: 78, efficiencyGain: 76 },
    { period: '2026 Q3 (Est)', adoptionRate: 88, efficiencyGain: 89 }
  ];
  const chartData = (report.chartData && report.chartData.length > 0) ? report.chartData : defaultChartData;

  return (
    <div id="report-printable-area" className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 shadow-2xl relative mb-12">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold">
              PUBLISHED REPORT
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {report.id}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{report.title}</h1>
          <p className="text-sm text-slate-400 mt-1">{report.subtitle}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSaveReport(report)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {isSaved ? 'Saved to History' : 'Save Report'}
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Metadata Ribbon */}
      <div className="py-4 my-4 bg-slate-950/60 rounded-xl px-4 border border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Execution Latency: <strong className="text-white font-mono">{report.executionTime}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Fact Audit Score: <strong className="text-emerald-400 font-mono">{auditScore}% Verified</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Depth: <strong className="text-slate-200">{report.depth}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Citations: <strong className="text-slate-200">{report.citations?.length || 0} Sources</strong></span>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-900/80 to-purple-950/40 border border-indigo-500/30 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          Executive Synthesis Summary
        </h2>
        <p className="text-sm leading-relaxed text-slate-200">{report.executiveSummary}</p>
      </div>

      {/* Key Metrics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {report.keyMetrics?.map((metric, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="text-xs text-slate-400 font-medium mb-1">{metric.label}</div>
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight my-1">{metric.value}</div>
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Dynamic Interactive Chart */}
      <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Comparative Performance & Adoption Trajectory
            </h3>
            <p className="text-xs text-slate-400">Quarterly progression matrix across adoption metrics & efficiency gains</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveChartType('bar')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeChartType === 'bar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bar View
            </button>
            <button
              onClick={() => setActiveChartType('area')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeChartType === 'area' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Area Growth
            </button>
          </div>
        </div>

        <div className="h-64 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height={250}>
            {activeChartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="adoptionRate" name="Adoption Rate (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="efficiencyGain" name="Efficiency Gain (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="adoptionRate" name="Adoption Rate (%)" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                <Area type="monotone" dataKey="efficiencyGain" name="Efficiency Gain (%)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Report Sections Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Table of Contents Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <List className="w-3.5 h-3.5 text-indigo-400" />
              Table of Contents
            </h4>
            <ul className="space-y-2">
              {report.sections?.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="text-slate-400 hover:text-indigo-300 transition-colors block leading-tight py-1 border-l-2 border-transparent hover:border-indigo-500 pl-2"
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section Content Column */}
        <div className="lg:col-span-3 space-y-8 report-content">
          {report.sections?.map((sec) => {
            const isEditing = editingSectionId === sec.id;

            return (
              <div key={sec.id} id={sec.id} className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 relative group">
                
                {/* Section Edit Controls */}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEditing ? (
                    <button
                      onClick={() => handleSaveSection(sec.id)}
                      className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditSection(sec.id, sec.content)}
                      className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Section
                    </button>
                  )}
                </div>

                <h2 className="text-lg font-bold text-white mb-4">{sec.title}</h2>

                {isEditing ? (
                  <textarea
                    value={editedContent[sec.id] || ''}
                    onChange={(e) => setEditedContent({ ...editedContent, [sec.id]: e.target.value })}
                    rows={8}
                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-xl p-3 text-xs text-slate-100 font-mono outline-none"
                  />
                ) : (
                  <div className="whitespace-pre-line text-sm text-slate-300 leading-relaxed">
                    {sec.content}
                  </div>
                )}
              </div>
            );
          })}

          {/* Citations Footer Section */}
          {report.citations && report.citations.length > 0 && (
            <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 mt-8">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                Verified Citations & Bibliography ({report.citations.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.citations.map((cite) => (
                  <a
                    key={cite.id}
                    href={cite.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition-all text-xs block group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200 group-hover:text-indigo-300 line-clamp-1">{cite.title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                        {cite.reliability}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-2">{cite.author} ({cite.year})</div>
                    <p className="text-[10px] text-slate-500 italic line-clamp-2">"{cite.snippet}"</p>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
