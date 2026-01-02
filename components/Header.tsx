
import React from 'react';
import { MODEL_MODES } from '../constants';
import { ModelMode } from '../types';

interface HeaderProps {
  currentMode: ModelMode;
  onModeChange: (mode: ModelMode) => void;
  hasKey: boolean;
  onManageKey: () => void;
  onClearKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange, hasKey, onManageKey, onClearKey }) => {
  const currentConfig = MODEL_MODES[currentMode];

  const getImageModelLabel = (model: string) => {
    if (model === 'gemini-3-pro-image-preview') return 'Nano Banana 2';
    if (model === 'gemini-2.5-flash-image') return 'Flash Image';
    return model;
  };

  const getTextModelLabel = (model: string) => {
    if (model === 'gemini-3-pro-preview') return 'Gemini 3';
    if (model === 'gemini-2.5-flash') return 'Flash 2.5';
    return model;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 p-2 rounded-lg text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM14.95 13.536a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM6.464 14.95a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707z" />
                </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-800 leading-tight">Corkbrick AI</h1>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Scenario Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200">
                <button
                    onClick={() => onModeChange('standard')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    currentMode === 'standard'
                        ? 'bg-white text-stone-800 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                >
                    Standard
                </button>
                <button
                    onClick={() => onModeChange('advanced')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    currentMode === 'advanced'
                        ? 'bg-amber-100 text-amber-800 shadow-sm border border-amber-200'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                >
                    Advanced
                </button>
            </div>

            <div className="h-8 w-[1px] bg-stone-200 hidden sm:block"></div>

            <button
                onClick={hasKey ? onClearKey : onManageKey}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    hasKey 
                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                    : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
                }`}
                title={hasKey ? "Key is active. Click to clear." : "No key detected. Click to add."}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1h-2v2H4v-2H2v-2h2v-2l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
                <span className="hidden md:inline">{hasKey ? 'API Key Active' : 'Setup API Key'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
