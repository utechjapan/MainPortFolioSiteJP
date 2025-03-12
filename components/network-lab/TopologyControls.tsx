// components/network-lab/TopologyControls.tsx
import React from 'react';

interface TopologyControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onCenterView: () => void;
  onToggleGrid: () => void;
  grid: boolean;
  onToggleSnapToGrid: () => void;
  snapToGrid: boolean;
}

const TopologyControls: React.FC<TopologyControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onCenterView,
  onToggleGrid,
  grid,
  onToggleSnapToGrid,
  snapToGrid,
}) => {
  return (
    <div className="absolute top-4 left-4 flex flex-col space-y-2 bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-300 dark:border-gray-700 p-1 z-10">
      <button
        onClick={onZoomIn}
        className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded focus:outline-none"
        title="Zoom In"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      
      <button
        onClick={onZoomOut}
        className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded focus:outline-none"
        title="Zoom Out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
        </svg>
      </button>
      
      <div className="py-1 px-2 text-center text-xs text-gray-600 dark:text-gray-400">
        {Math.round(scale * 100)}%
      </div>
      
      <button
        onClick={onZoomReset}
        className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded focus:outline-none"
        title="Reset Zoom"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      
      <div className="border-t border-gray-300 dark:border-gray-700 my-1"></div>
      
      <button
        onClick={onCenterView}
        className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded focus:outline-none"
        title="Center View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
      
      <button
        onClick={onToggleGrid}
        className={`p-2 ${
          grid 
            ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30' 
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        } rounded focus:outline-none`}
        title="Toggle Grid"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      </button>
      
      <button
        onClick={onToggleSnapToGrid}
        className={`p-2 ${
          snapToGrid 
            ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30' 
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        } rounded focus:outline-none`}
        title="Toggle Snap to Grid"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
    </div>
  );
};

export default TopologyControls;