// components/network-lab/ConnectionProperties.tsx
import React from 'react';
import { Connection, Device } from '../../types/networkTopology';

interface ConnectionPropertiesProps {
  connection: Connection;
  sourceDevice: Device;
  targetDevice: Device;
  onUpdate: (updatedConnection: Connection) => void;
  onDelete: () => void;
}

const ConnectionProperties: React.FC<ConnectionPropertiesProps> = ({
  connection,
  sourceDevice,
  targetDevice,
  onUpdate,
  onDelete,
}) => {
  // Find the port objects
  const sourcePort = sourceDevice.ports.find(p => p.id === connection.sourcePortId);
  const targetPort = targetDevice.ports.find(p => p.id === connection.targetPortId);

  // Handle bandwidth change
  const handleBandwidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({
      ...connection,
      bandwidth: e.target.value,
    });
  };

  // Handle latency change
  const handleLatencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) return;

    onUpdate({
      ...connection,
      latency: value,
    });
  };

  // Handle status change
  const handleStatusChange = (status: Connection['status']) => {
    onUpdate({
      ...connection,
      status,
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Connection Details
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {connection.type} connection
        </p>
      </div>

      <div className="space-y-4">
        {/* Connection endpoints */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <span className="font-medium">{sourceDevice.name}</span>
              <span className="mx-1 text-gray-400">→</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{sourcePort?.name}</span>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Target</div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="font-medium">{targetDevice.name}</span>
              <span className="mx-1 text-gray-400">→</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{targetPort?.name}</span>
            </div>
          </div>
        </div>

        {/* Connection properties */}
        <div>
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 w-1/3">
              Type
            </label>
            <div className="mt-1 text-sm text-gray-900 dark:text-gray-100 capitalize">
              {connection.type}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <label htmlFor="bandwidth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 w-1/3">
              Bandwidth
            </label>
            <select
              id="bandwidth"
              value={connection.bandwidth}
              onChange={handleBandwidthChange}
              className="mt-1 block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            >
              <option value="10 Mbps">10 Mbps</option>
              <option value="100 Mbps">100 Mbps</option>
              <option value="1 Gbps">1 Gbps</option>
              <option value="10 Gbps">10 Gbps</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <label htmlFor="latency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 w-1/3">
              Latency (ms)
            </label>
            <input
              type="number"
              id="latency"
              value={connection.latency}
              onChange={handleLatencyChange}
              min="0"
              className="mt-1 block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 w-1/3">
              Status
            </label>
            <div className="mt-1 flex space-x-2">
              <button
                onClick={() => handleStatusChange('active')}
                className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                  connection.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusChange('inactive')}
                className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                  connection.status === 'inactive'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Inactive
              </button>
              <button
                onClick={() => handleStatusChange('error')}
                className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                  connection.status === 'error'
                    ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Error
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionProperties;