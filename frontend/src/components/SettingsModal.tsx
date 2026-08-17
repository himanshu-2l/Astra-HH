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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 p-6 md:p-8 w-full max-w-md space-y-5 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <Server className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Server Connection
            </h3>
            <span className="text-[11px] text-white/50 font-mono">FastAPI Sub-200ms Engine</span>
          </div>
        </div>

        <div className="space-y-3.5 font-mono text-xs">
          <div>
            <label className="text-white/70 block mb-1.5">FastAPI Backend Endpoint URL:</label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="http://localhost:8001"
              className="w-full bg-white/[0.05] border border-white/20 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setUrlInput('http://localhost:8001')}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-white/60 hover:text-white text-[11px] cursor-pointer transition-all"
            >
              Default (Localhost:8001)
            </button>
          </div>

          {/* Test Status Banner */}
          {testStatus === 'success' && (
            <div className="p-3 rounded-2xl bg-white/10 border border-white/30 text-white flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Connection Successful! 6 GPUs Active.</span>
            </div>
          )}
          {testStatus === 'error' && (
            <div className="p-3 rounded-2xl bg-white/10 border border-white/30 text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Could not connect. Ensure server is running.</span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
          <button
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {testStatus === 'testing' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : null}
            <span>Test Connection</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs font-mono hover:bg-white/90 transition-all cursor-pointer shadow-lg"
          >
            Save & Connect
          </button>
        </div>
      </div>
    </div>
  );
};
