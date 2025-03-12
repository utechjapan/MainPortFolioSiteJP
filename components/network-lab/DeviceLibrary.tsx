// components/network-lab/DeviceLibrary.tsx
import React, { useState } from 'react';
import { DeviceType } from '../../types/networkTopology';
import { getDeviceTypeInfo } from '../../utils/networkUtils';

interface DeviceLibraryProps {
  onAddDevice: (type: DeviceType, x: number, y: number) => void;
}

const DeviceLibrary: React.FC<DeviceLibraryProps> = ({ onAddDevice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'network' | 'endpoint'>('all');
  
  // Define device categories
  const networkDevices: DeviceType[] = ['router', 'switch', 'firewall'];
  const endpointDevices: DeviceType[] = ['server', 'workstation'];
  const allDevices: DeviceType[] = [...networkDevices, ...endpointDevices];
  
  // Filter devices based on search and category
  const getFilteredDevices = () => {
    let filteredDevices: DeviceType[] = [];
    
    switch (selectedCategory) {
      case 'network':
        filteredDevices = networkDevices;
        break;
      case 'endpoint':
        filteredDevices = endpointDevices;
        break;
      case 'all':
      default:
        filteredDevices = allDevices;
        break;
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return filteredDevices.filter(type => {
        const deviceInfo = getDeviceTypeInfo(type);
        return (
          type.toLowerCase().includes(term) ||
          deviceInfo.label.toLowerCase().includes(term)
        );
      });
    }
    
    return filteredDevices;
  };
  
  const handleDragStart = (e: React.DragEvent, type: DeviceType) => {
    e.dataTransfer.setData('deviceType', type);
  };
  
  const handleAddDevice = (type: DeviceType) => {
    // Initial position in the center of the canvas
    const canvasWidth = window.innerWidth - 320; // Adjust for sidebars
    const canvasHeight = window.innerHeight - 100; // Adjust for header/footer
    const x = canvasWidth / 2;
    const y = canvasHeight / 2;
    
    onAddDevice(type, x, y);
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Devices</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm pr-8"
          />
          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
              onClick={() => setSearchTerm('')}
            >
              &times;
            </button>
          )}
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-700">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            selectedCategory === 'all'
              ? 'text-blue-600 border-b-2 border-blue-500 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            selectedCategory === 'network'
              ? 'text-blue-600 border-b-2 border-blue-500 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setSelectedCategory('network')}
        >
          Network
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            selectedCategory === 'endpoint'
              ? 'text-blue-600 border-b-2 border-blue-500 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setSelectedCategory('endpoint')}
        >
          Endpoints
        </button>
      </div>
      
      {/* Device list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {getFilteredDevices().map((type) => {
              const deviceInfo = getDeviceTypeInfo(type);
              return (
                <div
                  key={type}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 flex items-center cursor-grab hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, type)}
                  onClick={() => handleAddDevice(type)}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-md mr-3"
                    style={{ backgroundColor: deviceInfo.fill || '#f4f4f4' }}
                  >
                    <span
                      className="text-xl"
                      style={{ color: deviceInfo.iconColor || '#333' }}
                    >
                      {deviceInfo.icon}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {deviceInfo.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {deviceInfo.description || `Add ${type} to network`}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {getFilteredDevices().length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No devices found matching your filter
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="p-3 bg-gray-100 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400">
        <p className="mb-1">Drag a device onto the canvas or click to add it.</p>
        <p>Use the device properties panel to configure settings.</p>
      </div>
    </div>
  );
};

export default DeviceLibrary;