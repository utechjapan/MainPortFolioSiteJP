// components/network-lab/StatusBar.tsx
import React from 'react';
import { SimulationState, Position, DiagramType } from '../../types/networkTopology';

interface StatusBarProps {
  deviceCount: number;
  connectionCount: number;
  scale: number;
  position: Position;
  simulationState: SimulationState;
  diagramType: DiagramType;
}

const StatusBar: React.FC<StatusBarProps> = ({
  deviceCount,
  connectionCount,
  scale,
  position,
  simulationState,
  diagramType,
}) => {
  // Format mouse position coordinates
  const formattedX = Math.round(position.x);
  const formattedY = Math.round(position.y);
  
  // Calculate zoom percentage
  const zoomPercentage = Math.round(scale * 100);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 px-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center space-x-4">
        <div>
          <span className="font-medium">デバイス:</span> {deviceCount}
        </div>
        <div>
          <span className="font-medium">接続:</span> {connectionCount}
        </div>
        <div>
          <span className="font-medium">拡大率:</span> {zoomPercentage}%
        </div>
        <div>
          <span className="font-medium">位置:</span> X: {formattedX}, Y: {formattedY}
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center">
          <span className="font-medium mr-2">モード:</span>
          <span className="capitalize">{diagramType === 'logical' ? '論理構成図' : '物理構成図'}</span>
        </div>
        <div className="ml-4 flex items-center">
          <span className="font-medium mr-2">シミュレーション:</span>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-1 ${
                simulationState === 'running'
                  ? 'bg-green-500'
                  : simulationState === 'paused'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            ></div>
            <span className="capitalize">{
              simulationState === 'running' 
                ? '実行中' 
                : simulationState === 'paused' 
                ? '一時停止' 
                : '停止'
            }</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;