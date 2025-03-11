// components/labs/NetworkLabSimulator.tsx
import React, { useState, useEffect, useRef, MouseEvent, TouchEvent } from 'react';
import { motion } from 'framer-motion';
import Node from './Node';
import ConnectionComponent from './Connection';
import Region from './Region';
import DeviceCLI from '../cli/DeviceCLI';
import { NetworkDevice, Connection, Location, TestResult } from '../../types/network';
import { getDeviceColorClasses } from './helpers';
import { initialDevices, initialConnections, initialLocations, predefinedTests } from './sampleData';

const NetworkLabSimulator: React.FC = () => {
  // Main state
  const [devices, setDevices] = useState<NetworkDevice[]>(initialDevices);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testingInProgress, setTestingInProgress] = useState<boolean>(false);

  // UI state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [addingDevice, setAddingDevice] = useState<boolean>(false);
  const [newDevicePosition, setNewDevicePosition] = useState<{ x: number; y: number } | null>(null);
  const [connectionMode, setConnectionMode] = useState<{ active: boolean; source?: { deviceId: string; interfaceId: string } }>({ active: false });
  const [multiSelected, setMultiSelected] = useState<NetworkDevice[]>([]);
  const [showPanel, setShowPanel] = useState<'details' | 'tests' | 'logs' | 'regions' | 'usage'>('usage');
  const [cliDevice, setCliDevice] = useState<NetworkDevice | null>(null);

  // Custom test state
  const [customTestSrc, setCustomTestSrc] = useState<string>("");
  const [customTestDest, setCustomTestDest] = useState<string>("");
  const [customTestMethod, setCustomTestMethod] = useState<string>("ping");

  // Refs
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // ===== Logging =====
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  // ===== Node Dragging =====
  const handleNodeDragStop = (id: string, x: number, y: number) => {
    setDevices(prev =>
      prev.map(dev => (dev.id === id ? { ...dev, x, y } : dev))
    );
    addLog(`デバイス移動: ${id} 新位置 (${Math.round(x)}, ${Math.round(y)})`);
  };

  // ===== Selection =====
  const handleSelectDevice = (device: NetworkDevice, e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    if ('shiftKey' in e && e.shiftKey) {
      // Multi-select mode (for connection creation)
      setMultiSelected(prev => {
        const already = prev.find(d => d.id === device.id);
        if (already) return prev;
        const newSelection = [...prev, device];
        if (newSelection.length === 2) {
          if (window.confirm(`「${newSelection[0].name}」と「${newSelection[1].name}」を接続しますか？`)) {
            const newConn: Connection = {
              id: `conn-${Date.now()}`,
              from: { deviceId: newSelection[0].id, interfaceId: newSelection[0].interfaces[0]?.id || '' },
              to: { deviceId: newSelection[1].id, interfaceId: newSelection[1].interfaces[0]?.id || '' },
              type: 'ethernet',
              status: 'active',
              bandwidth: '1Gbps',
              color: '#3B82F6',
            };
            setConnections(prevConns => [...prevConns, newConn]);
            addLog(`接続作成: ${newSelection[0].name} から ${newSelection[1].name}`);
            return [];
          } else {
            return [];
          }
        }
        return newSelection;
      });
      return;
    }
    // Normal single selection
    setMultiSelected([]);
    setSelectedDevice(device);
    setSelectedConnection(null);
    setShowPanel('details');
    addLog(`デバイス選択: ${device.name}`);
  };

  const handleSelectConnection = (conn: Connection, e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    setSelectedConnection(conn);
    setSelectedDevice(null);
    setShowPanel('details');
    const src = devices.find(d => d.id === conn.from.deviceId);
    const dst = devices.find(d => d.id === conn.to.deviceId);
    addLog(`接続選択: ${src?.name || ''} から ${dst?.name || ''}`);
  };

  // ===== Canvas Pan & Zoom =====
  const startPan = (e: MouseEvent) => {
    if (addingDevice || connectionMode.active) return;
    if (e.target !== canvasRef.current) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initPan = { ...panOffset };
    setIsPanning(true);
    const handlePanMove = (moveEvent: MouseEvent) => {
      setPanOffset({
        x: initPan.x + (moveEvent.clientX - startX) / zoomLevel,
        y: initPan.y + (moveEvent.clientY - startY) / zoomLevel,
      });
    };
    const handlePanEnd = () => {
      setIsPanning(false);
      document.removeEventListener('mousemove', handlePanMove);
      document.removeEventListener('mouseup', handlePanEnd);
    };
    document.addEventListener('mousemove', handlePanMove);
    document.addEventListener('mouseup', handlePanEnd);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.05;
    const newZoom = e.deltaY > 0 ? Math.max(0.5, zoomLevel - zoomFactor) : Math.min(2, zoomLevel + zoomFactor);
    setZoomLevel(newZoom);
  };

  // ===== Pinch-to-Zoom (Touch) =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let initialDistance = 0;
    let initialZoom = zoomLevel;
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (initialDistance === 0) {
          initialDistance = distance;
          initialZoom = zoomLevel;
        } else {
          const newZoom = initialZoom * (distance / initialDistance);
          setZoomLevel(Math.min(2, Math.max(0.5, newZoom)));
        }
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) initialDistance = 0;
    };
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    return () => {
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [zoomLevel]);

  // ===== Canvas Click =====
  const handleCanvasClick = (e: MouseEvent) => {
    if (addingDevice) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / zoomLevel - panOffset.x;
      const y = (e.clientY - rect.top) / zoomLevel - panOffset.y;
      setNewDevicePosition({ x, y });
      setAddingDevice(false);
      addLog('新規デバイスの位置が決定されました。右側のパレットからデバイスタイプを選択してください。');
      return;
    }
    setSelectedDevice(null);
    setSelectedConnection(null);
    setMultiSelected([]);
  };

  // ===== Device & Connection Management =====
  const addDeviceAtPosition = (type: NetworkDevice['type'], position: { x: number; y: number }) => {
    const newId = `${type}-${Date.now()}`;
    const newName = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const newDevice: NetworkDevice = {
      id: newId,
      type,
      name: newName,
      x: position.x,
      y: position.y,
      location: '',
      interfaces: [{ id: 'eth0', name: 'eth0', type: 'ethernet', status: 'up' }],
      config: {},
      status: 'online',
      icon:
        type === 'router'
          ? 'fa-network-wired'
          : type === 'switch'
          ? 'fa-sitemap'
          : type === 'server'
          ? 'fa-server'
          : type === 'workstation'
          ? 'fa-desktop'
          : type === 'firewall'
          ? 'fa-shield-alt'
          : 'fa-question',
      zIndex: Math.max(...devices.map(d => d.zIndex), 0) + 1,
      isDragging: false,
    };
    setDevices(prev => [...prev, newDevice]);
    setSelectedDevice(newDevice);
    addLog(`新しいデバイスを追加: ${newName}`);
    setNewDevicePosition(null);
  };

  const deleteSelectedDevice = () => {
    if (!selectedDevice) return;
    setConnections(prev => prev.filter(conn => conn.from.deviceId !== selectedDevice.id && conn.to.deviceId !== selectedDevice.id));
    setLocations(prev =>
      prev.map(loc => ({ ...loc, devices: loc.devices.filter(id => id !== selectedDevice.id) }))
    );
    setDevices(prev => prev.filter(dev => dev.id !== selectedDevice.id));
    addLog(`デバイスを削除: ${selectedDevice.name}`);
    setSelectedDevice(null);
  };

  const deleteSelectedConnection = () => {
    if (!selectedConnection) return;
    setConnections(prev => prev.filter(conn => conn.id !== selectedConnection.id));
    addLog('接続を削除しました');
    setSelectedConnection(null);
  };

  const runNetworkTest = (sourceId: string, destinationId: string, testType: string = 'ping') => {
    setTestingInProgress(true);
    addLog(`テスト実行中: ${sourceId} から ${destinationId} への ${testType}`);
    setTimeout(() => {
      const src = devices.find(d => d.id === sourceId);
      const dst = devices.find(d => d.id === destinationId);
      if (!src || !dst) {
        addLog('テスト失敗: デバイスが見つかりません');
        setTestingInProgress(false);
        return;
      }
      const success = Math.random() > 0.3;
      const latency = Math.floor(Math.random() * 100) + 10;
      const newResult: TestResult = {
        id: `test-${Date.now()}`,
        source: sourceId,
        destination: destinationId,
        success,
        message: success ? `テスト成功: ${latency}ms` : 'テスト失敗: タイムアウト',
        details: [
          `テストタイプ: ${testType}`,
          `送信元: ${src.name} (${src.interfaces[0]?.ipAddress || 'N/A'})`,
          `宛先: ${dst.name} (${dst.interfaces[0]?.ipAddress || 'N/A'})`,
          ...(success
            ? [`往復時間: ${latency}ms`, `ホップ数: ${Math.floor(Math.random() * 5) + 1}`]
            : ['パケットが到達できませんでした', 'ネットワーク設定を確認してください']),
        ],
        timestamp: new Date(),
      };
      setTestResults(prev => [newResult, ...prev]);
      addLog(success
        ? `テスト成功: ${src.name} から ${dst.name} への ${testType}, 応答時間 ${latency}ms`
        : `テスト失敗: ${src.name} から ${dst.name} への ${testType}`
      );
      setTestingInProgress(false);
    }, 1500);
  };

  const handleCustomTest = () => {
    if (!customTestSrc || !customTestDest) {
      addLog('送信元と宛先を選択してください');
      return;
    }
    runNetworkTest(customTestSrc, customTestDest, customTestMethod);
  };

  // ===== Region Management =====
  const addRegion = () => {
    const newRegion = {
      id: `region-${Date.now()}`,
      name: 'New Region',
      color: 'rgba(16,185,129,0.2)',
      x: 100,
      y: 100,
      width: 300,
      height: 300,
      devices: [],
    };
    setLocations(prev => [...prev, newRegion]);
    addLog(`新しいリージョンを追加: ${newRegion.name}`);
  };

  const updateRegion = (id: string, changes: Partial<Location>) => {
    setLocations(prev =>
      prev.map(region => (region.id === id ? { ...region, ...changes } : region))
    );
  };

  const deleteRegion = (id: string) => {
    setLocations(prev => prev.filter(region => region.id !== id));
    addLog('リージョンを削除しました');
  };

  // ===== Rendering Functions =====
  const calculateConnectionPosition = (conn: Connection) => {
    const src = devices.find(d => d.id === conn.from.deviceId);
    const dst = devices.find(d => d.id === conn.to.deviceId);
    if (!src || !dst) return null;
    return {
      x1: src.x,
      y1: src.y,
      x2: dst.x,
      y2: dst.y,
    };
  };

  const renderLocations = () => {
    return locations.map(loc => (
      <Region
        key={loc.id}
        region={loc}
        zoom={zoomLevel}
        panOffset={panOffset}
        onUpdate={updateRegion}
        onDelete={deleteRegion}
      />
    ));
  };

  const renderConnections = () => {
    return connections.map(conn => {
      const pos = calculateConnectionPosition(conn);
      if (!pos) return null;
      return (
        <ConnectionComponent
          key={conn.id}
          connection={conn}
          zoom={zoomLevel}
          panOffset={panOffset}
          x1={pos.x1}
          y1={pos.y1}
          x2={pos.x2}
          y2={pos.y2}
          onSelect={handleSelectConnection}
        />
      );
    });
  };

  const renderDevices = () => {
    return devices.map(dev => (
      <Node
        key={dev.id}
        device={dev}
        zoom={zoomLevel}
        panOffset={panOffset}
        onDragStop={handleNodeDragStop}
        onSelect={handleSelectDevice}
      />
    ));
  };

  // ===== Bottom Panel Rendering =====
  const renderUsagePanel = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">使用方法</h3>
      <ul className="list-disc pl-5 text-sm text-gray-600">
        <li>ノードはドラッグして移動（マウスまたはタッチ）できます。</li>
        <li>ピンチまたはホイールでズームが可能です。</li>
        <li>「デバイス追加」ボタンをクリックし、キャンバス上の位置を選択後、右側のパレットでタイプを選んで追加します。</li>
        <li>Shiftキーを押しながら複数のノードをクリックすると、２つのノード間の接続を作成できます。</li>
        <li>ノードをクリックすると詳細パネルが表示され、IP、サブネット、VLANなどの編集が可能です。</li>
        <li>ファイアウォールの場合、詳細パネル内に「ポリシー追加」ボタンが表示され、新規ルールを作成できます。</li>
        <li>「CLI」ボタンで各デバイスのコマンドラインインターフェースを操作できます。</li>
        <li>下部タブからテスト、ログ、リージョン管理、使用方法の各パネルに切り替えられます。</li>
      </ul>
    </div>
  );

  const renderDetailsPanel = () => {
    if (selectedDevice) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">{selectedDevice.name}</h3>
            <div className="flex gap-2">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm"
                onClick={() => setCliDevice(selectedDevice)}
              >
                CLI
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={deleteSelectedDevice} title="デバイス削除">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">タイプ</div>
            <div className="text-sm">{selectedDevice.type}</div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">インターフェース</div>
            {selectedDevice.interfaces.map(iface => (
              <div key={iface.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded mb-2 text-sm">
                <div className="font-medium">{iface.name}</div>
                <div className="flex gap-2 items-center">
                  <span className="w-16">IP:</span>
                  <input
                    type="text"
                    value={iface.ipAddress || ''}
                    onChange={(e) =>
                      setDevices(prev =>
                        prev.map(dev =>
                          dev.id === selectedDevice.id
                            ? {
                                ...dev,
                                interfaces: dev.interfaces.map(i =>
                                  i.id === iface.id ? { ...i, ipAddress: e.target.value } : i
                                ),
                              }
                            : dev
                        )
                      )
                    }
                    className="border rounded px-1 text-xs w-28"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="w-16">サブネット:</span>
                  <input
                    type="text"
                    value={iface.subnetMask || ''}
                    onChange={(e) =>
                      setDevices(prev =>
                        prev.map(dev =>
                          dev.id === selectedDevice.id
                            ? {
                                ...dev,
                                interfaces: dev.interfaces.map(i =>
                                  i.id === iface.id ? { ...i, subnetMask: e.target.value } : i
                                ),
                              }
                            : dev
                        )
                      )
                    }
                    className="border rounded px-1 text-xs w-28"
                  />
                </div>
              </div>
            ))}
          </div>
          {selectedDevice.type === 'switch' && (
            <div>
              <div className="text-sm font-medium mb-1">VLAN設定</div>
              <input
                type="text"
                value={selectedDevice.config.vlan || ''}
                onChange={(e) =>
                  setDevices(prev =>
                    prev.map(dev =>
                      dev.id === selectedDevice.id ? { ...dev, config: { ...dev.config, vlan: e.target.value } } : dev
                    )
                  )
                }
                className="border rounded px-2 py-1 text-sm w-full"
                placeholder="例: 1,10,20"
              />
            </div>
          )}
          {selectedDevice.type === 'firewall' && selectedDevice.config.firewallRules && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">ファイアウォールポリシー</h4>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                  onClick={() => {
                    const newRule = {
                      id: `rule-${Date.now()}`,
                      action: 'allow',
                      source: 'any',
                      destination: 'any',
                      protocol: 'any',
                      port: '',
                      description: 'New policy',
                      enabled: true,
                    };
                    setDevices(prev =>
                      prev.map(dev =>
                        dev.id === selectedDevice.id
                          ? {
                              ...dev,
                              config: {
                                ...dev.config,
                                firewallRules: dev.config.firewallRules
                                  ? [...dev.config.firewallRules, newRule]
                                  : [newRule],
                              },
                            }
                          : dev
                      )
                    );
                    addLog('新しいファイアウォールポリシーを追加しました');
                  }}
                >
                  追加
                </button>
              </div>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">アクション</th>
                    <th className="text-left py-1">ソース</th>
                    <th className="text-left py-1">宛先</th>
                    <th className="text-left py-1">プロトコル</th>
                    <th className="text-left py-1">ポート</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDevice.config.firewallRules.map(rule => (
                    <tr key={rule.id} className="border-b">
                      <td className={`py-1 ${rule.action === 'allow' ? 'text-green-500' : 'text-red-500'}`}>
                        {rule.action === 'allow' ? '許可' : '拒否'}
                      </td>
                      <td className="py-1">{rule.source}</td>
                      <td className="py-1">{rule.destination}</td>
                      <td className="py-1">{rule.protocol}</td>
                      <td className="py-1">{rule.port || '全ポート'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    } else if (selectedConnection) {
      const src = devices.find(d => d.id === selectedConnection.from.deviceId);
      const dst = devices.find(d => d.id === selectedConnection.to.deviceId);
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">接続詳細</h3>
            <button className="text-red-500 hover:text-red-700" onClick={deleteSelectedConnection} title="接続削除">
              <i className="fas fa-trash"></i>
            </button>
          </div>
          <div className="text-sm">
            <div><strong>送信元:</strong> {src?.name || '不明'} ({selectedConnection.from.interfaceId})</div>
            <div><strong>宛先:</strong> {dst?.name || '不明'} ({selectedConnection.to.interfaceId})</div>
            <div><strong>タイプ:</strong> {selectedConnection.type}</div>
            <div><strong>帯域幅:</strong> {selectedConnection.bandwidth || '-'}</div>
            <div><strong>レイテンシ:</strong> {selectedConnection.latency ? `${selectedConnection.latency}ms` : '-'}</div>
          </div>
        </div>
      );
    } else {
      return renderUsagePanel();
    }
  };

  const renderTestsPanel = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">ネットワークテスト</h3>
      <div className="mb-4">
        <h4 className="font-medium mb-2">クイックテスト</h4>
        {predefinedTests.map((test, idx) => (
          <button
            key={idx}
            className="w-full text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded mb-2 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            onClick={() =>
              runNetworkTest(
                test.source === 'all' ? devices[0].id : test.source,
                test.destination === 'all' ? devices[0].id : test.destination,
                test.type
              )
            }
            disabled={testingInProgress}
          >
            <div className="flex items-center gap-2">
              <i className={`fas ${test.type === 'ping' ? 'fa-exchange-alt' : test.type === 'http' ? 'fa-globe' : 'fa-route'}`}></i>
              {test.name}
            </div>
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h4 className="font-medium mb-2">カスタムテスト</h4>
        <select className="w-full p-2 border rounded mb-2 text-sm" value={customTestSrc} onChange={(e) => setCustomTestSrc(e.target.value)} disabled={testingInProgress}>
          <option value="">送信元を選択...</option>
          {devices.map(dev => (
            <option key={dev.id} value={dev.id}>{dev.name}</option>
          ))}
        </select>
        <select className="w-full p-2 border rounded mb-2 text-sm" value={customTestDest} onChange={(e) => setCustomTestDest(e.target.value)} disabled={testingInProgress}>
          <option value="">宛先を選択...</option>
          {devices.map(dev => (
            <option key={dev.id} value={dev.id}>{dev.name}</option>
          ))}
        </select>
        <select className="w-full p-2 border rounded mb-2 text-sm" value={customTestMethod} onChange={(e) => setCustomTestMethod(e.target.value)} disabled={testingInProgress}>
          <option value="ping">Ping</option>
          <option value="traceroute">Traceroute</option>
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </select>
        <button
          className="w-full bg-primary hover:bg-primary-dark text-white p-2 rounded text-sm"
          onClick={handleCustomTest}
          disabled={testingInProgress}
        >
          {testingInProgress ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              テスト中...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <i className="fas fa-play"></i>
              テスト実行
            </div>
          )}
        </button>
      </div>
      <div>
        <h4 className="font-medium mb-2">テスト結果</h4>
        {testResults.length === 0 ? (
          <div className="text-center text-sm text-gray-500 p-4">テスト結果がありません</div>
        ) : (
          <div className="space-y-2">
            {testResults.map(result => (
              <div key={result.id} className={`p-3 rounded text-sm ${result.success ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium flex items-center gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {devices.find(d => d.id === result.source)?.name || 'Unknown'} → {devices.find(d => d.id === result.destination)?.name || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500">{result.timestamp.toLocaleTimeString()}</div>
                </div>
                <div className={result.success ? 'text-green-600' : 'text-red-600'}>{result.message}</div>
                <div className="mt-1 text-xs text-gray-600">
                  {result.details.map((d, i) => <div key={i}>{d}</div>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderLogsPanel = () => (
    <div className="bg-white dark:bg-gray-800 rounded-md border p-4 h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">ログ</h3>
        <button className="text-sm text-gray-500 hover:text-gray-700" onClick={() => setLogs([])}>
          クリア
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-700 p-3 rounded font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-center text-sm text-gray-500 p-4">ログがありません</div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="break-words">{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderRegionsPanel = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">リージョン管理</h3>
        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded" onClick={addRegion}>
          追加
        </button>
      </div>
      {locations.map(loc => (
        <div key={loc.id} className="p-3 rounded border mb-2 bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={loc.name}
              onChange={(e) => updateRegion(loc.id, { name: e.target.value })}
              className="border-b border-gray-300 dark:border-gray-600 bg-transparent text-sm font-medium w-full"
            />
            <button className="text-red-500 hover:text-red-700 ml-2" onClick={() => deleteRegion(loc.id)} title="削除">
              <i className="fas fa-trash"></i>
            </button>
          </div>
          <div className="mt-2 text-xs">
            <div className="flex gap-2">
              <span>X:</span>
              <input
                type="number"
                value={loc.x}
                onChange={(e) => updateRegion(loc.id, { x: Number(e.target.value) })}
                className="border rounded px-1 w-16"
              />
              <span>Y:</span>
              <input
                type="number"
                value={loc.y}
                onChange={(e) => updateRegion(loc.id, { y: Number(e.target.value) })}
                className="border rounded px-1 w-16"
              />
            </div>
            <div className="flex gap-2 mt-1">
              <span>幅:</span>
              <input
                type="number"
                value={loc.width}
                onChange={(e) => updateRegion(loc.id, { width: Number(e.target.value) })}
                className="border rounded px-1 w-16"
              />
              <span>高さ:</span>
              <input
                type="number"
                value={loc.height}
                onChange={(e) => updateRegion(loc.id, { height: Number(e.target.value) })}
                className="border rounded px-1 w-16"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBottomPanel = () => {
    switch (showPanel) {
      case 'details': return renderDetailsPanel();
      case 'tests': return renderTestsPanel();
      case 'logs': return renderLogsPanel();
      case 'regions': return renderRegionsPanel();
      case 'usage':
      default: return renderUsagePanel();
    }
  };

  // ===== Render Component =====
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 lg:p-8 max-w-full relative"
    >
      {/* Top Controls */}
      <div className="mb-4 flex items-center gap-4">
        <button
          className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-md shadow-md transition-colors text-sm"
          onClick={() => {
            setAddingDevice(true);
            addLog('デバイス追加モード: キャンバス上の位置をクリックしてください');
          }}
        >
          デバイス追加
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md shadow-md transition-colors text-sm ${connectionMode.active ? 'ring-2 ring-blue-600' : ''}`}
          onClick={() => {
            if (connectionMode.active) {
              setConnectionMode({ active: false });
              addLog('接続追加モードをキャンセルしました');
            } else {
              setConnectionMode({ active: true });
              addLog('接続追加モード: 2つのノードを順にクリックしてください');
            }
          }}
        >
          接続追加
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md shadow-md transition-colors text-sm"
          onClick={() => {
            setDevices(initialDevices);
            setConnections(initialConnections);
            setLocations(initialLocations);
            addLog('ラボがリセットされました');
          }}
        >
          リセット
        </button>
      </div>

      {/* Canvas Area */}
      <div
        className="relative w-full border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 min-h-[600px] mb-6"
        ref={canvasRef}
        onMouseDown={startPan}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
      >
        <div className="absolute inset-0" style={{ transform: `scale(${zoomLevel})`, transformOrigin: '0 0' }}>
          {renderLocations()}
          {renderConnections()}
          {renderDevices()}
        </div>
        {/* Zoom/Pan Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            className="bg-white dark:bg-gray-700 rounded-full p-2 shadow-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
            title="ズームイン"
          >
            <i className="fas fa-plus text-gray-700 dark:text-gray-300"></i>
          </button>
          <button
            className="bg-white dark:bg-gray-700 rounded-full p-2 shadow-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
            title="ズームアウト"
          >
            <i className="fas fa-minus text-gray-700 dark:text-gray-300"></i>
          </button>
          <button
            className="bg-white dark:bg-gray-700 rounded-full p-2 shadow-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            onClick={() => { setPanOffset({ x: 0, y: 0 }); setZoomLevel(1); }}
            title="リセット"
          >
            <i className="fas fa-home text-gray-700 dark:text-gray-300"></i>
          </button>
        </div>
      </div>

      {/* Add Device Palette */}
      {addingDevice && !newDevicePosition && (
        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 rounded">
          追加したい位置をキャンバス上でクリックしてください…
        </div>
      )}
      {newDevicePosition && (
        <div
          className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2"
          style={{
            left: (newDevicePosition.x + panOffset.x) * zoomLevel,
            top: (newDevicePosition.y + panOffset.y) * zoomLevel,
          }}
        >
          <div className="mb-2 text-sm font-medium">デバイスタイプ選択</div>
          {(['router', 'switch', 'server', 'workstation', 'firewall'] as const).map(type => (
            <button
              key={type}
              className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              onClick={() => {
                addDeviceAtPosition(type, newDevicePosition);
              }}
            >
              {type === 'router'
                ? 'ルーター'
                : type === 'switch'
                ? 'スイッチ'
                : type === 'server'
                ? 'サーバー'
                : type === 'workstation'
                ? 'ワークステーション'
                : 'ファイアウォール'}
            </button>
          ))}
          <button
            className="block w-full text-left px-2 py-1 mt-1 text-xs text-red-500 hover:underline"
            onClick={() => { setNewDevicePosition(null); addLog('デバイス追加をキャンセルしました'); }}
          >
            キャンセル
          </button>
        </div>
      )}

      {/* Bottom Panel */}
      <div className="mt-6">
        <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
          <div className="flex justify-around mb-4">
            {(['details', 'tests', 'logs', 'regions', 'usage'] as const).map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium ${showPanel === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setShowPanel(tab)}
              >
                {tab === 'details'
                  ? '詳細'
                  : tab === 'tests'
                  ? 'テスト'
                  : tab === 'logs'
                  ? 'ログ'
                  : tab === 'regions'
                  ? 'リージョン'
                  : '使用方法'}
              </button>
            ))}
          </div>
          <div className="p-4 border rounded-md bg-white dark:bg-gray-800">
            {renderBottomPanel()}
          </div>
        </div>
      </div>

      {/* CLI Modal */}
      {cliDevice && <DeviceCLI device={cliDevice} onClose={() => setCliDevice(null)} />}
    </motion.div>
  );
};

export default NetworkLabSimulator;
