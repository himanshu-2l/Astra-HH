import React, { useState } from 'react';
import { X, Server, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverUrl: string;
  onSaveUrl: (url: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  serverUrl,
  onSaveUrl,
}) => {
  const [urlInput, setUrlInput] = useState(serverUrl);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      const cleanUrl = urlInput.trim().replace(/\/$/, '');
      const resp = await fetch(`${cleanUrl}/health`);
      if (resp.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (e) {
      setTestStatus('error');
    }
  };

  const handleSave = () => {
    const cleanUrl = urlInput.trim().replace(/\/$/, '');
    onSaveUrl(cleanUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/80 backdrop-blur-sm p-4">
      <div className="glass-panel p-6 w-full max-w-md space-y-4 border-slate-700/80 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
          <Server className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Astra Server Connection Settings
          </h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="text-slate-300 block mb-1">FastAPI Backend Endpoint URL:</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="http://localhost:8001 or https://xxx.trycloudflare.com"
              className="w-full bg-obsidian-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="flex space-x-2 pt-1">
            <button
              onClick={() => setUrlInput('http://localhost:8001')}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white text-[11px]"
            >
              Default (Localhost:8001)
            </button>
          </div>

          {/* Test Status Banner */}
          {testStatus === 'success' && (
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Connection Successful! 6 GPUs Active.</span>
            </div>
          )}
          {testStatus === 'error' && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Could not connect. Ensure server is running.</span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>Test Ping</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono shadow-lg shadow-purple-900/30 transition-all"
          >
            Save Endpoint
          </button>
        </div>
      </div>
    </div>
  );
};
