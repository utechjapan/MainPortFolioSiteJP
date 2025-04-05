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
  onConfigureDevice: (device: Device) => void;
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
  onConfigureDevice,
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
  
  // Render tabs content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                デバイスタイプ
              </label>
              <div className="mt-1 text-gray-900 dark:text-gray-100">
                {deviceTypeInfo.label || device.type}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                デバイス名
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
                ステータス
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
            
            {/* Advanced Configuration Button */}
            <button
              onClick={() => onConfigureDevice(device)}
              className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fas fa-cog mr-2"></i>
              詳細設定
            </button>
            
            {/* Actions section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                アクション
              </label>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={onDelete}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <i className="fas fa-trash mr-2"></i>
                  デバイス削除
                </button>
                
                {simulationState === 'running' && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <select
                        value={targetDeviceId}
                        onChange={(e) => setTargetDeviceId(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                      >
                        <option value="">対象デバイスを選択</option>
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
                        <i className="fas fa-satellite-dish mr-2"></i>
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
            {/* IP Configuration (readonly summary view) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ネットワーク設定
              </label>
              
              <div className="mt-2 border border-gray-300 dark:border-gray-700 rounded-md p-3">
                {device.config.interfaces && device.config.interfaces.length > 0 ? (
                  <div className="space-y-2">
                    {device.config.interfaces.map((iface, idx) => (
                      <div key={idx} className="flex flex-wrap gap-2 text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          IP:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {iface.ipAddress || '未設定'}
                          {iface.subnetMask ? ` / ${iface.subnetMask}` : ''}
                        </span>
                      </div>
                    ))}
                    
                    {device.config.gateway && (
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Gateway:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {device.config.gateway}
                        </span>
                      </div>
                    )}
                    
                    {device.config.dhcp !== undefined && (
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          DHCP:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {device.config.dhcp ? '有効' : '無効'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    詳細設定ボタンからネットワーク設定を行ってください
                  </p>
                )}
              </div>
            </div>
            
            {/* Routing info for routers */}
            {device.type === 'router' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ルーティング情報
                </label>
                <div className="mt-2 border border-gray-300 dark:border-gray-700 rounded-md p-3">
                  {device.config.routes && device.config.routes.length > 0 ? (
                    <div className="space-y-2 text-sm">
                      {device.config.routes.map((route, idx) => (
                        <div key={idx} className="flex flex-wrap gap-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            宛先:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {route.destination || '0.0.0.0/0'} → {route.nextHop || 'Direct'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ルーティング情報がありません
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'ports':
        return (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              ポートをクリックして接続を開始します
            </div>
            {device.ports.map((port) => (
              <div
                key={port.id}
                className="border border-gray-200 dark:border-gray-700 p-2 rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{port.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {port.type} | {port.isConnected ? '接続済み' : '利用可能'}
                    {port.vlanId && ` | VLAN${port.vlanId}`}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onStartConnection(device.id, port.id)}
                    disabled={port.isConnected}
                    className={`inline-flex items-center p-1 border shadow-sm text-xs leading-4 font-medium rounded-md
                      ${port.isConnected
                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <i className="fas fa-plug mr-1"></i>
                    接続
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
            一般
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'network'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('network')}
          >
            ネットワーク
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'ports'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('ports')}
          >
            ポート
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {renderTabContent()}
    </div>
  );
};

export default DeviceProperties;