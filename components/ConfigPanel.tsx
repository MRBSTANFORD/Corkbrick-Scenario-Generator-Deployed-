
import React, { useState, useRef } from 'react';

interface ConfigPanelProps {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  isLoading: boolean;
  currentModelName: string;
  aiProvider: 'google' | 'huggingface';
  setAiProvider: (provider: 'google' | 'huggingface') => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  systemPrompt, 
  setSystemPrompt, 
  isLoading, 
  currentModelName,
  aiProvider,
  setAiProvider
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const loadFileRef = useRef<HTMLInputElement>(null);

  const handleSavePromptToFile = () => {
    if (!systemPrompt.trim()) {
      alert("The system prompt is empty. There is nothing to save.");
      return;
    }
    const dataBlob = new Blob([systemPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = "corkbrick-system-prompt.txt";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadPromptFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File is not readable.");
        setSystemPrompt(text);
        alert("System prompt loaded successfully.");
      } catch (error) {
        alert(`Failed to load prompt: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        if(loadFileRef.current) {
            loadFileRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-stone-100 border border-stone-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left font-semibold text-stone-700 hover:bg-stone-200 bg-stone-50"
      >
        <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System & Provider Configuration
        </span>
        <svg
          className={`w-5 h-5 transition-transform text-stone-500 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-stone-200 space-y-6 bg-white">
          <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
            <h3 className="text-sm font-bold text-stone-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                AI Platform Selection
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    onClick={() => setAiProvider('google')}
                    className={`p-3 text-left border rounded-lg transition-all ${
                        aiProvider === 'google' 
                            ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' 
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${aiProvider === 'google' ? 'bg-amber-500' : 'bg-stone-300'}`}></div>
                        <span className="font-bold text-stone-800 text-sm">Google AI (Gemini)</span>
                    </div>
                    <p className="text-xs text-stone-500 ml-5">Default, stable performance with free tier limits.</p>
                </button>

                <button
                    onClick={() => setAiProvider('huggingface')}
                    className={`p-3 text-left border rounded-lg transition-all ${
                        aiProvider === 'huggingface' 
                            ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500' 
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${aiProvider === 'huggingface' ? 'bg-amber-500' : 'bg-stone-300'}`}></div>
                        <span className="font-bold text-stone-800 text-sm">Hugging Face (Meta / OSS)</span>
                        <span className="text-[10px] bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ml-auto">Beta</span>
                    </div>
                    <p className="text-xs text-stone-500 ml-5">Use open-source models like Llama. Free community limits.</p>
                </button>
            </div>
            
            {aiProvider === 'huggingface' && (
                <div className="mt-3 text-xs text-amber-800 bg-amber-50 p-3 rounded border border-amber-200 flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Note:</strong> Hugging Face integration is currently in Beta. You will need a standard Hugging Face Access Token. Rate limits may apply using community inference endpoints.
                    </span>
                </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Active Model Name
                </label>
                <div className="text-sm bg-white px-3 py-2 border border-stone-200 rounded text-stone-700 font-mono inline-block">
                  {aiProvider === 'google' ? currentModelName : 'stabilityai/stable-diffusion-xl-refiner-1.0'}
                </div>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
            <h3 className="text-sm font-bold text-stone-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                AI System Prompt
            </h3>
            <textarea
              id="system-prompt"
              rows={4}
              className="w-full p-3 border border-stone-200 rounded-lg shadow-inner focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-700 disabled:bg-stone-100 disabled:text-stone-400 bg-white"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={isLoading}
            />
             <p className="text-xs text-stone-500 mt-2">This prompt guides the AI's persona and rules. Advanced users can modify this.</p>
             
             <div className="mt-3 grid grid-cols-2 gap-3">
                  <input
                      type="file"
                      ref={loadFileRef}
                      onChange={handleLoadPromptFromFile}
                      accept="text/plain,.txt"
                      className="hidden"
                      id="load-prompt-input"
                  />
                  <label
                      htmlFor="load-prompt-input"
                      className={`w-full text-center cursor-pointer text-xs uppercase tracking-wider bg-white border border-stone-300 text-stone-700 px-3 py-2 rounded-md font-bold transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-50 hover:border-stone-400'}`}
                  >
                      Load File
                  </label>
                  <button
                      onClick={handleSavePromptToFile}
                      className="w-full text-xs uppercase tracking-wider bg-stone-700 text-white px-3 py-2 rounded-md hover:bg-stone-800 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={isLoading}
                  >
                      Save File
                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
