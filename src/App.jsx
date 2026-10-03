import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResearchForm } from './components/ResearchForm';
import { AgentGraph } from './components/AgentGraph';
import { ExecutionConsole } from './components/ExecutionConsole';
import { ReportViewer } from './components/ReportViewer';
import { ExportModal } from './components/ExportModal';
import { AgentStudioModal } from './components/AgentStudioModal';
import { ResearchHistory } from './components/ResearchHistory';
import { INITIAL_AGENTS } from './data/mockData';
import { MultiAgentEngine } from './services/multiAgentEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState('idle');
  const [report, setReport] = useState(null);
  const [savedReports, setSavedReports] = useState(() => {
    try {
      const stored = localStorage.getItem('agenticiq_saved_reports');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Modal States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('agenticiq_saved_reports', JSON.stringify(savedReports));
    } catch (e) {
      console.error('Failed saving reports to localStorage:', e);
    }
  }, [savedReports]);

  // Execute multi-agent research workflow
  const handleStartResearch = async (researchConfig) => {
    setIsExecuting(true);
    setReport(null);
    setLogs([]);
    setCurrentStep('planning');

    // Reset agent status
    setAgents(prev => prev.map(a => ({
      ...a,
      status: 'idle',
      progress: 0,
      currentTask: 'Waiting to execute...'
    })));

    const engine = new MultiAgentEngine();

    const finalReport = await engine.runResearch({
      ...researchConfig,
      agents,
      onAgentUpdate: (agentId, updates) => {
        setAgents(prev => prev.map(a => a.id === agentId ? { ...a, ...updates } : a));
      },
      onLogStream: (logEntry) => {
        setLogs(prev => [...prev, logEntry]);
      },
      onStepChange: (step) => {
        setCurrentStep(step);
      }
    });

    if (finalReport) {
      setReport(finalReport);
      // Automatically save report to state
      setSavedReports(prev => [finalReport, ...prev.filter(r => r.id !== finalReport.id)]);
    }

    setIsExecuting(false);
  };

  const handleSaveReport = (reportToSave) => {
    setSavedReports(prev => {
      const exists = prev.some(r => r.id === reportToSave.id);
      if (exists) return prev;
      return [reportToSave, ...prev];
    });
  };

  const handleDeleteReport = (reportId) => {
    setSavedReports(prev => prev.filter(r => r.id !== reportId));
  };

  const handleLoadSavedReport = (reportToLoad) => {
    setReport(reportToLoad);
    setActiveTab('workspace');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const isCurrentReportSaved = report && savedReports.some(r => r.id === report.id);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        savedCount={savedReports.length}
        isExecuting={isExecuting}
      />

      {/* Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        
        {activeTab === 'workspace' ? (
          <div>
            {/* Form Input Section */}
            <ResearchForm
              onStartResearch={handleStartResearch}
              isExecuting={isExecuting}
              agents={agents}
            />

            {/* Live Agent Graph Visualization */}
            <AgentGraph
              agents={agents}
              currentStep={currentStep}
              isExecuting={isExecuting}
            />

            {/* Terminal Console Logs */}
            <ExecutionConsole
              logs={logs}
              onClearLogs={() => setLogs([])}
              isExecuting={isExecuting}
            />

            {/* Generated Executive Report Viewer */}
            {report && (
              <ReportViewer
                report={report}
                onExport={() => setIsExportOpen(true)}
                onSaveReport={handleSaveReport}
                isSaved={isCurrentReportSaved}
              />
            )}
          </div>
        ) : (
          /* Saved Reports History View */
          <ResearchHistory
            savedReports={savedReports}
            onLoadReport={handleLoadSavedReport}
            onDeleteReport={handleDeleteReport}
          />
        )}

      </main>

      {/* Modals */}
      <ExportModal
        report={report}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <AgentStudioModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        agents={agents}
        onSaveAgents={(updatedAgents) => setAgents(updatedAgents)}
      />

    </div>
  );
}
