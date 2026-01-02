
import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [manualKey, setManualKey] = useState('');
  const [isAIStudioEnvironment, setIsAIStudioEnvironment] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.aistudio) {
        setIsAIStudioEnvironment(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleManualSubmit = () => {
    if (manualKey.trim()) {
        onConfirm(manualKey.trim());
    }
  };

  const handleAutoSelect = async () => {
    try {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            onConfirm(''); 
        }
    } catch (e) {
        console.error("Failed to select key automatically", e);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-stone-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 19l-1 1-1-1-1 1-1-1-1 1-1-1-5.657-5.657a6 6 0 117.757-7.757 2 2 0 002-2 2 2 0 00-2-2 2 2 0 00-2 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Personal API Key</h2>
              <p className="text-stone-400 text-xs">Unlock AI features in your browser.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wider">Step 1: Get your free key</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              To keep this app free for everyone, each user provides their own key. Generating images with <strong>Gemini 2.5 Flash</strong> is usually free of charge for hobbyist use.
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors border border-blue-200 w-full justify-center"
            >
              Get Free Key from Google AI Studio
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wider">Step 2: Paste it here</h3>
            <input 
              type="password" 
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value)}
              placeholder="Paste your API key here (AIza...)"
              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-mono transition-all"
            />
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex gap-3">
            <div className="text-green-600 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-800">Privacy & Security</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Your key is stored only in your browser's temporary session. It is never sent to our servers or saved permanently. You are in total control.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 text-stone-500 font-bold text-sm hover:text-stone-800 transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          
          {isAIStudioEnvironment && (
              <button
                onClick={handleAutoSelect}
                className="px-6 py-3 bg-stone-200 text-stone-700 rounded-xl font-bold text-sm hover:bg-stone-300 transition-colors order-3 sm:order-2"
              >
                Auto-Select Key
              </button>
          )}

          <button
            onClick={handleManualSubmit}
            disabled={!manualKey.trim()}
            className="flex-grow px-6 py-3 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50 disabled:grayscale order-1 sm:order-3"
          >
            Save Key & Start Designing
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-scale {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ApiKeyModal;
