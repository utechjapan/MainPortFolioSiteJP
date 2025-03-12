// components/network-lab/DeviceProperties.tsx
import React, { useState } from 'react';
import { Device, VlanDefinition, SimulationState } from '../../types/networkTopology';
import { getDeviceTypeInfo } from '../../utils/networkUtils';

interface DevicePropertiesProps {
  device: Device;
  vlans: VlanDefinition[];
  devices: Device[];
  simulationState: SimulationState;
  onUpdate: (updatedDevice: Device) => void;
  onDelete: () => void;
  onStartConnection: (deviceId: string, portId: string) => void;
  onPingTest: (sourceId: string, targetId: string) => void;
}

const DeviceProperties: React.FC<DevicePropertiesProps> = ({
  device,
  vlans,
  devices,
  simulationState,
  onUpdate,
  onDelete,
  onStartConnection,
  onPingTest,
}) => {

const DeviceProperties: React.FC<DevicePropertiesProps> = ({
  device,
  vlans,
  devices,
  simulationState,
  onUpdate,
  onDelete,
  onStartConnection,
  onPingTest,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'network' | 'ports'>('general');
  const deviceTypeInfo = getDeviceTypeInfo(device.type);
  const [targetDeviceId, setTargetDeviceId] = useState<string>('');
  
  // Handle device name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...device,
      name: e.target.value,
    });
  };
  
  // Handle IP address change
  const handleIpAddressChange = (interfaceIndex: number, value: string) => {
    const updatedInterfaces = [...(device.config.interfaces || [])];
    
    if (!updatedInterfaces[interfaceIndex]) {
      updatedInterfaces[interfaceIndex] = { ipAddress: '', subnetMask: '' };
    }
    
    updatedInterfaces[interfaceIndex] = {
      ...updatedInterfaces[interfaceIndex],
      ipAddress: value,
    };
    
    onUpdate({
      ...device,
      config: {
        ...device.config,
        interfaces: updatedInterfaces,
      },
    });
  };
  
  // Handle subnet mask change
  const handleSubnetMaskChange = (interfaceIndex: number, value: string) => {
    const updatedInterfaces = [...(device.config.interfaces || [])];
    
    if (!updatedInterfaces[interfaceIndex]) {
      updatedInterfaces[interfaceIndex] = { ipAddress: '', subnetMask: '' };
    }
    
    updatedInterfaces[interfaceIndex] = {
      ...updatedInterfaces[interfaceIndex],
      subnetMask: value,
    };
    
    onUpdate({
      ...device,
      config: {
        ...device.config,
        interfaces: updatedInterfaces,
      },
    });
  };
  
  // Handle gateway change
  const handleGatewayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...device,
      config: {
        ...device.config,
        gateway: e.target.value,
      },
    });
  };
  
  // Handle VLAN assignment
  const handleVlanChange = (portId: string, vlanId: number) => {
    onUpdate({
      ...device,
      ports: device.ports.map(port => 
        port.id === portId ? { ...port, vlanId } : port
      ),
    });
  };
  
  // Render tabs content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Device Type
              </label>
              <div className="mt-1 text-gray-900 dark:text-gray-100">
                {deviceTypeInfo.label || device.type}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Device Name
              </label>
              <input
                type="text"
                value={device.name}
                onChange={handleNameChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <div className="mt-1 flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    device.status === 'on' ? 'bg-green-500' : 
                    device.status === 'error' ? 'bg-red-500' : 
                    device.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}
                ></div>
                <span className="capitalize">{device.status}</span>
              </div>
            </div>
            
            {/* Actions section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Actions
              </label>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={onDelete}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Device
                </button>
                
                {simulationState === 'running' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <select
                        value={targetDeviceId}
                        onChange={(e) => setTargetDeviceId(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                      >
                        <option value="">Select target device...</option>
                        {devices
                          .filter(d => d.id !== device.id)
                          .map(d => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => {
                          if (targetDeviceId) {
                            onPingTest(device.id, targetDeviceId);
                          }
                        }}
                        disabled={!targetDeviceId}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Ping
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'network':
        return (
          <div className="space-y-4">
            {/* IP Configuration (device type specific) */}
            {['router', 'server', 'workstation'].includes(device.type) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={device.config.interfaces?.[0]?.ipAddress || ''}
                    onChange={(e) => handleIpAddressChange(0, e.target.value)}
                    placeholder="192.168.1.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subnet Mask
                  </label>
                  <input
                    type="text"
                    value={device.config.interfaces?.[0]?.subnetMask || ''}
                    onChange={(e) => handleSubnetMaskChange(0, e.target.value)}
                    placeholder="255.255.255.0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  />
                </div>
                
                {['workstation', 'server'].includes(device.type) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default Gateway
                    </label>
                    <input
                      type="text"
                      value={device.config.gateway || ''}
                      onChange={handleGatewayChange}
                      placeholder="192.168.1.1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    />
                  </div>
                )}
              </>
            )}
            
            {/* Additional network settings based on device type */}
            {device.type === 'router' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Routing
                </label>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {device.config.routes && device.config.routes.length > 0 ? (
                    <div className="space-y-2">
                      {device.config.routes.map((route, idx) => (
                        <div key={idx} className="border border-gray-200 dark:border-gray-700 p-2 rounded">
                          <div>Destination: {route.destination}</div>
                          <div>Next Hop: {route.nextHop}</div>
                          <div>Metric: {route.metric}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>No routes configured</span>
                  )}
                </div>
              </div>
            )}
            
            {device.type === 'switch' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  VLAN Configuration
                </label>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use the Ports tab to configure VLANs for each port.
                </div>
              </div>
            )}
          </div>
        );
        
      case 'ports':
        return (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Click on a port to start a connection
            </div>
            {device.ports.map((port) => (
              <div
                key={port.id}
                className="border border-gray-200 dark:border-gray-700 p-2 rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{port.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {port.type} | {port.isConnected ? 'Connected' : 'Available'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* VLAN selector (for switches and router ports) */}
                  {['switch', 'router'].includes(device.type) && port.type === 'ethernet' && (
                    <select
                      value={port.vlanId || ''}
                      onChange={(e) => handleVlanChange(port.id, parseInt(e.target.value) || 1)}
                      className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xs"
                    >
                      <option value="">No VLAN</option>
                      {vlans.map((vlan) => (
                        <option key={vlan.id} value={vlan.id}>
                          VLAN {vlan.id}: {vlan.name}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <button
                    onClick={() => onStartConnection(device.id, port.id)}
                    disabled={port.isConnected}
                    className="inline-flex items-center p-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {device.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {deviceTypeInfo.label}
        </p>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <nav className="-mb-px flex space-x-4">
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'network'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('network')}
          >
            Network
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'ports'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('ports')}
          >
            Ports
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {renderTabContent()}
    </div>
  );
};

export default DeviceProperties;