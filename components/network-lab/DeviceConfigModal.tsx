// components/network-lab/DeviceConfigModal.tsx
import React, { useState, useEffect } from 'react';
import { Device, NetworkConfig, DiagramType, Route } from '../../types/networkTopology';
import { getDeviceTypeInfo } from '../../utils/networkUtils';

interface DeviceConfigModalProps {
  isOpen: boolean;
  device: Device;
  onClose: () => void;
  onSave: (device: Device, config: NetworkConfig) => void;
  diagramType: DiagramType;
}

const DeviceConfigModal: React.FC<DeviceConfigModalProps> = ({
  isOpen,
  device,
  onClose,
  onSave,
  diagramType,
}) => {
  const [config, setConfig] = useState<NetworkConfig>({});
  const [activeTab, setActiveTab] = useState<'general' | 'interfaces' | 'routing' | 'vlan'>('general');

  useEffect(() => {
    // Initialize with device's current config
    setConfig({ ...(device.config || {}) });
  }, [device]);

  if (!isOpen) return null;

  const deviceTypeInfo = getDeviceTypeInfo(device.type);

  // Save configuration
  const handleSave = () => {
    onSave(device, config);
  };

  // Update hostname
  const handleHostnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      hostname: e.target.value,
    });
  };

  // Update interface
  const handleInterfaceChange = (index: number, field: string, value: string) => {
    const interfaces = [...(config.interfaces || [])];
    
    if (!interfaces[index]) {
      interfaces[index] = { ipAddress: '', subnetMask: '' };
    }
    
    interfaces[index] = {
      ...interfaces[index],
      [field]: value,
    };
    
    setConfig({
      ...config,
      interfaces,
    });
  };

  // Update gateway
  const handleGatewayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      gateway: e.target.value,
    });
  };

  // Add route
  const handleAddRoute = () => {
    const routes = [...(config.routes || [])];
    
    routes.push({
      destination: '',
      nextHop: '',
      metric: 1,
    });
    
    setConfig({
      ...config,
      routes,
    });
  };

  // Update route
  const handleRouteChange = (index: number, field: string, value: string | number) => {
    const routes = [...(config.routes || [])];
    
    routes[index] = {
      ...routes[index],
      [field]: value,
    };
    
    setConfig({
      ...config,
      routes,
    });
  };

  // Remove route
  const handleRemoveRoute = (index: number) => {
    const routes = [...(config.routes || [])];
    routes.splice(index, 1);
    
    setConfig({
      ...config,
      routes,
    });
  };

  // Toggle DHCP
  const handleDhcpToggle = (checked: boolean) => {
    setConfig({
      ...config,
      dhcp: checked,
    });
  };

  // Toggle NAT
  const handleNatToggle = (checked: boolean) => {
    setConfig({
      ...config,
      nat: checked,
    });
  };

  // Add VLAN
  const handleAddVlan = () => {
    const vlans = [...(config.vlans || [])];
    
    vlans.push({
      id: vlans.length + 1,
      name: `VLAN${vlans.length + 1}`,
      interfaces: [],
    });
    
    setConfig({
      ...config,
      vlans,
    });
  };

  // Update VLAN
  const handleVlanChange = (index: number, field: string, value: string | number) => {
    const vlans = [...(config.vlans || [])];
    
    vlans[index] = {
      ...vlans[index],
      [field]: value,
    };
    
    setConfig({
      ...config,
      vlans,
    });
  };

  // Remove VLAN
  const handleRemoveVlan = (index: number) => {
    const vlans = [...(config.vlans || [])];
    vlans.splice(index, 1);
    
    setConfig({
      ...config,
      vlans,
    });
  };

  // Toggle VLAN port assignment
  const handleVlanPortToggle = (vlanId: number, portId: string, checked: boolean) => {
    const updatedPorts = [...device.ports];
    const portIndex = updatedPorts.findIndex(port => port.id === portId);
    
    if (portIndex !== -1) {
      updatedPorts[portIndex] = {
        ...updatedPorts[portIndex],
        vlanId: checked ? vlanId : undefined,
      };
      
      // This would need to be implemented in the main component
      // For now, we're just updating the config
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start mb-4">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {deviceTypeInfo.label} 設定 - {device.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  デバイスの詳細設定を行います
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm mr-8 ${
                    activeTab === 'general'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('general')}
                >
                  一般
                </button>

                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm mr-8 ${
                    activeTab === 'interfaces'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('interfaces')}
                >
                  インターフェイス
                </button>

                {(device.type === 'router' || device.type === 'firewall') && (
                  <button
                    className={`py-2 px-1 border-b-2 font-medium text-sm mr-8 ${
                      activeTab === 'routing'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('routing')}
                  >
                    ルーティング
                  </button>
                )}

                {(device.type === 'switch' || device.type === 'router') && (
                  <button
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'vlan'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('vlan')}
                  >
                    VLAN
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto p-1">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ホスト名
                    </label>
                    <input
                      type="text"
                      value={config.hostname || ''}
                      onChange={handleHostnameChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>

                  {/* Device specific options */}
                  {(device.type === 'router' || device.type === 'firewall') && (
                    <div className="flex items-center">
                      <input
                        id="nat-enabled"
                        type="checkbox"
                        checked={config.nat || false}
                        onChange={(e) => handleNatToggle(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                      />
                      <label htmlFor="nat-enabled" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        NAT有効
                      </label>
                    </div>
                  )}

                  {(device.type === 'workstation' || device.type === 'server') && (
                    <div className="flex items-center">
                      <input
                        id="dhcp-enabled"
                        type="checkbox"
                        checked={config.dhcp || false}
                        onChange={(e) => handleDhcpToggle(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                      />
                      <label htmlFor="dhcp-enabled" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        DHCP有効
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Interfaces Tab */}
              {activeTab === 'interfaces' && (
                <div className="space-y-4">
                  {device.ports
                    .filter(port => port.type === 'ethernet' || port.type === 'fiber')
                    .map((port, index) => (
                      <div key={port.id} className="border border-gray-300 dark:border-gray-700 rounded-md p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {port.name}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              IPアドレス
                            </label>
                            <input
                              type="text"
                              placeholder="192.168.1.1"
                              value={config.interfaces?.[index]?.ipAddress || ''}
                              onChange={(e) => handleInterfaceChange(index, 'ipAddress', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                              disabled={config.dhcp}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              サブネットマスク
                            </label>
                            <input
                              type="text"
                              placeholder="255.255.255.0"
                              value={config.interfaces?.[index]?.subnetMask || ''}
                              onChange={(e) => handleInterfaceChange(index, 'subnetMask', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                              disabled={config.dhcp}
                            />
                          </div>
                        </div>
                        
                        {(device.type === 'workstation' || device.type === 'server') && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              デフォルトゲートウェイ
                            </label>
                            <input
                              type="text"
                              placeholder="192.168.1.254"
                              value={config.gateway || ''}
                              onChange={handleGatewayChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                              disabled={config.dhcp}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Routing Tab */}
              {activeTab === 'routing' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      ルーティングテーブル
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddRoute}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      ルート追加
                    </button>
                  </div>

                  <div className="space-y-4 mt-2">
                    {config.routes?.map((route, index) => (
                      <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-md p-4 relative">
                        <button
                          onClick={() => handleRemoveRoute(index)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                          title="削除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              宛先ネットワーク
                            </label>
                            <input
                              type="text"
                              placeholder="192.168.2.0/24"
                              value={route.destination || ''}
                              onChange={(e) => handleRouteChange(index, 'destination', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              ネクストホップ
                            </label>
                            <input
                              type="text"
                              placeholder="192.168.1.2"
                              value={route.nextHop || ''}
                              onChange={(e) => handleRouteChange(index, 'nextHop', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              メトリック
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={route.metric || 1}
                              onChange={(e) => handleRouteChange(index, 'metric', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!config.routes || config.routes.length === 0) && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                        ルートが設定されていません。「ルート追加」ボタンをクリックして追加してください。
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VLAN Tab */}
              {activeTab === 'vlan' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      VLAN設定
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddVlan}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      VLAN追加
                    </button>
                  </div>

                  <div className="space-y-4 mt-2">
                    {config.vlans?.map((vlan, index) => (
                      <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-md p-4 relative">
                        <button
                          onClick={() => handleRemoveVlan(index)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                          title="削除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              VLAN ID
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="4094"
                              value={vlan.id || ''}
                              onChange={(e) => handleVlanChange(index, 'id', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              VLAN名
                            </label>
                            <input
                              type="text"
                              value={vlan.name || ''}
                              onChange={(e) => handleVlanChange(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            インターフェイス割り当て
                          </label>
                          
                          <div className="mt-2 space-y-2">
                            {device.ports
                              .filter(port => port.type === 'ethernet')
                              .map((port) => (
                                <div key={port.id} className="flex items-center">
                                  <input
                                    id={`vlan-${vlan.id}-port-${port.id}`}
                                    type="checkbox"
                                    checked={port.vlanId === vlan.id}
                                    onChange={(e) => handleVlanPortToggle(vlan.id, port.id, e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                                  />
                                  <label
                                    htmlFor={`vlan-${vlan.id}-port-${port.id}`}
                                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    {port.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!config.vlans || config.vlans.length === 0) && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                        VLANが設定されていません。「VLAN追加」ボタンをクリックして追加してください。
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSave}
            >
              保存
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConfigModal;// Toggle DHCP
  const handleDhcpToggle = (checked: boolean) => {
    setConfig({
      ...config,
      dhcp: checked,
    });
  };

  // Toggle NAT
  const handleNatToggle = (checked: boolean) => {
    setConfig({
      ...config,
      nat: checked,
    });
  };

  // Add VLAN
  const handleAddVlan = () => {
    const vlans = [...(config.vlans || [])];
    
    vlans.push({
      id: vlans.length + 1,
      name: `VLAN${vlans.length + 1}`,
      interfaces: [],
    });
    
    setConfig({
      ...config,
      vlans,
    });
  };

  // Update VLAN
  const handleVlanChange = (index: number, field: string, value: string | number) => {
    const vlans = [...(config.vlans || [])];
    
    vlans[index] = {
      ...vlans[index],
      [field]: value,
    };
    
    setConfig({
      ...config,
      vlans,
    });
  };

  // Remove VLAN
  const handleRemoveVlan = (index: number) => {
    const vlans = [...(config.vlans || [])];
    vlans.splice(index, 1);
    
    setConfig({
      ...config,
      vlans,
    });
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start mb-4">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {deviceTypeInfo.label} 設定 - {device.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  デバイスの詳細設定を行います
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm mr-8 ${
                    activeTab === 'general'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('general')}
                >
                  一般
                </button>

                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm mr-8 ${
                    activeTab === 'interfaces'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('interfaces')}
                >
                  インターフェイス
                </button>

                {(device.type === 'router' || device.type === 'firewall') && (
                  <button
                    className={`py-2 px-1 border-b-2 font-medium text-sm mr-8 ${
                      activeTab === 'routing'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('routing')}
                  >
                    ルーティング
                  </button>
                )}

                {(device.type === 'switch' || device.type === 'router') && (
                  <button
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'vlan'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('vlan')}
                  >
                    VLAN
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto p-1">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ホスト名
                    </label>
                    <input
                      type="text"
                      value={config.hostname || ''}
                      onChange={handleHostnameChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    />
                  </div>

                  {/* Device specific options */}
                  {(device.type === 'router' || device.type === 'firewall') && (
                    <div className="flex items-center">
                      <input
                        id="nat-enabled"
                        type="checkbox"
                        checked={config.nat || false}
                        onChange={(e) => handleNatToggle(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                      />
                      <label htmlFor="nat-enabled" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        NAT有効
                      </label>
                    </div>
                  )}

                  {(device.type === 'workstation' || device.type === 'server') && (
                    <div className="flex items-center">
                      <input
                        id="dhcp-enabled"
                        type="checkbox"
                        checked={config.dhcp || false}
                        onChange={(e) => handleDhcpToggle(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                      />
                      <label htmlFor="dhcp-enabled" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        DHCP有効
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Interfaces Tab */}
              {activeTab === 'interfaces' && (
                <div className="space-y-4">
                  {device.ports
                    .filter(port => port.type === 'ethernet' || port.type === 'fiber')
                    .map((port, index) => (
                      <div key={port.id} className="border border-gray-300 dark:border-gray-700 rounded-md p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {port.name}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            インターフェイス割り当て
                          </label>
                          
                          <div className="mt-2 space-y-2">
                            {device.ports
                              .filter(port => port.type === 'ethernet')
                              .map((port) => (
                                <div key={port.id} className="flex items-center">
                                  <input
                                    id={`vlan-${vlan.id}-port-${port.id}`}
                                    type="checkbox"
                                    checked={port.vlanId === vlan.id}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                                    onChange={() => {
                                      // We would need to update the ports directly in the device
                                      // This is a simplified version
                                    }}
                                  />
                                  <label
                                    htmlFor={`vlan-${vlan.id}-port-${port.id}`}
                                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    {port.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!config.vlans || config.vlans.length === 0) && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                        VLANが設定されていません。「VLAN追加」ボタンをクリックして追加してください。
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSave}
            >
              保存
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={onClose}
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConfigModal; mb-1">
                              IPアドレス
                            </label>
                            <input
                              type="text"
                              placeholder="192.168.1.1"
                              value={config.interfaces?.[index]?.ipAddress || ''}
                              onChange={(e) => handleInterfaceChange(index, 'ipAddress', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                              disabled={config.dhcp}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              サブネットマスク
                            </label>
                            <input
                              type="text"
                              placeholder="255.255.255.0"
                              value={config.interfaces?.[index]?.subnetMask || ''}
                              onChange={(e) => handleInterfaceChange(index, 'subnetMask', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                              disabled={config.dhcp}
                            />
                          </div>
                        </div>
                        
                        {(device.type === 'workstation' || device.type === 'server') && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              デフォルトゲートウェイ
                            </label>
                            <input
                              type="text"
                              placeholder="192.168.1.254"
                              value={config.gateway || ''}
                              onChange={handleGatewayChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                              disabled={config.dhcp}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Routing Tab */}
              {activeTab === 'routing' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      ルーティングテーブル
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddRoute}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      ルート追加
                    </button>
                  </div>

                  <div className="space-y-4 mt-2">
                    {config.routes?.map((route, index) => (
                      <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-md p-4 relative">
                        <button
                          onClick={() => handleRemoveRoute(index)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                          title="削除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              宛先ネットワーク
                            </label>
                            <input
                              type="text"
                              placeholder="192.168.2.0/24"
                              value={route.destination || ''}
                              onChange={(e) => handleRouteChange(index, 'destination', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              ネクストホップ
                            </label>
                            <input
                              type="text"
                              placeholder="192.168.1.2"
                              value={route.nextHop || ''}
                              onChange={(e) => handleRouteChange(index, 'nextHop', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              メトリック
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={route.metric || 1}
                              onChange={(e) => handleRouteChange(index, 'metric', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {(!config.routes || config.routes.length === 0) && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                        ルートが設定されていません。「ルート追加」ボタンをクリックして追加してください。
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VLAN Tab */}
              {activeTab === 'vlan' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      VLAN設定
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddVlan}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      VLAN追加
                    </button>
                  </div>

                  <div className="space-y-4 mt-2">
                    {config.vlans?.map((vlan, index) => (
                      <div key={index} className="border border-gray-300 dark:border-gray-700 rounded-md p-4 relative">
                        <button
                          onClick={() => handleRemoveVlan(index)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                          title="削除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              VLAN ID
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="4094"
                              value={vlan.id || ''}
                              onChange={(e) => handleVlanChange(index, 'id', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              VLAN名
                            </label>
                            <input
                              type="text"
                              value={vlan.name || ''}
                              onChange={(e) => handleVlanChange(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300