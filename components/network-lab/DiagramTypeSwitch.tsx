// components/network-lab/DiagramTypeSwitch.tsx
import React from 'react';
import { DiagramType } from '../../types/networkTopology';

interface DiagramTypeSwitchProps {
  diagramType: DiagramType;
  onChange: (type: DiagramType) => void;
}

const DiagramTypeSwitch: React.FC<DiagramTypeSwitchProps> = ({
  diagramType,
  onChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex justify-center">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            diagramType === 'logical'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => onChange('logical')}
        >
          <i className="fas fa-project-diagram mr-2"></i>
          論理構成図
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            diagramType === 'physical'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => onChange('physical')}
        >
          <i className="fas fa-server mr-2"></i>
          物理構成図
        </button>
      </div>
    </div>
  );
};

export default DiagramTypeSwitch;