
import React, { useState } from 'react';

const InfoPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // Open by default for first-time users

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
        aria-expanded={isOpen}
      >
        <div>
            <h2 className="text-lg font-semibold text-stone-700">Welcome to the Corkbrick Scenario Generator! ✨</h2>
            <p className="text-sm text-stone-500">Unleash Your Creativity with AI</p>
        </div>
        <svg
          className={`w-5 h-5 transition-transform text-stone-500 ${isOpen ? 'rotate-180' : ''}`}
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
        <div className="mt-4 pt-4 border-t border-stone-200 space-y-4 text-sm text-stone-600">
            <div>
                <h3 className="font-semibold text-stone-700 mb-2">What is this tool?</h3>
                <p>This tool is your creative co-pilot, powered by Google's Gemini AI. Our vision is to empower you to visualize CORKBRICK's modular solutions in any setting you can imagine. It's about bringing your ideas to life, transforming simple images into stunning, shareable scenes that showcase the endless possibilities of sustainable, flexible design.</p>
            </div>
            <div>
                <h3 className="font-semibold text-stone-700 mb-2">How does it work? (It's simple!)</h3>
                <ol className="list-decimal list-inside space-y-2">
                    <li><span className="font-semibold">Upload Your Vision:</span> Start by uploading up to five images. This could be a picture of your own room, a CORKBRICK solution you love from our website, or even a sketch of an idea. The AI is smart enough to combine them!</li>
                    <li><span className="font-semibold">Describe Your Dream Scene:</span> Tell the AI what you want to create. Be descriptive! Do you want to see a CORKBRICK desk in a futuristic home office overlooking Mars? Or a cozy reading nook in a rustic cabin? Just write it down.</li>
                    <li><span className="font-semibold">Generate & Inspire:</span> Click "Generate" and watch the AI create a unique, high-quality image based on your inputs.</li>
                </ol>
            </div>
            
            <div className="bg-stone-50 p-3 rounded-md border border-stone-200">
                <h3 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
                    Model Modes & Cost
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-stone-700">Standard Mode (Recommended)</h4>
                        <p className="text-xs text-stone-500 mb-1">Perfect for trying out the app.</p>
                        <ul className="list-disc list-inside text-xs space-y-1">
                            <li>Model: <strong>Gemini 2.5 Flash</strong></li>
                            <li>Cost: <span className="text-green-600 font-bold">Free</span> (Limited usage)</li>
                            <li>Note: Uses Google's Free Tier limits by default.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-amber-700">Advanced Mode</h4>
                        <p className="text-xs text-stone-500 mb-1">For professional, high-res results.</p>
                        <ul className="list-disc list-inside text-xs space-y-1">
                            <li>Model: <strong>Gemini 3 Pro</strong> & <strong>Veo Video</strong></li>
                            <li>Cost: <strong>Paid</strong> (Requires Billing)</li>
                            <li>Note: Best for final production assets.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-stone-700 mb-2">Create Amazing Content & Share It!</h3>
                <p>The power is in your hands. You can:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><span className="font-semibold">Redecorate your own space:</span> Take a photo of your living room and ask the AI to add a CORKBRICK bookshelf or wall divider.</li>
                    <li><span className="font-semibold">Explore new styles:</span> See how our solutions look in a minimalist Japanese apartment, a vibrant Brazilian beach house, or a grand historic library.</li>
                    <li><span className="font-semibold">Build your professional portfolio:</span> Create stunning visuals for your interior design projects.</li>
                    <li><span className="font-semibold">Become a CORKBRICK ambassador:</span> Share your unique creations on social media like LinkedIn, Instagram, or TikTok. Show the world the power of modularity and inspire others!</li>
                </ul>
                <p className="mt-3">This tool is more than just an image generator; it's a bridge between your imagination and reality. Let's build something amazing together.</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
