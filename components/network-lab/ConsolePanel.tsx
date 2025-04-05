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
        <h3 className="text-sm font-medium">コンソール出力</h3>
        <div className="flex">
          <button
            onClick={onClear}
            className="ml-2 text-gray-400 hover:text-gray-300 focus:outline-none"
            title="クリア"
          >
            <i className="fas fa-trash text-sm"></i>
          </button>
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-300 focus:outline-none"
            title="閉じる"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {output.length === 0 ? (
          <div className="text-gray-500 italic">コンソール出力はここに表示されます...</div>
        ) : (
          output.map((line, index) => {
            // Apply color highlighting based on message content
            let textColor = 'text-gray-300';
            if (line.includes('ERROR') || line.includes('エラー')) textColor = 'text-red-400';
            if (line.includes('WARNING') || line.includes('警告')) textColor = 'text-yellow-400';
            if (line.includes('SUCCESS') || line.includes('成功')) textColor = 'text-green-400';
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