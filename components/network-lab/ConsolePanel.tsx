// components/network-lab/ConsolePanel.tsx
import React, { useEffect, useRef } from 'react';

interface ConsolePanelProps {
  output: string[];
  onClose: () => void;
  onClear: () => void;
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({
  output,
  onClose,
  onClear,
}) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 bg-gray-900 text-gray-100 border-t border-gray-700 z-40 flex flex-col">
      <div className="px-4 py-2 flex items-center justify-between bg-gray-800 border-b border-gray-700">
        <h3 className="text-sm font-medium">Console Output</h3>
        <div className="flex">
          <button
            onClick={onClear}
            className="ml-2 text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {output.length === 0 ? (
          <div className="text-gray-500 italic">Console output will appear here...</div>
        ) : (
          output.map((line, index) => {
            // Apply color highlighting based on message content
            let textColor = 'text-gray-300';
            if (line.includes('ERROR')) textColor = 'text-red-400';
            if (line.includes('WARNING')) textColor = 'text-yellow-400';
            if (line.includes('SUCCESS') || line.includes('successful')) textColor = 'text-green-400';
            if (line.includes('PING')) textColor = 'text-blue-400';
            if (line.startsWith('====')) textColor = 'text-purple-400 font-bold';
            
            return (
              <div key={index} className={`py-0.5 ${textColor}`}>
                {line}
              </div>
            );
          })
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
};

export default ConsolePanel;