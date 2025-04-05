// components/network-lab/MobileTopologyViewer.tsx
import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { saveAs } from 'file-saver';

// Import types and custom components
import { Device, Connection, VlanDefinition } from '../../types/networkTopology';
import { getExportTopologyAsJSON, exportToPdf } from '../../utils/exportUtils';
import TopologyNode from './TopologyNode';
import useWindowSize from '../../hooks/useWindowSize';

// Sample data for demonstration or when localStorage is empty
const sampleData = {
  devices: [],
  connections: [],
  vlans: [{ id: 1, name: 'デフォルト', color: '#0077B6' }]
};

const MobileTopologyViewer: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [vlans, setVlans] = useState<VlanDefinition[]>([]);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { width, height } = useWindowSize();
  const stageRef = React.useRef<any>(null);

  // Get viewport dimensions for the canvas
  const viewportWidth = width - 32; // Adjust for padding
  const viewportHeight = height > 600 ? 600 : height - 100; // Max height with adjustment

  // Load saved topology data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('networkTopology');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        if (parsedData.devices) setDevices(parsedData.devices);
        if (parsedData.connections) setConnections(parsedData.connections);
        if (parsedData.vlans) setVlans(parsedData.vlans);
      } else {
        // Use sample data if no saved data exists
        setDevices(sampleData.devices);
        setConnections(sampleData.connections);
        setVlans(sampleData.vlans);
      }
    } catch (error) {
      console.error('Failed to load topology from localStorage:', error);
    }
  }, []);

  // Handle zooming functionality
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setScale(prevScale => Math.min(3, prevScale + 0.1));
    } else {
      setScale(prevScale => Math.max(0.3, prevScale - 0.1));
    }
  };

  // Handle center view
  const handleCenterView = () => {
    if (devices.length === 0) {
      setPosition({ x: 0, y: 0 });
      return;
    }
    
    // Calculate bounding box of all devices
    const minX = Math.min(...devices.map(d => d.x));
    const minY = Math.min(...devices.map(d => d.y));
    const maxX = Math.max(...devices.map(d => d.x + d.width));
    const maxY = Math.max(...devices.map(d => d.y + d.height));
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Center view on this point
    setPosition({
      x: viewportWidth / 2 - centerX * scale,
      y: viewportHeight / 2 - centerY * scale,
    });
  };

  // Handle export to JSON
  const handleExportToJson = () => {
    try {
      const jsonData = getExportTopologyAsJSON(devices, connections, vlans);
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      saveAs(blob, 'network-topology.json');
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      alert('エクスポートに失敗しました。');
    }
  };

  // Handle export to PDF
  const handleExportToPdf = async () => {
    try {
      if (!stageRef.current) return;
      
      // Get the Konva stage and convert to image
      const stage = stageRef.current.getStage();
      const dataUrl = stage.toDataURL({ pixelRatio: 2 });
      
      // Export to PDF
      await exportToPdf(devices, connections, dataUrl, 'network-topology.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('PDFエクスポートに失敗しました。');
    }
  };

  // Calculate connection points and render connections
  const renderConnections = () => {
    return connections.map(connection => {
      const sourceDevice = devices.find(d => d.id === connection.sourceDeviceId);
      const targetDevice = devices.find(d => d.id === connection.targetDeviceId);
      
      if (!sourceDevice || !targetDevice) return null;
      
      // Determine connection color based on status
      let strokeColor = '#666';
      let strokeWidth = 1;
      
      if (connection.status === 'active') {
        strokeColor = '#4CAF50';
      } else if (connection.status === 'error') {
        strokeColor = '#F44336';
      }
      
      // Use custom path if defined, otherwise create a direct line
      let points: number[] = [];
      
      if (connection.pathPoints && connection.pathPoints.length >= 2) {
        // Use custom path
        points = connection.pathPoints.flatMap(point => [point.x, point.y]);
      } else {
        // Create a direct line between device centers
        const sourceX = sourceDevice.x + sourceDevice.width / 2;
        const sourceY = sourceDevice.y + sourceDevice.height / 2;
        const targetX = targetDevice.x + targetDevice.width / 2;
        const targetY = targetDevice.y + targetDevice.height / 2;
        points = [sourceX, sourceY, targetX, targetY];
      }
      
      return (
        <React.Fragment key={connection.id}>
          <Line
            points={points}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
            listening={false}
          />
        </React.Fragment>
      );
    });
  };

  // Display an empty state message if there's no data
  if (devices.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700 max-w-sm">
          <i className="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">データがありません</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            PCからデザイナーを使用してトポロジーを作成すると、ここに表示されます。
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            モバイルデバイスでは、既存のトポロジーを閲覧・エクスポートできます。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Mobile controls */}
      <div className="p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => handleZoom('in')}
            className="p-2 bg-white dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 shadow-sm"
            aria-label="Zoom in"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-2 bg-white dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 shadow-sm"
            aria-label="Zoom out"
          >
            <i className="fas fa-minus"></i>
          </button>
          <button
            onClick={handleCenterView}
            className="p-2 bg-white dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 shadow-sm"
            aria-label="Center view"
          >
            <i className="fas fa-expand"></i>
          </button>
        </div>
        
        <div className="text-center text-sm font-mono text-gray-500 dark:text-gray-400">
          {Math.round(scale * 100)}%
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleExportToJson}
            className="p-2 bg-white dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 shadow-sm"
            aria-label="Export JSON"
          >
            <i className="fas fa-file-code"></i>
          </button>
          <button
            onClick={handleExportToPdf}
            className="p-2 bg-white dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 shadow-sm"
            aria-label="Export PDF"
          >
            <i className="fas fa-file-pdf"></i>
          </button>
        </div>
      </div>
      
      {/* Canvas container */}
      <div className="flex-grow relative overflow-hidden h-full">
        <Stage
          width={viewportWidth}
          height={viewportHeight}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          ref={stageRef}
          draggable
          onDragEnd={(e) => {
            setPosition({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        >
          <Layer>
            {/* Grid (optional) */}
            {[...Array(Math.ceil(viewportWidth / 20))].map((_, i) => (
              <Line
                key={`v-${i}`}
                points={[i * 20, 0, i * 20, viewportHeight]}
                stroke="#ddd"
                strokeWidth={0.5 / scale}
                opacity={0.3}
              />
            ))}
            {[...Array(Math.ceil(viewportHeight / 20))].map((_, i) => (
              <Line
                key={`h-${i}`}
                points={[0, i * 20, viewportWidth, i * 20]}
                stroke="#ddd"
                strokeWidth={0.5 / scale}
                opacity={0.3}
              />
            ))}
            
            {/* Connections */}
            {renderConnections()}
            
            {/* Devices */}
            {devices.map(device => (
              <TopologyNode
                key={device.id}
                device={device}
                isSelected={false}
                onSelect={() => {}}
                onMove={() => {}}
                onPortClick={() => {}}
                vlans={vlans}
                diagramType="logical"
              />
            ))}
          </Layer>
        </Stage>
      </div>
      
      {/* Information panel */}
      <div className="p-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 text-center">
        <p>閲覧モード - {devices.length}デバイス / {connections.length}接続</p>
        <p className="text-xs mt-1">表示のみ - 編集にはPCが必要です</p>
      </div>
    </div>
  );
};

export default MobileTopologyViewer;