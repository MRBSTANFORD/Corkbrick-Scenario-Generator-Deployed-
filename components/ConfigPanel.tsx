
import React, { useState, useRef } from 'react';

interface ConfigPanelProps {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  isLoading: boolean;
  currentModelName: string;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ systemPrompt, setSystemPrompt, isLoading, currentModelName }) => {
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
        // Reset file input to allow loading the same file again
        if(loadFileRef.current) {
            loadFileRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-stone-100 border border-stone-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left font-semibold text-stone-700 hover:bg-stone-200"
      >
        <span>Admin Configuration Panel</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-stone-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              Active Image Model
            </label>
            <p className="text-sm bg-white p-2 border border-stone-300 rounded-md text-stone-800 font-mono">
              {currentModelName}
            </p>
          </div>
          <div>
            <label htmlFor="system-prompt" className="block text-sm font-medium text-stone-600 mb-1">
              AI System Prompt
            </label>
            <textarea
              id="system-prompt"
              rows={6}
              className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-800 disabled:bg-stone-100"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={isLoading}
            />
             <p className="text-xs text-stone-500 mt-1">This prompt guides the AI's role. Use the buttons below to save or load it from your computer.</p>
          </div>
           <div className="mt-2 grid grid-cols-2 gap-2">
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
                    className={`w-full text-center cursor-pointer text-sm bg-stone-600 text-white px-3 py-2 rounded-md font-semibold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-700'}`}
                >
                    Load from File
                </label>
                <button
                    onClick={handleSavePromptToFile}
                    className="w-full text-sm bg-stone-600 text-white px-3 py-2 rounded-md hover:bg-stone-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    Save to File
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;
