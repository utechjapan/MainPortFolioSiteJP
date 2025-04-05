// components/network-lab/ConnectionPathEditor.tsx
import React, { useState, useEffect } from 'react';
import { Connection, Device, ConnectionPathPoint } from '../../types/networkTopology';
import { calculatePortPositions } from '../../utils/networkUtils';

interface ConnectionPathEditorProps {
  isOpen: boolean;
  connection: Connection;
  devices: Device[];
  onClose: () => void;
  onSave: (connection: Connection, pathPoints: ConnectionPathPoint[]) => void;
}

const ConnectionPathEditor: React.FC<ConnectionPathEditorProps> = ({
  isOpen,
  connection,
  devices,
  onClose,
  onSave,
}) => {
  const [pathPoints, setPathPoints] = useState<ConnectionPathPoint[]>([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [svgWidth, setSvgWidth] = useState(600);
  const [svgHeight, setSvgHeight] = useState(300);
  
  // Calculate endpoint positions
  const sourceDevice = devices.find(d => d.id === connection.sourceDeviceId);
  const targetDevice = devices.find(d => d.id === connection.targetDeviceId);
  
  useEffect(() => {
    if (!isOpen || !sourceDevice || !targetDevice) return;
    
    // Determine appropriate SVG dimensions based on device positions
    const minX = Math.min(sourceDevice.x, targetDevice.x) - 50;
    const minY = Math.min(sourceDevice.y, targetDevice.y) - 50;
    const maxX = Math.max(sourceDevice.x + sourceDevice.width, targetDevice.x + targetDevice.width) + 50;
    const maxY = Math.max(sourceDevice.y + sourceDevice.height, targetDevice.y + targetDevice.height) + 50;
    
    setSvgWidth(Math.max(600, maxX - minX));
    setSvgHeight(Math.max(300, maxY - minY));
    
    // Initialize path points from connection or create default
    if (connection.pathPoints && connection.pathPoints.length > 0) {
      setPathPoints([...connection.pathPoints]);
    } else {
      // Calculate default endpoints
      const sourcePortIndex = sourceDevice.ports.findIndex(p => p.id === connection.sourcePortId);
      const targetPortIndex = targetDevice.ports.findIndex(p => p.id === connection.targetPortId);
      
      const sourcePortPositions = calculatePortPositions(sourceDevice);
      const targetPortPositions = calculatePortPositions(targetDevice);
      
      const sourcePos = sourcePortPositions[sourcePortIndex];
      const targetPos = targetPortPositions[targetPortIndex];
      
      if (sourcePos && targetPos) {
        // Create a line with midpoint for easy bending
        const midX = (sourcePos.x + targetPos.x) / 2;
        const midY = (sourcePos.y + targetPos.y) / 2;
        
        setPathPoints([
          { x: sourcePos.x, y: sourcePos.y, type: 'endpoint' },
          { x: midX, y: midY, type: 'control' },
          { x: targetPos.x, y: targetPos.y, type: 'endpoint' }
        ]);
      }
    }
  }, [isOpen, connection, sourceDevice, targetDevice]);
  
  if (!isOpen || !sourceDevice || !targetDevice) return null;
  
  // Add a control point
  const handleAddPoint = () => {
    if (pathPoints.length < 2) return;
    
    // Find best segment to add a point
    let longestSegmentIndex = 0;
    let longestSegmentLength = 0;
    
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const p1 = pathPoints[i];
      const p2 = pathPoints[i + 1];
      const length = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      
      if (length > longestSegmentLength) {
        longestSegmentLength = length;
        longestSegmentIndex = i;
      }
    }
    
    // Add point in the middle of longest segment
    const p1 = pathPoints[longestSegmentIndex];
    const p2 = pathPoints[longestSegmentIndex + 1];
    
    const newPoint: ConnectionPathPoint = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
      type: 'control'
    };
    
    const newPoints = [
      ...pathPoints.slice(0, longestSegmentIndex + 1),
      newPoint,
      ...pathPoints.slice(longestSegmentIndex + 1)
    ];
    
    setPathPoints(newPoints);
    setSelectedPointIndex(longestSegmentIndex + 1);
  };
  
  // Remove a control point
  const handleRemovePoint = (index: number) => {
    // Don't remove endpoint (first or last point)
    if (index === 0 || index === pathPoints.length - 1) return;
    
    const newPoints = pathPoints.filter((_, i) => i !== index);
    setPathPoints(newPoints);
    setSelectedPointIndex(null);
  };
  
  // Update point position
  const handleUpdatePoint = (index: number, x: number, y: number) => {
    const newPoints = [...pathPoints];
    newPoints[index] = { ...newPoints[index], x, y };
    setPathPoints(newPoints);
  };
  
  // Handle drag point
  const handlePointDrag = (index: number, e: React.MouseEvent<SVGCircleElement>) => {
    if (e.buttons !== 1) return; // Only process left button drag
    
    const svg = e.currentTarget.closest('svg');
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    handleUpdatePoint(index, x, y);
  };
  
  // Handle save
  const handleSave = () => {
    onSave(connection, pathPoints);
  };
  
  // Generate SVG path data from points
  const generatePathData = () => {
    if (pathPoints.length < 2) return '';
    
    // Move to the first point
    let pathData = `M ${pathPoints[0].x},${pathPoints[0].y}`;
    
    // Add lines or curves to subsequent points
    for (let i = 1; i < pathPoints.length; i++) {
      pathData += ` L ${pathPoints[i].x},${pathPoints[i].y}`;
    }
    
    return pathData;
  };
  
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  接続経路の編集
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    接続の経路を編集します。ポイントを追加・移動してベジェ曲線を作成できます。
                  </p>
                </div>
                
                <div className="mt-4 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                  <svg 
                    width={svgWidth} 
                    height={svgHeight} 
                    className="bg-gray-100 dark:bg-gray-900 w-full"
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Grid for reference */}
                    {Array.from({ length: Math.ceil(svgWidth / 20) }).map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={i * 20}
                        y1={0}
                        x2={i * 20}
                        y2={svgHeight}
                        stroke="#ddd"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    ))}
                    {Array.from({ length: Math.ceil(svgHeight / 20) }).map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1={0}
                        y1={i * 20}
                        x2={svgWidth}
                        y2={i * 20}
                        stroke="#ddd"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    ))}
                    
                    {/* Source device representation */}
                    <rect
                      x={sourceDevice.x}
                      y={sourceDevice.y}
                      width={sourceDevice.width}
                      height={sourceDevice.height}
                      fill="#E6F0FF"
                      stroke="#2563EB"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={sourceDevice.x + sourceDevice.width / 2}
                      y={sourceDevice.y + sourceDevice.height / 2}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize="12"
                      fill="#2563EB"
                    >
                      {sourceDevice.name}
                    </text>
                    
                    {/* Target device representation */}
                    <rect
                      x={targetDevice.x}
                      y={targetDevice.y}
                      width={targetDevice.width}
                      height={targetDevice.height}
                      fill="#ECFDF5"
                      stroke="#059669"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={targetDevice.x + targetDevice.width / 2}
                      y={targetDevice.y + targetDevice.height / 2}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize="12"
                      fill="#059669"
                    >
                      {targetDevice.name}
                    </text>
                    
                    {/* Draw the path */}
                    <path 
                      d={generatePathData()}
                      fill="none"
                      stroke="#2196F3"
                      strokeWidth="2"
                    />
                    
                    {/* Draw control points */}
                    {pathPoints.map((point, index) => (
                      <g key={index}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={selectedPointIndex === index ? 8 : 6}
                          fill={point.type === 'endpoint' ? '#F44336' : '#2196F3'}
                          stroke="#fff"
                          strokeWidth="2"
                          cursor="move"
                          onClick={() => setSelectedPointIndex(index)}
                          onMouseDown={() => setSelectedPointIndex(index)}
                          onMouseMove={(e) => selectedPointIndex === index && handlePointDrag(index, e)}
                        />
                        {selectedPointIndex === index && (
                          <text
                            x={point.x + 10}
                            y={point.y - 10}
                            fontSize="12"
                            fill="#333"
                          >
                            {point.type === 'endpoint' ? 'エンドポイント' : 'コントロールポイント'}
                          </text>
                        )}
                      </g>
                    ))}
                  </svg>
                </div>
                
                <div className="mt-4">
                  {selectedPointIndex !== null && selectedPointIndex !== 0 && selectedPointIndex !== pathPoints.length - 1 && (
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          X 座標:
                        </label>
                        <input
                          type="number"
                          value={pathPoints[selectedPointIndex]?.x}
                          onChange={(e) => handleUpdatePoint(selectedPointIndex, parseInt(e.target.value), pathPoints[selectedPointIndex].y)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Y 座標:
                        </label>
                        <input
                          type="number"
                          value={pathPoints[selectedPointIndex]?.y}
                          onChange={(e) => handleUpdatePoint(selectedPointIndex, pathPoints[selectedPointIndex].x, parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        />
                      </div>
                      <button
                        onClick={() => handleRemovePoint(selectedPointIndex)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                      >
                        削除
                      </button>
                    </div>
                  )}

                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleAddPoint}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      ポイントを追加
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              保存
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionPathEditor;