// components/network-lab/SimulationControls.tsx
import React from 'react';
import { SimulationState } from '../../types/networkTopology';

interface SimulationControlsProps {
  simulationState: SimulationState;
  onStartSimulation: () => void;
  onStopSimulation: () => void;
  onToggleConsole: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  simulationState,
  onStartSimulation,
  onStopSimulation,
  onToggleConsole,
}) => {
  return (
    <div className="absolute bottom-8 right-4 flex flex-col space-y-2 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-300 dark:border-gray-700 p-2 z-10">
      {simulationState === 'stopped' ? (
        <button
          onClick={onStartSimulation}
          className="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded focus:outline-none"
          title="シミュレーション開始"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={onStopSimulation}
          className="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded focus:outline-none"
          title="シミュレーション停止"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>
      )}
      
      <button
        onClick={onToggleConsole}
        className="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded focus:outline-none"
        title="コンソール表示"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      
      <div className="py-1 flex items-center justify-center">
        <div
          className={`w-2 h-2 rounded-full ${
            simulationState === 'running'
              ? 'bg-green-500'
              : simulationState === 'paused'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default SimulationControls;