import React, { useState } from 'react';
import { X, FileText, Download, Code, Globe, Check, AlertCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { calculateTopicAuditScore } from '../services/multiAgentEngine';

export function ExportModal({ report, isOpen, onClose }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [successFormat, setSuccessFormat] = useState(null);

  if (!isOpen || !report) return null;

  const triggerSuccess = (format) => {
    setSuccessFormat(format);
    setTimeout(() => setSuccessFormat(null), 2500);
  };

  const handleExportPDF = () => {
    setDownloadingFormat('pdf');

    const auditScore = report.confidenceScore ?? report.audit_score ?? report.auditScore ?? calculateTopicAuditScore(report.title || report.topic);

    // Create a container positioned within viewport geometry (behind UI backdrop) so html2canvas captures full document content
    const printContainer = document.createElement('div');
    printContainer.style.position = 'fixed';
    printContainer.style.left = '0px';
    printContainer.style.top = '0px';
    printContainer.style.width = '790px';
    printContainer.style.zIndex = '-9999';
    printContainer.style.opacity = '0.01';
    printContainer.style.pointerEvents = 'none';
    printContainer.style.padding = '36px';
    printContainer.style.backgroundColor = '#ffffff';
    printContainer.style.color = '#0f172a';
    printContainer.style.fontFamily = 'Helvetica, Arial, sans-serif';

    const metricsHtml = report.keyMetrics && report.keyMetrics.length > 0 
      ? `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; margin-top: 12px;">
          <tr>
            ${report.keyMetrics.map(m => `
              <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; width: 25%; text-align: left; vertical-align: top;">
                <div style="font-size: 11px; color: #64748b; font-weight: 600;">${m.label}</div>
                <div style="font-size: 18px; font-weight: bold; color: #0f172a; margin: 4px 0;">${m.value}</div>
                <div style="font-size: 11px; color: #16a34a; font-weight: bold;">${m.change}</div>
              </td>
            `).join('')}
          </tr>
        </table>
      ` 
      : '';

    const sectionsHtml = report.sections && report.sections.length > 0
      ? report.sections.map(sec => `
          <div style="margin-bottom: 22px; page-break-inside: avoid;">
            <h2 style="font-size: 16px; font-weight: bold; color: #1e1b4b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">${sec.title}</h2>
            <div style="font-size: 12.5px; color: #334155; white-space: pre-line; line-height: 1.65;">${sec.content}</div>
          </div>
        `).join('')
      : '';

    const citationsHtml = report.citations && report.citations.length > 0
      ? `
        <div style="margin-top: 32px; border-top: 2px solid #e2e8f0; padding-top: 16px; page-break-inside: avoid;">
          <h3 style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 10px;">Verified References & Citations</h3>
          ${report.citations.map(c => `
            <div style="margin-bottom: 10px; font-size: 11.5px; color: #475569; background: #f8fafc; padding: 8px 12px; border-left: 3px solid #6366f1; border-radius: 4px;">
              <strong>${c.title}</strong> — ${c.author} (${c.year}) <span style="color: #16a34a; font-weight: bold;">[Reliability: ${c.reliability}%]</span><br/>
              <span style="font-style: italic; color: #64748b;">"${c.snippet}"</span>
            </div>
          `).join('')}
        </div>
      `
      : '';

    printContainer.innerHTML = `
      <div style="font-family: Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <!-- Header Banner -->
        <div style="border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px;">
          <span style="font-size: 10px; font-weight: bold; color: #6366f1; letter-spacing: 1px;">AGENTICIQ AUTONOMOUS RESEARCH REPORT</span>
          <h1 style="font-size: 22px; font-weight: bold; margin: 4px 0 2px 0; color: #0f172a;">${report.title || 'Research Report'}</h1>
          <p style="font-size: 12px; color: #475569; margin: 0;">${report.subtitle || ''}</p>
        </div>

        <!-- Metadata Box -->
        <table style="width: 100%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 20px; font-size: 11.5px; color: #334155;">
          <tr>
            <td><strong>Date:</strong> ${report.date || 'Recent'}</td>
            <td><strong>Execution Time:</strong> ${report.executionTime || 'N/A'}</td>
            <td><strong>Research Depth:</strong> ${report.depth || 'Standard'}</td>
            <td><strong>Fact Audit:</strong> <span style="color: #16a34a; font-weight: bold;">${auditScore}% Verified</span></td>
          </tr>
        </table>

        <!-- Executive Summary -->
        <div style="background-color: #f1f5f9; border-left: 4px solid #6366f1; padding: 14px 16px; border-radius: 4px; margin-bottom: 22px;">
          <h3 style="font-size: 13px; font-weight: bold; color: #4338ca; margin: 0 0 6px 0; text-transform: uppercase;">Executive Summary</h3>
          <p style="font-size: 12.5px; color: #1e293b; margin: 0; line-height: 1.6;">${report.executiveSummary || ''}</p>
        </div>

        <!-- Metrics Grid -->
        ${metricsHtml}

        <!-- Report Body Sections -->
        ${sectionsHtml}

        <!-- Bibliography -->
        ${citationsHtml}
      </div>
    `;

    document.body.appendChild(printContainer);

    const filename = `${(report.title || 'research_report').slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.pdf`;
    const opt = {
      margin:       0.4,
      filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0, windowWidth: 800 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      const pdfLib = typeof html2pdf === 'function' ? html2pdf : html2pdf.default;
      if (pdfLib) {
        pdfLib().set(opt).from(printContainer).save().then(() => {
          if (document.body.contains(printContainer)) {
            document.body.removeChild(printContainer);
          }
          setDownloadingFormat(null);
          triggerSuccess('pdf');
        }).catch((err) => {
          console.error('html2pdf generation error:', err);
          if (document.body.contains(printContainer)) {
            document.body.removeChild(printContainer);
          }
          window.print();
          setDownloadingFormat(null);
          triggerSuccess('pdf');
        });
      } else {
        if (document.body.contains(printContainer)) {
          document.body.removeChild(printContainer);
        }
        window.print();
        setDownloadingFormat(null);
        triggerSuccess('pdf');
      }
    } catch (e) {
      console.error('PDF Export exception:', e);
      if (document.body.contains(printContainer)) {
        document.body.removeChild(printContainer);
      }
      window.print();
      setDownloadingFormat(null);
      triggerSuccess('pdf');
    }
  };

  const handleExportMD = () => {
    try {
      setDownloadingFormat('md');
      const auditScore = report.confidenceScore ?? report.audit_score ?? report.auditScore ?? calculateTopicAuditScore(report.title || report.topic);
      let md = `# ${report.title}\n`;
      md += `*${report.subtitle}*\n\n`;
      md += `**Date**: ${report.date} | **Confidence Score**: ${auditScore}% | **Depth**: ${report.depth}\n\n`;
      md += `## Executive Summary\n${report.executiveSummary}\n\n`;

      report.sections?.forEach((sec) => {
        md += `## ${sec.title}\n${sec.content}\n\n`;
      });

      if (report.citations?.length) {
        md += `## Verified References\n`;
        report.citations.forEach((cite) => {
          md += `- [${cite.title}](${cite.url}) - ${cite.author} (${cite.year})\n`;
        });
      }

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.title.slice(0, 25).replace(/[^a-z0-9]/gi, '_')}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingFormat(null);
      triggerSuccess('md');
    } catch (err) {
      console.error('Markdown export failed:', err);
      setDownloadingFormat(null);
    }
  };

  const handleExportJSON = () => {
    try {
      setDownloadingFormat('json');
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.id}_data.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingFormat(null);
      triggerSuccess('json');
    } catch (err) {
      console.error('JSON export failed:', err);
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel rounded-2xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Export Research Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-3">
          
          {/* PDF Download Button */}
          <button
            onClick={handleExportPDF}
            disabled={downloadingFormat === 'pdf'}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold font-mono text-xs">
                PDF
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 flex items-center gap-2">
                  Download PDF Document
                  {successFormat === 'pdf' && <span className="text-xs text-emerald-400 font-normal flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Downloaded!</span>}
                </h4>
                <p className="text-xs text-slate-400">Formatted publication document with full report body & metrics</p>
              </div>
            </div>
            {downloadingFormat === 'pdf' ? (
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
            )}
          </button>

          {/* Markdown Download Button */}
          <button
            onClick={handleExportMD}
            disabled={downloadingFormat === 'md'}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono text-xs">
                MD
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 flex items-center gap-2">
                  Download Raw Markdown (.md)
                  {successFormat === 'md' && <span className="text-xs text-emerald-400 font-normal flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Downloaded!</span>}
                </h4>
                <p className="text-xs text-slate-400">Ideal for Notion, GitHub, and markdown editors</p>
              </div>
            </div>
            {downloadingFormat === 'md' ? (
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
            )}
          </button>

          {/* JSON Export Button */}
          <button
            onClick={handleExportJSON}
            disabled={downloadingFormat === 'json'}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-xs">
                JSON
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 flex items-center gap-2">
                  Export Raw JSON Data
                  {successFormat === 'json' && <span className="text-xs text-emerald-400 font-normal flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Downloaded!</span>}
                </h4>
                <p className="text-xs text-slate-400">Complete structured schema with metrics & citation arrays</p>
              </div>
            </div>
            {downloadingFormat === 'json' ? (
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
            )}
          </button>

        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
