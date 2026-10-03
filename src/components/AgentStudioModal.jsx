import React, { useState } from 'react';
import { X, Settings, Sliders, Key, Save, Bot, Cpu, Sparkles, Check } from 'lucide-react';

export function AgentStudioModal({ isOpen, onClose, agents, onSaveAgents }) {
  const [localAgents, setLocalAgents] = useState(agents);
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || 'planner');
  const [apiKey, setApiKey] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const currentAgent = localAgents.find(a => a.id === selectedAgentId) || localAgents[0];

  const handleUpdateCurrent = (field, value) => {
    setLocalAgents(localAgents.map(a => 
      a.id === selectedAgentId ? { ...a, [field]: value } : a
    ));
  };

  const handleSave = () => {
    onSaveAgents(localAgents);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel rounded-2xl max-w-3xl w-full p-6 border border-slate-700 shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">Agent Studio & Model Configurator</h3>
              <p className="text-xs text-slate-400">Configure multi-agent system prompts, temperature, & LLM parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Split View */}
        <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto flex-1">
          
          {/* Left Agent Selector List */}
          <div className="space-y-2 border-r border-slate-800/80 pr-4">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Agent Squad</label>
            {localAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`w-full flex items-center gap-2.5 p-3 rounded-xl text-left border transition-all ${
                  selectedAgentId === agent.id
                    ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${agent.color}`}></div>
                <div>
                  <div className="text-xs font-bold">{agent.name}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{agent.role}</div>
                </div>
              </button>
            ))}

            {/* Custom API Key Input box */}
            <div className="pt-4 border-t border-slate-800 mt-4">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Custom API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Leave empty to use built-in autonomous simulation engine.</p>
            </div>
          </div>

          {/* Right Editor Form */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Agent Name & Role</label>
              <input
                type="text"
                value={currentAgent.name}
                onChange={(e) => handleUpdateCurrent('name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500 font-semibold mb-2"
              />
              <input
                type="text"
                value={currentAgent.role}
                onChange={(e) => handleUpdateCurrent('role', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">System Instructions & Behavior Prompt</label>
              <textarea
                value={currentAgent.systemPrompt}
                onChange={(e) => handleUpdateCurrent('systemPrompt', e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Reasoning Temperature (Creativity)</span>
                <span className="font-mono text-indigo-400">{currentAgent.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={currentAgent.temperature}
                onChange={(e) => handleUpdateCurrent('temperature', parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            {savedNotice && <><Check className="w-4 h-4" /> Agent Studio Configurations Saved!</>}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
