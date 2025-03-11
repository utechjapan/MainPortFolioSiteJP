// components/labs/NetworkLabSimulator.tsx
import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';

// ----------------------------------------------------------------
// Type definitions for network entities
// ----------------------------------------------------------------
interface NetworkInterface {
  id: string;
  name: string;
  type: string;
  ipAddress?: string;
  subnetMask?: string;
  macAddress?: string;
  status: 'up' | 'down';
}

interface Route {
  destination: string;
  nextHop: string;
  metric: number;
}

interface FirewallRule {
  id: string;
  action: 'allow' | 'deny';
  source: string;
  destination: string;
  protocol: 'tcp' | 'udp' | 'icmp' | 'any';
  port?: number | string;
  description?: string;
}

interface VpnConfig {
  type: 'site-to-site' | 'client-to-site';
  encryption: 'aes-256' | 'aes-128' | '3des';
  psk?: string;
  remoteEndpoint?: string;
  localSubnets?: string[];
  remoteSubnets?: string[];
}

interface NetworkDevice {
  id: string;
  type: 'router' | 'switch' | 'server' | 'firewall' | 'cloud' | 'vpn' | 'client';
  name: string;
  x: number;
  y: number;
  location?: string;
  interfaces: NetworkInterface[];
  config: {
    ipAddress?: string;
    subnetMask?: string;
    gateway?: string;
    dns?: string[];
    vlan?: string;
    routes?: Route[];
    firewallRules?: FirewallRule[];
    vpnConfig?: VpnConfig;
  };
  status: 'online' | 'offline' | 'warning';
  icon: string;
  zIndex: number;
  isDragging: boolean;
}

interface Connection {
  id: string;
  from: { deviceId: string; interfaceId: string };
  to: { deviceId: string; interfaceId: string };
  type: 'ethernet' | 'fiber' | 'wireless' | 'vpn';
  status: 'active' | 'inactive' | 'error';
  bandwidth?: string;
  latency?: number;
  packetLoss?: number;
}

interface Location {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TestResult {
  id: string;
  source: string;
  destination: string;
  success: boolean;
  message: string;
  details: string[];
  timestamp: Date;
}

// ----------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------

// 1. Dynamic Tailwind classes for device colors
const getDeviceColor = (device: NetworkDevice): string => {
  if (device.status === 'offline') return 'gray';
  switch (device.type) {
    case 'router': return 'blue';
    case 'switch': return 'green';
    case 'server': return 'purple';
    case 'client': return 'cyan';
    case 'firewall': return 'red';
    case 'vpn': return 'indigo';
    case 'cloud': return 'sky';
    default: return 'gray';
  }
};

const getDeviceColorClasses = (device: NetworkDevice): string => {
  const color = getDeviceColor(device);
  switch (color) {
    case 'blue':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    case 'green':
      return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
    case 'purple':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
    case 'cyan':
      return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400';
    case 'red':
      return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
    case 'indigo':
      return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
    case 'sky':
      return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
  }
};

// 2. Subnet CIDR calculation
const calculateSubnetCidr = (ipAddress: string, subnetMask: string): string => {
  if (!ipAddress || !subnetMask) return '';
  const ipParts = ipAddress.split('.').map(Number);
  const maskParts = subnetMask.split('.').map(Number);
  const networkParts = ipParts.map((part, i) => part & maskParts[i]);
  let cidrBits = 0;
  for (const part of maskParts) {
    const binary = part.toString(2);
    cidrBits += binary.split('').filter(bit => bit === '1').length;
  }
  return `${networkParts.join('.')}/${cidrBits}`;
};

// ----------------------------------------------------------------
// Initial state arrays (devices, connections, locations, tests)
// ----------------------------------------------------------------
const initialDevices: NetworkDevice[] = [
  // ... (same as before)
  // [Include the same initial devices here]
];

const initialConnections: Connection[] = [
  // ... (same as before)
  // [Include the same initial connections here]
];

const initialLocations: Location[] = [
  // ... (same as before)
  // [Include the same initial locations here]
];

const predefinedTests = [
  // ... (same as before)
  // [Include the same predefined tests here]
];

// ----------------------------------------------------------------
// NetworkLabSimulator Component
// ----------------------------------------------------------------
const NetworkLabSimulator = () => {
  // State management
  const [devices, setDevices] = useState<NetworkDevice[]>(initialDevices);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [createConnectionMode, setCreateConnectionMode] = useState<{
    active: boolean;
    source?: { deviceId: string; interfaceId: string };
  }>({ active: false });
  const [viewMode, setViewMode] = useState<'logical' | 'physical'>('logical');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'devices' | 'network' | 'testing' | 'monitor'>('devices');
  const [connectionFilter, setConnectionFilter] = useState<'all' | 'ethernet' | 'vpn'>('all');
  const [devicesToAdd, setDevicesToAdd] = useState<{ isOpen: boolean; position: { x: number; y: number } }>({
    isOpen: false,
    position: { x: 0, y: 0 }
  });
  // 6. Testing loading state
  const [testingInProgress, setTestingInProgress] = useState<boolean>(false);

  // Refs
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Initial setup
  useEffect(() => {
    addLog('ネットワークラボが初期化されました。テスト環境が利用可能です。');
  }, []);

  // ----------------------------------------------------------------
  // Drag and Pan Handlers (with touch fixes and state update improvements)
  // ----------------------------------------------------------------
  const startDrag = (deviceId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (e.nativeEvent instanceof TouchEvent) e.preventDefault();
    let clientX = e instanceof React.MouseEvent ? e.clientX : e.touches[0].clientX;
    let clientY = e instanceof React.MouseEvent ? e.clientY : e.touches[0].clientY;

    setDevices(prev =>
      prev.map(device =>
        device.id === deviceId
          ? { ...device, isDragging: true, zIndex: Math.max(...prev.map(d => d.zIndex)) + 1 }
          : device
      )
    );

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveClientX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const moveClientY = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;

      setDevices(prev => {
        const draggedDevice = prev.find(d => d.id === deviceId && d.isDragging);
        if (!draggedDevice) return prev;
        const newX = draggedDevice.x + (moveClientX - clientX);
        const newY = draggedDevice.y + (moveClientY - clientY);
        return prev.map(device =>
          device.id === deviceId ? { ...device, x: newX, y: newY } : device
        );
      });

      // Update clientX/clientY for next move
      clientX = moveClientX;
      clientY = moveClientY;
    };

    // Use passive: false for touchmove
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    function handleEnd() {
      setDevices(prev => prev.map(device => (device.id === deviceId ? { ...device, isDragging: false } : device)));
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    }
  };

  const startPan = (e: React.MouseEvent) => {
    if (e.button !== 1 && e.button !== 2) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPanX = panOffset.x;
    const startPanY = panOffset.y;
    setIsPanning(true);
    const handlePanMove = (moveEvent: MouseEvent) => {
      setPanOffset({
        x: startPanX + (moveEvent.clientX - startX) / zoomLevel,
        y: startPanY + (moveEvent.clientY - startY) / zoomLevel
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

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (createConnectionMode.active) {
      addLog('接続作成をキャンセルしました');
      setCreateConnectionMode({ active: false });
      return;
    }
    if (isPanning) return;
    if (e.button === 2) {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / zoomLevel - panOffset.x;
      const y = (e.clientY - rect.top) / zoomLevel - panOffset.y;
      setDevicesToAdd({ isOpen: true, position: { x, y } });
      return;
    }
    selectDevice(null);
    selectConnection(null);
  };

  // ----------------------------------------------------------------
  // Routing, Firewall, and Network Test Functions
  // ----------------------------------------------------------------
  const areInSameSubnet = (ip1: string, ip2: string, mask: string): boolean => {
    const ip1Parts = ip1.split('.').map(Number);
    const ip2Parts = ip2.split('.').map(Number);
    const maskParts = mask.split('.').map(Number);
    for (let i = 0; i < 4; i++) {
      if ((ip1Parts[i] & maskParts[i]) !== (ip2Parts[i] & maskParts[i])) return false;
    }
    return true;
  };

  const isIpInRange = (ip: string, cidr: string): boolean => {
    if (cidr === 'any') return true;
    if (!cidr.includes('/')) return ip === cidr;
    const [rangeIp, prefixStr] = cidr.split('/');
    const prefix = parseInt(prefixStr, 10);
    const ipBinary = ip.split('.').map(o => parseInt(o, 10).toString(2).padStart(8, '0')).join('');
    const rangeIpBinary = rangeIp.split('.').map(o => parseInt(o, 10).toString(2).padStart(8, '0')).join('');
    return ipBinary.substring(0, prefix) === rangeIpBinary.substring(0, prefix);
  };

  const ipToBinary = (ip: string): string =>
    ip.split('.').map(o => parseInt(o, 10).toString(2).padStart(8, '0')).join('');

  const findNetworkPath = (sourceId: string, targetId: string): string[] => {
    const graph: Record<string, string[]> = {};
    devices.forEach(device => (graph[device.id] = []));
    connections.forEach(conn => {
      if (graph[conn.from.deviceId] && graph[conn.to.deviceId]) {
        graph[conn.from.deviceId].push(conn.to.deviceId);
        graph[conn.to.deviceId].push(conn.from.deviceId);
      }
    });
    const queue: { id: string; path: string[] }[] = [{ id: sourceId, path: [sourceId] }];
    const visited = new Set<string>([sourceId]);
    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      if (id === targetId) return path;
      for (const neighbor of graph[id] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ id: neighbor, path: [...path, neighbor] });
        }
      }
    }
    return [];
  };

  const checkRouting = (source: NetworkDevice, destination: NetworkDevice): boolean => {
    if (source.id === destination.id) return true;
    const sourceIfs = source.interfaces.filter(i => i.ipAddress && i.subnetMask);
    const destIfs = destination.interfaces.filter(i => i.ipAddress && i.subnetMask);
    for (const sIf of sourceIfs) {
      for (const dIf of destIfs) {
        if (sIf.ipAddress && dIf.ipAddress && areInSameSubnet(sIf.ipAddress, dIf.ipAddress, sIf.subnetMask || '255.255.255.0')) {
          return true;
        }
      }
    }
    return findNetworkPath(source.id, destination.id).length > 0;
  };

  const checkFirewall = (source: NetworkDevice, destination: NetworkDevice, testType: string): boolean => {
    const path = findNetworkPath(source.id, destination.id);
    const firewalls = path.map(id => devices.find(d => d.id === id))
      .filter(d => d && d.config.firewallRules && d.config.firewallRules.length > 0);
    if (firewalls.length === 0) return true;
    const protocol = testType === 'ping' ? 'icmp' : testType === 'http' ? 'tcp' : 'any';
    const sourceIp = source.interfaces.find(i => i.ipAddress)?.ipAddress || '';
    const destIp = destination.interfaces.find(i => i.ipAddress)?.ipAddress || '';
    for (const firewall of firewalls) {
      if (!firewall || !firewall.config.firewallRules) continue;
      let allowed = false;
      for (const rule of firewall.config.firewallRules) {
        const sourceMatches = rule.source === 'any' || isIpInRange(sourceIp, rule.source);
        const destMatches = rule.destination === 'any' || isIpInRange(destIp, rule.destination);
        const protocolMatches = rule.protocol === 'any' || rule.protocol === protocol;
        if (sourceMatches && destMatches && protocolMatches) {
          allowed = rule.action === 'allow';
          break;
        }
      }
      if (!allowed) return false;
    }
    return true;
  };

  const simulateNetworkTest = (source: NetworkDevice, destination: NetworkDevice, testType: string): TestResult => {
    const sourceIp = source.interfaces.find(i => i.ipAddress)?.ipAddress || '';
    const destIp = destination.interfaces.find(i => i.ipAddress)?.ipAddress || '';
    if (!sourceIp || !destIp) {
      return {
        id: `test-${Date.now()}`,
        source: source.name,
        destination: destination.name,
        success: false,
        message: `IPアドレスが設定されていません: ${!sourceIp ? source.name : destination.name}`,
        details: ['IPアドレスの設定が必要です'],
        timestamp: new Date()
      };
    }
    const canRoute = checkRouting(source, destination);
    const firewallAllows = checkFirewall(source, destination, testType);
    let success = canRoute && firewallAllows;
    let message = success
      ? `${source.name} (${sourceIp}) から ${destination.name} (${destIp}) への接続成功`
      : `${source.name} (${sourceIp}) から ${destination.name} (${destIp}) への接続失敗`;
    const details: string[] = [];
    if (!canRoute) details.push('ルーティングパスが存在しないか、正しく設定されていません');
    if (!firewallAllows) details.push('ファイアウォールルールによって通信がブロックされています');
    const path = findNetworkPath(source.id, destination.id);
    if (path.length > 0) {
      details.push(`通信経路: ${path.map(hop => devices.find(d => d.id === hop)?.name || hop).join(' → ')}`);
      const pathConnections = path.slice(0, -1).map((deviceId, index) =>
        connections.find(conn =>
          (conn.from.deviceId === deviceId && conn.to.deviceId === path[index + 1]) ||
          (conn.to.deviceId === deviceId && conn.from.deviceId === path[index + 1])
        )
      );
      const totalLatency = pathConnections.reduce((sum, conn) => sum + (conn?.latency || 5), 0);
      details.push(`推定レイテンシ: ${totalLatency}ms`);
    } else if (source.id !== destination.id) {
      details.push('通信経路が見つかりませんでした');
      success = false;
    }
    return {
      id: `test-${Date.now()}`,
      source: source.name,
      destination: destination.name,
      success,
      message,
      details,
      timestamp: new Date()
    };
  };

  // 6. Network test with loading state and simulated delay
  const runTest = async (testId: string) => {
    setTestingInProgress(true);
    try {
      const test = predefinedTests.find(t => t.id === testId);
      if (!test) {
        addLog('テスト設定が見つかりません');
        return;
      }
      const sourceDevice = devices.find(d => d.id === test.source);
      const destDevice = devices.find(d => d.id === test.destination);
      if (!sourceDevice || !destDevice) {
        addLog('テスト失敗: デバイスが見つかりません');
        return;
      }
      addLog(`テスト実行: ${test.name}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      const testResult = simulateNetworkTest(sourceDevice, destDevice, test.type);
      setTestResults(prev => [testResult, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error('Test execution error:', err);
      addLog('テスト実行中にエラーが発生しました');
    } finally {
      setTestingInProgress(false);
    }
  };

  const runCustomTest = (sourceId: string, destId: string, testType: string) => {
    const sourceDevice = devices.find(d => d.id === sourceId);
    const destDevice = devices.find(d => d.id === destId);
    if (!sourceDevice || !destDevice) {
      addLog('テスト失敗: デバイスが見つかりません。');
      return;
    }
    addLog(`カスタムテスト実行: ${sourceDevice.name} から ${destDevice.name}`);
    const testResult = simulateNetworkTest(sourceDevice, destDevice, testType);
    setTestResults(prev => [testResult, ...prev.slice(0, 9)]);
  };

  // ----------------------------------------------------------------
  // Device creation and connection functions with error handling
  // ----------------------------------------------------------------
  const getDefaultName = (type: NetworkDevice['type']): string => {
    const count = devices.filter(d => d.type === type).length + 1;
    switch (type) {
      case 'router': return `Router ${count}`;
      case 'switch': return `Switch ${count}`;
      case 'server': return `Server ${count}`;
      case 'client': return `Client ${count}`;
      case 'firewall': return `Firewall ${count}`;
      case 'vpn': return `VPN Gateway ${count}`;
      case 'cloud': return `Cloud ${count}`;
      default: return `Device ${count}`;
    }
  };

  const getDefaultInterfaces = (type: NetworkDevice['type']): NetworkInterface[] => {
    const baseId = `if-${Date.now()}`;
    switch (type) {
      case 'router':
        return [
          { id: `${baseId}-1`, name: 'eth0', type: 'ethernet', status: 'up' },
          { id: `${baseId}-2`, name: 'eth1', type: 'ethernet', status: 'up' },
          { id: `${baseId}-3`, name: 'eth2', type: 'ethernet', status: 'up' }
        ];
      case 'switch':
        return [
          { id: `${baseId}-1`, name: 'port1', type: 'ethernet', status: 'up' },
          { id: `${baseId}-2`, name: 'port2', type: 'ethernet', status: 'up' },
          { id: `${baseId}-3`, name: 'port3', type: 'ethernet', status: 'up' },
          { id: `${baseId}-4`, name: 'port4', type: 'ethernet', status: 'up' }
        ];
      case 'server':
      case 'client':
        return [{ id: `${baseId}-1`, name: 'eth0', type: 'ethernet', status: 'up' }];
      case 'firewall':
        return [
          { id: `${baseId}-1`, name: 'external', type: 'ethernet', status: 'up' },
          { id: `${baseId}-2`, name: 'internal', type: 'ethernet', status: 'up' }
        ];
      case 'vpn':
        return [
          { id: `${baseId}-1`, name: 'eth0', type: 'ethernet', status: 'up' },
          { id: `${baseId}-2`, name: 'tun0', type: 'vpn', status: 'up' }
        ];
      case 'cloud':
        return [{ id: `${baseId}-1`, name: 'net0', type: 'ethernet', status: 'up' }];
      default:
        return [{ id: `${baseId}-1`, name: 'eth0', type: 'ethernet', status: 'up' }];
    }
  };

  const getDefaultConfig = (type: NetworkDevice['type']) => {
    switch (type) {
      case 'router':
        return { routes: [{ destination: '0.0.0.0/0', nextHop: '', metric: 1 }] };
      case 'switch':
        return { vlan: '1' };
      case 'firewall':
        return { firewallRules: [{ id: `fw-${Date.now()}-1`, action: 'allow', source: 'any', destination: 'any', protocol: 'any', description: 'Allow all traffic' }] };
      case 'vpn':
        return { vpnConfig: { type: 'site-to-site', encryption: 'aes-256', localSubnets: [], remoteSubnets: [] } };
      default:
        return {};
    }
  };

  const getDeviceIcon = (type: NetworkDevice['type']): string => {
    switch (type) {
      case 'router': return 'fa-network-wired';
      case 'switch': return 'fa-sitemap';
      case 'server': return 'fa-server';
      case 'client': return 'fa-desktop';
      case 'firewall': return 'fa-shield-alt';
      case 'vpn': return 'fa-lock';
      case 'cloud': return 'fa-cloud';
      default: return 'fa-microchip';
    }
  };

  const getLocationAtPosition = (x: number, y: number): Location | undefined => {
    return locations.find(loc => x >= loc.x && x <= loc.x + loc.width && y >= loc.y && y <= loc.y + loc.height);
  };

  const addDevice = (type: NetworkDevice['type'], x: number, y: number) => {
    const id = `device-${Date.now()}`;
    const newDevice: NetworkDevice = {
      id,
      type,
      name: getDefaultName(type),
      x,
      y,
      location: getLocationAtPosition(x, y)?.id,
      interfaces: getDefaultInterfaces(type),
      config: getDefaultConfig(type),
      status: 'online',
      icon: getDeviceIcon(type),
      zIndex: Math.max(...devices.map(d => d.zIndex), 0) + 1,
      isDragging: false
    };
    setDevices(prev => [...prev, newDevice]);
    addLog(`新しいデバイスを追加しました: ${newDevice.name}`);
    setDevicesToAdd({ isOpen: false, position: { x: 0, y: 0 } });
    return newDevice;
  };

  const startConnection = (deviceId: string, interfaceId: string) => {
    setCreateConnectionMode({ active: true, source: { deviceId, interfaceId } });
    addLog('接続の作成を開始しました。対象のインターフェースをクリックしてください');
  };

  const completeConnection = (deviceId: string, interfaceId: string) => {
    if (!createConnectionMode.active || !createConnectionMode.source) {
      setCreateConnectionMode({ active: false });
      return;
    }
    if (createConnectionMode.source.deviceId === deviceId) {
      addLog('同じデバイスには接続できません');
      setCreateConnectionMode({ active: false });
      return;
    }
    const connectionExists = connections.some(conn =>
      (conn.from.deviceId === createConnectionMode.source!.deviceId &&
        conn.from.interfaceId === createConnectionMode.source!.interfaceId &&
        conn.to.deviceId === deviceId &&
        conn.to.interfaceId === interfaceId) ||
      (conn.from.deviceId === deviceId &&
        conn.from.interfaceId === interfaceId &&
        conn.to.deviceId === createConnectionMode.source!.deviceId &&
        conn.to.interfaceId === createConnectionMode.source!.interfaceId)
    );
    if (connectionExists) {
      addLog('この接続は既に存在します');
      setCreateConnectionMode({ active: false });
      return;
    }
    const sourceDevice = devices.find(d => d.id === createConnectionMode.source!.deviceId);
    const targetDevice = devices.find(d => d.id === deviceId);
    if (!sourceDevice || !targetDevice) {
      addLog('デバイスが見つかりません');
      setCreateConnectionMode({ active: false });
      return;
    }
    const connectionType =
      sourceDevice.interfaces.find(i => i.id === createConnectionMode.source!.interfaceId)?.type === 'vpn' ||
      targetDevice.interfaces.find(i => i.id === interfaceId)?.type === 'vpn'
        ? 'vpn'
        : 'ethernet';
    try {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: { deviceId: createConnectionMode.source.deviceId, interfaceId: createConnectionMode.source.interfaceId },
        to: { deviceId, interfaceId },
        type: connectionType,
        status: 'active',
        bandwidth: connectionType === 'vpn' ? '100 Mbps' : '1 Gbps',
        latency: connectionType === 'vpn' ? 50 : 1
      };
      setConnections(prev => [...prev, newConnection]);
      addLog(`新しい接続を作成しました: ${sourceDevice.name} から ${targetDevice.name}`);
    } catch (err) {
      console.error('Connection creation error:', err);
      addLog('接続の作成中にエラーが発生しました');
    } finally {
      setCreateConnectionMode({ active: false });
    }
  };

  const deleteDevice = (deviceId: string) => {
    setConnections(prev => prev.filter(conn => conn.from.deviceId !== deviceId && conn.to.deviceId !== deviceId));
    setDevices(prev => prev.filter(device => device.id !== deviceId));
    if (selectedDevice?.id === deviceId) setSelectedDevice(null);
    addLog(`デバイスを削除しました`);
  };

  const deleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    if (selectedConnection?.id === connectionId) setSelectedConnection(null);
    addLog(`接続を削除しました`);
  };

  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(prev =>
      prev.map(device =>
        device.id === deviceId ? { ...device, status: device.status === 'online' ? 'offline' : 'online' } : device
      )
    );
    const device = devices.find(d => d.id === deviceId);
    addLog(`デバイスのステータスを変更しました: ${device?.name} (${device?.status === 'online' ? 'オフライン' : 'オンライン'})`);
    if (device?.status === 'online') {
      setConnections(prev =>
        prev.map(conn =>
          conn.from.deviceId === deviceId || conn.to.deviceId === deviceId ? { ...conn, status: 'inactive' } : conn
        )
      );
    } else {
      setConnections(prev =>
        prev.map(conn =>
          conn.from.deviceId === deviceId || conn.to.deviceId === deviceId ? { ...conn, status: 'active' } : conn
        )
      );
    }
  };

  // ----------------------------------------------------------------
  // Render JSX
  // ----------------------------------------------------------------
  return (
    <div className="bg-light-card dark:bg-dark-card p-4 md:p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">ネットワーク設定ラボ</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
        {(['devices', 'network', 'testing', 'monitor'] as const).map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'devices' && <i className="fas fa-server mr-2"></i>}
            {tab === 'network' && <i className="fas fa-sitemap mr-2"></i>}
            {tab === 'testing' && <i className="fas fa-vial mr-2"></i>}
            {tab === 'monitor' && <i className="fas fa-chart-line mr-2"></i>}
            {tab === 'devices'
              ? 'デバイス'
              : tab === 'network'
              ? 'ネットワーク'
              : tab === 'testing'
              ? 'テスト'
              : 'モニター'}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Zoom controls */}
        <div className="flex bg-light-sidebar dark:bg-dark-sidebar rounded-lg overflow-hidden">
          <button
            className="px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-light-card dark:hover:bg-dark-card transition-colors"
            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
            title="縮小"
          >
            <i className="fas fa-search-minus"></i>
          </button>
          <div className="px-3 py-1 text-gray-700 dark:text-gray-300 border-x border-gray-300 dark:border-gray-700">
            {Math.round(zoomLevel * 100)}%
          </div>
          <button
            className="px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-light-card dark:hover:bg-dark-card transition-colors"
            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
            title="拡大"
          >
            <i className="fas fa-search-plus"></i>
          </button>
        </div>
        {/* View mode */}
        <div className="flex bg-light-sidebar dark:bg-dark-sidebar rounded-lg overflow-hidden">
          <button
            className={`px-3 py-1 ${viewMode === 'logical' ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-light-card dark:hover:bg-dark-card'} transition-colors`}
            onClick={() => setViewMode('logical')}
            title="論理ビュー"
          >
            <i className="fas fa-project-diagram mr-1"></i>
            論理
          </button>
          <button
            className={`px-3 py-1 ${viewMode === 'physical' ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-light-card dark:hover:bg-dark-card'} transition-colors`}
            onClick={() => setViewMode('physical')}
            title="物理ビュー"
          >
            <i className="fas fa-map-marked-alt mr-1"></i>
            物理
          </button>
        </div>
        {/* Connection filters */}
        <div className="flex bg-light-sidebar dark:bg-dark-sidebar rounded-lg overflow-hidden">
          {(['all', 'ethernet', 'vpn'] as const).map(filter => (
            <button
              key={filter}
              className={`px-3 py-1 ${connectionFilter === filter ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-light-card dark:hover:bg-dark-card'} transition-colors`}
              onClick={() => setConnectionFilter(filter)}
            >
              {filter === 'all'
                ? 'すべての接続'
                : filter === 'ethernet'
                ? 'イーサネット'
                : 'VPN'}
            </button>
          ))}
        </div>
        {/* Reset button */}
        <button
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg ml-auto"
          onClick={() => {
            if (window.confirm('すべてのデバイスと接続をリセットしますか？')) {
              setDevices(initialDevices);
              setConnections(initialConnections);
              setLocations(initialLocations);
              setSelectedDevice(null);
              setSelectedConnection(null);
              setTestResults([]);
              addLog('ネットワーク環境をリセットしました');
            }
          }}
        >
          <i className="fas fa-sync-alt mr-1"></i>
          リセット
        </button>
      </div>

      {/* Main network canvas */}
      <div
        className="relative border border-gray-300 dark:border-gray-700 rounded-lg h-96 mb-6 bg-white dark:bg-gray-800 overflow-hidden"
        ref={canvasRef}
        onClick={handleCanvasClick}
        onContextMenu={e => {
          e.preventDefault();
          handleCanvasClick(e);
        }}
        onMouseDown={startPan}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        {/* Locations (only in physical view) */}
        {viewMode === 'physical' &&
          locations.map(location => (
            <div
              key={location.id}
              className="absolute rounded-lg border-2 border-dashed"
              style={{
                left: location.x + panOffset.x,
                top: location.y + panOffset.y,
                width: location.width,
                height: location.height,
                backgroundColor: location.color,
                borderColor: location.color.replace('0.1', '0.5'),
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                zIndex: 1
              }}
            >
              <div className="absolute bottom-2 left-2 text-xs font-medium bg-white dark:bg-gray-700 px-2 py-1 rounded shadow">
                {location.name}
              </div>
            </div>
          ))}

        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" ref={svgRef}>
          {connections
            .filter(conn => connectionFilter === 'all' || conn.type === connectionFilter)
            .map(connection => {
              const points = (() => {
                const fromDevice = devices.find(d => d.id === connection.from.deviceId);
                const toDevice = devices.find(d => d.id === connection.to.deviceId);
                if (!fromDevice || !toDevice) return null;
                return {
                  fromX: fromDevice.x + 25,
                  fromY: fromDevice.y + 25,
                  toX: toDevice.x + 25,
                  toY: toDevice.y + 25
                };
              })();
              if (!points) return null;
              const { fromX, fromY, toX, toY } = points;
              const isSelected = selectedConnection?.id === connection.id;
              return (
                <g key={connection.id}>
                  <line
                    x1={fromX * zoomLevel + panOffset.x * zoomLevel}
                    y1={fromY * zoomLevel + panOffset.y * zoomLevel}
                    x2={toX * zoomLevel + panOffset.x * zoomLevel}
                    y2={toY * zoomLevel + panOffset.y * zoomLevel}
                    stroke={connection.status === 'inactive' ? '#aaa' : connection.status === 'error' ? '#f00' : connection.type === 'vpn' ? '#6366F1' : '#22C55E'}
                    strokeWidth={isSelected ? 3 : 2}
                    strokeDasharray={connection.type === 'vpn' ? '5,5' : ''}
                    onClick={() => selectConnection(connection)}
                    pointerEvents="stroke"
                    className="cursor-pointer"
                  />
                  {connection.status === 'active' && (
                    <circle
                      cx={(fromX + (toX - fromX) * 0.5) * zoomLevel + panOffset.x * zoomLevel}
                      cy={(fromY + (toY - fromY) * 0.5) * zoomLevel + panOffset.y * zoomLevel}
                      r={4}
                      fill={connection.type === 'vpn' ? '#6366F1' : '#22C55E'}
                    >
                      <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <text
                    x={(fromX + (toX - fromX) * 0.5) * zoomLevel + panOffset.x * zoomLevel}
                    y={(fromY + (toY - fromY) * 0.5 - 10) * zoomLevel + panOffset.y * zoomLevel}
                    textAnchor="middle"
                    fill={connection.type === 'vpn' ? '#6366F1' : '#22C55E'}
                    fontSize={10 * zoomLevel}
                    className="pointer-events-none select-none"
                  >
                    {connection.type === 'vpn' ? 'VPN' : connection.bandwidth || 'Ethernet'}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Network devices */}
        {devices.map(device => {
          const colorClasses = getDeviceColorClasses(device);
          const bgClass = colorClasses.split(' ').slice(0, 1).join(' ');
          const textClass = colorClasses.split(' ').slice(1).join(' ');
          return (
            <div
              key={device.id}
              className={`absolute p-2 rounded-lg cursor-pointer ${selectedDevice?.id === device.id ? 'ring-2 ring-primary ring-offset-2' : ''} ${device.status === 'offline' ? 'opacity-60' : 'opacity-100'} ${
                createConnectionMode.active && createConnectionMode.source?.deviceId === device.id ? 'outline outline-2 outline-primary' : ''
              }`}
              style={{
                left: device.x + panOffset.x,
                top: device.y + panOffset.y,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                zIndex: device.zIndex
              }}
              onClick={() => {
                if (!createConnectionMode.active) selectDevice(device);
              }}
              onMouseDown={e => {
                if (!createConnectionMode.active) startDrag(device.id, e);
              }}
              onTouchStart={e => {
                if (!createConnectionMode.active) startDrag(device.id, e);
              }}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${bgClass}`}>
                  <i className={`fas ${device.icon} text-xl ${textClass}`}></i>
                </div>
                <div className="text-xs mt-1 font-medium text-gray-700 dark:text-gray-300 max-w-20 truncate text-center">
                  {device.name}
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                    device.status === 'online'
                      ? 'bg-green-500'
                      : device.status === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                ></div>
              </div>
            </div>
          );
        })}

        {/* Add device menu */}
        {devicesToAdd.isOpen && (
          <div
            className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 p-2"
            style={{
              left: devicesToAdd.position.x + panOffset.x,
              top: devicesToAdd.position.y + panOffset.y,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left'
            }}
          >
            <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400 px-2">デバイス追加</div>
            <div className="grid grid-cols-4 gap-1">
              <button
                className="flex flex-col items-center justify-center p-2 rounded hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                onClick={() => addDevice('router', devicesToAdd.position.x, devicesToAdd.position.y)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/30">
                  <i className="fas fa-network-wired text-blue-600 dark:text-blue-400"></i>
                </div>
                <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">ルーター</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-2 rounded hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                onClick={() => addDevice('switch', devicesToAdd.position.x, devicesToAdd.position.y)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-green-100 dark:bg-green-900/30">
                  <i className="fas fa-sitemap text-green-600 dark:text-green-400"></i>
                </div>
                <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">スイッチ</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-2 rounded hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                onClick={() => addDevice('server', devicesToAdd.position.x, devicesToAdd.position.y)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-purple-100 dark:bg-purple-900/30">
                  <i className="fas fa-server text-purple-600 dark:text-purple-400"></i>
                </div>
                <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">サーバー</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-2 rounded hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                onClick={() => addDevice('client', devicesToAdd.position.x, devicesToAdd.position.y)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-cyan-100 dark:bg-cyan-900/30">
                  <i className="fas fa-desktop text-cyan-600 dark:text-cyan-400"></i>
                </div>
                <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">クライアント</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-2 rounded hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                onClick={() => addDevice('firewall', devicesToAdd.position.x, devicesToAdd.position.y)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-red-100 dark:bg-red-900/30">
                  <i className="fas fa-shield-alt text-red-600 dark:text-red-400"></i>
                </div>
                <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">ファイアウォール</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-2 rounded hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                onClick={() => addDevice('vpn', devicesToAdd.position.x, devicesToAdd.position.y)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-indigo-100 dark:bg-indigo-900/30">
                  <i className="fas fa-lock text-indigo-600 dark:text-indigo-400"></i>
                </div>
                <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">VPN</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-2 rounded hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                onClick={() => addDevice('cloud', devicesToAdd.position.x, devicesToAdd.position.y)}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-sky-100 dark:bg-sky-900/30">
                  <i className="fas fa-cloud text-sky-600 dark:text-sky-400"></i>
                </div>
                <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">クラウド</span>
              </button>
              <button
                className="flex flex-col items-center justify-center p-2 rounded hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                onClick={() => setDevicesToAdd({ isOpen: false, position: { x: 0, y: 0 } })}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                  <i className="fas fa-times text-gray-600 dark:text-gray-400"></i>
                </div>
                <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">キャンセル</span>
              </button>
            </div>
          )}
      </div>

      {/* Tabs Content with improved responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left side: Properties (order-2 on mobile, order-1 on desktop) */}
        <div className="md:col-span-1 order-2 md:order-1">
          {activeTab === 'devices' && (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg bg-light-sidebar dark:bg-dark-sidebar p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {selectedDevice ? 'デバイス設定' : selectedConnection ? '接続設定' : 'デバイス一覧'}
              </h3>
              {selectedDevice ? (
                // Render selected device properties
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getDeviceColorClasses(selectedDevice)
                        .split(' ')
                        .slice(0, 1)
                        .join(' ') } mr-3`}>
                        <i className={`fas ${selectedDevice.icon} text-xl ${getDeviceColorClasses(selectedDevice)
                          .split(' ')
                          .slice(1)
                          .join(' ')}`}></i>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={selectedDevice.name}
                          onChange={(e) => updateDevice({ ...selectedDevice, name: e.target.value })}
                          className="font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary"
                        />
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {selectedDevice.type} - {selectedDevice.status}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <button
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                        onClick={() => toggleDeviceStatus(selectedDevice.id)}
                        title={selectedDevice.status === 'online' ? 'デバイスを停止' : 'デバイスを起動'}
                      >
                        <i className={`fas ${selectedDevice.status === 'online' ? 'fa-power-off' : 'fa-play'}`}></i>
                      </button>
                      <button
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
                        onClick={() => deleteDevice(selectedDevice.id)}
                        title="デバイスを削除"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                  {/* Location selection */}
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">場所</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                      value={selectedDevice.location || ''}
                      onChange={(e) => updateDevice({ ...selectedDevice, location: e.target.value || undefined })}
                    >
                      <option value="">未指定</option>
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Interfaces */}
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">インターフェース</label>
                    </div>
                    <div className="divide-y divide-gray-300 dark:divide-gray-700">
                      {selectedDevice.interfaces.map(iface => (
                        <div key={iface.id} className="py-2">
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium text-gray-900 dark:text-white flex items-center">
                              <div className={`w-3 h-3 rounded-full ${iface.status === 'up' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                              {iface.name} ({iface.type})
                            </div>
                            <button
                              className="px-2 py-1 text-xs bg-primary hover:bg-primary-dark text-white rounded"
                              onClick={() => startConnection(selectedDevice.id, iface.id)}
                            >
                              接続
                            </button>
                          </div>
                          {(iface.type === 'ethernet' || iface.type === 'vpn') && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">IPアドレス</label>
                                <input
                                  type="text"
                                  value={iface.ipAddress || ''}
                                  placeholder="192.168.1.1"
                                  onChange={(e) => {
                                    const updatedInterfaces = selectedDevice.interfaces.map(i =>
                                      i.id === iface.id ? { ...i, ipAddress: e.target.value } : i
                                    );
                                    updateDevice({ ...selectedDevice, interfaces: updatedInterfaces });
                                  }}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">サブネットマスク</label>
                                <input
                                  type="text"
                                  value={iface.subnetMask || ''}
                                  placeholder="255.255.255.0"
                                  onChange={(e) => {
                                    const updatedInterfaces = selectedDevice.interfaces.map(i =>
                                      i.id === iface.id ? { ...i, subnetMask: e.target.value } : i
                                    );
                                    updateDevice({ ...selectedDevice, interfaces: updatedInterfaces });
                                  }}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Device type specific configuration */}
                  {selectedDevice.type === 'router' && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ルーティングテーブル</label>
                      <div className="divide-y divide-gray-300 dark:divide-gray-700">
                        {(selectedDevice.config.routes || []).map((route, index) => (
                          <div key={index} className="py-2 grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={route.destination}
                              placeholder="宛先"
                              onChange={(e) => {
                                const updatedRoutes = [...(selectedDevice.config.routes || [])];
                                updatedRoutes[index] = { ...updatedRoutes[index], destination: e.target.value };
                                updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, routes: updatedRoutes } });
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                            />
                            <input
                              type="text"
                              value={route.nextHop}
                              placeholder="ネクストホップ"
                              onChange={(e) => {
                                const updatedRoutes = [...(selectedDevice.config.routes || [])];
                                updatedRoutes[index] = { ...updatedRoutes[index], nextHop: e.target.value };
                                updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, routes: updatedRoutes } });
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                            />
                            <div className="flex">
                              <input
                                type="number"
                                value={route.metric}
                                placeholder="メトリック"
                                onChange={(e) => {
                                  const updatedRoutes = [...(selectedDevice.config.routes || [])];
                                  updatedRoutes[index] = { ...updatedRoutes[index], metric: parseInt(e.target.value) || 1 };
                                  updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, routes: updatedRoutes } });
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-l dark:bg-gray-800"
                              />
                              <button
                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-r"
                                onClick={() => {
                                  const updatedRoutes = (selectedDevice.config.routes || []).filter((_, i) => i !== index);
                                  updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, routes: updatedRoutes } });
                                }}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="pt-2">
                          <button
                            className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded text-sm w-full"
                            onClick={() => {
                              const newRoute = { destination: '0.0.0.0/0', nextHop: '', metric: 1 };
                              updateDevice({
                                ...selectedDevice,
                                config: { ...selectedDevice.config, routes: [...(selectedDevice.config.routes || []), newRoute] }
                              });
                            }}
                          >
                            <i className="fas fa-plus mr-1"></i> ルート追加
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedDevice.type === 'switch' && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">VLAN</label>
                      <input
                        type="text"
                        value={selectedDevice.config.vlan || ''}
                        placeholder="1"
                        onChange={(e) => updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, vlan: e.target.value } })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  )}
                  {(selectedDevice.type === 'server' || selectedDevice.type === 'client') && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">デフォルトゲートウェイ</label>
                          <input
                            type="text"
                            value={selectedDevice.config.gateway || ''}
                            placeholder="192.168.1.1"
                            onChange={(e) => updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, gateway: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DNSサーバー</label>
                          <input
                            type="text"
                            value={(selectedDevice.config.dns || []).join(', ')}
                            placeholder="8.8.8.8, 1.1.1.1"
                            onChange={(e) => {
                              const dnsServers = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, dns: dnsServers } });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedDevice.type === 'vpn' && selectedDevice.config.vpnConfig && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">VPNタイプ</label>
                          <select
                            value={selectedDevice.config.vpnConfig.type}
                            onChange={(e) =>
                              updateDevice({
                                ...selectedDevice,
                                config: {
                                  ...selectedDevice.config,
                                  vpnConfig: {
                                    ...selectedDevice.config.vpnConfig!,
                                    type: e.target.value as 'site-to-site' | 'client-to-site'
                                  }
                                }
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                          >
                            <option value="site-to-site">サイト間VPN</option>
                            <option value="client-to-site">リモートアクセスVPN</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">暗号化方式</label>
                          <select
                            value={selectedDevice.config.vpnConfig.encryption}
                            onChange={(e) =>
                              updateDevice({
                                ...selectedDevice,
                                config: {
                                  ...selectedDevice.config,
                                  vpnConfig: {
                                    ...selectedDevice.config.vpnConfig!,
                                    encryption: e.target.value as 'aes-256' | 'aes-128' | '3des'
                                  }
                                }
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                          >
                            <option value="aes-256">AES-256</option>
                            <option value="aes-128">AES-128</option>
                            <option value="3des">3DES</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">リモートエンドポイント</label>
                          <input
                            type="text"
                            value={selectedDevice.config.vpnConfig.remoteEndpoint || ''}
                            placeholder="203.0.113.1"
                            onChange={(e) =>
                              updateDevice({
                                ...selectedDevice,
                                config: {
                                  ...selectedDevice.config,
                                  vpnConfig: { ...selectedDevice.config.vpnConfig!, remoteEndpoint: e.target.value }
                                }
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ローカルサブネット</label>
                          <input
                            type="text"
                            value={(selectedDevice.config.vpnConfig.localSubnets || []).join(', ')}
                            placeholder="192.168.1.0/24"
                            onChange={(e) => {
                              const subnets = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              updateDevice({
                                ...selectedDevice,
                                config: { ...selectedDevice.config, vpnConfig: { ...selectedDevice.config.vpnConfig!, localSubnets: subnets } }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">リモートサブネット</label>
                          <input
                            type="text"
                            value={(selectedDevice.config.vpnConfig.remoteSubnets || []).join(', ')}
                            placeholder="192.168.2.0/24"
                            onChange={(e) => {
                              const subnets = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              updateDevice({
                                ...selectedDevice,
                                config: { ...selectedDevice.config, vpnConfig: { ...selectedDevice.config.vpnConfig!, remoteSubnets: subnets } }
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedDevice.type === 'firewall' && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ファイアウォールルール</label>
                      <div className="divide-y divide-gray-300 dark:divide-gray-700">
                        {(selectedDevice.config.firewallRules || []).map(rule => (
                          <div key={rule.id} className="py-2 space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  rule.action === 'allow'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {rule.action === 'allow' ? '許可' : '拒否'}
                                </span>
                                <span className="text-sm ml-2">{rule.description || '説明なし'}</span>
                              </div>
                              <button
                                className="p-1 text-red-500"
                                onClick={() => {
                                  const updatedRules = (selectedDevice.config.firewallRules || []).filter(r => r.id !== rule.id);
                                  updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, firewallRules: updatedRules } });
                                }}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={rule.action}
                                onChange={(e) => {
                                  const updatedRules = (selectedDevice.config.firewallRules || []).map(r =>
                                    r.id === rule.id ? { ...r, action: e.target.value as 'allow' | 'deny' } : r
                                  );
                                  updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, firewallRules: updatedRules } });
                                }}
                                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                              >
                                <option value="allow">許可</option>
                                <option value="deny">拒否</option>
                              </select>
                              <select
                                value={rule.protocol}
                                onChange={(e) => {
                                  const updatedRules = (selectedDevice.config.firewallRules || []).map(r =>
                                    r.id === rule.id ? { ...r, protocol: e.target.value as 'tcp' | 'udp' | 'icmp' | 'any' } : r
                                  );
                                  updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, firewallRules: updatedRules } });
                                }}
                                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                              >
                                <option value="any">すべてのプロトコル</option>
                                <option value="tcp">TCP</option>
                                <option value="udp">UDP</option>
                                <option value="icmp">ICMP</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={rule.source}
                                placeholder="送信元 (any, IP, CIDR)"
                                onChange={(e) => {
                                  const updatedRules = (selectedDevice.config.firewallRules || []).map(r =>
                                    r.id === rule.id ? { ...r, source: e.target.value } : r
                                  );
                                  updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, firewallRules: updatedRules } });
                                }}
                                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                              />
                              <input
                                type="text"
                                value={rule.destination}
                                placeholder="宛先 (any, IP, CIDR)"
                                onChange={(e) => {
                                  const updatedRules = (selectedDevice.config.firewallRules || []).map(r =>
                                    r.id === rule.id ? { ...r, destination: e.target.value } : r
                                  );
                                  updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, firewallRules: updatedRules } });
                                }}
                                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                              />
                            </div>
                            <input
                              type="text"
                              value={rule.description || ''}
                              placeholder="ルールの説明"
                              onChange={(e) => {
                                const updatedRules = (selectedDevice.config.firewallRules || []).map(r =>
                                  r.id === rule.id ? { ...r, description: e.target.value } : r
                                );
                                updateDevice({ ...selectedDevice, config: { ...selectedDevice.config, firewallRules: updatedRules } });
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
                            />
                          </div>
                        ))}
                        <div className="pt-2">
                          <button
                            className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded text-sm w-full"
                            onClick={() => {
                              const newRule = {
                                id: `fw-${Date.now()}`,
                                action: 'allow' as const,
                                source: 'any',
                                destination: 'any',
                                protocol: 'any' as const,
                                description: ''
                              };
                              updateDevice({
                                ...selectedDevice,
                                config: {
                                  ...selectedDevice.config,
                                  firewallRules: [...(selectedDevice.config.firewallRules || []), newRule]
                                }
                              });
                            }}
                          >
                            <i className="fas fa-plus mr-1"></i> ルール追加
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {devices.map(device => (
                    <div
                      key={device.id}
                      className={`flex items-center p-2 rounded-lg cursor-pointer ${device.status === 'online' ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700 opacity-70'}`}
                      onClick={() => selectDevice(device)}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getDeviceColorClasses(device)
                        .split(' ')
                        .slice(0, 1)
                        .join(' ') } mr-3`}>
                        <i className={`fas ${device.icon} text-xl ${getDeviceColorClasses(device)
                          .split(' ')
                          .slice(1)
                          .join(' ')}`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{device.name}</h4>
                        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                          <span>{device.type}</span>
                          <span className="mx-1">•</span>
                          <span className={device.status === 'online' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {device.status === 'online' ? 'オンライン' : 'オフライン'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Details for Network, Testing, or Monitoring (order-1 on mobile, order-2 on desktop) */}
        <div className="md:col-span-2 order-1 md:order-2">
          {activeTab === 'network' && (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">ネットワークトポロジー</h3>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">論理構成図</h4>
                </div>
                <div className="min-h-64 flex items-center justify-center">
                  <p className="text-gray-600 dark:text-gray-400 italic">現在のマップはトポロジーエディタに表示されています</p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">サブネット一覧</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">サブネット</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">VLAN</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">デバイス数</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">ゲートウェイ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {(() => {
                          const subnets: { subnet: string; vlan: string; devices: number; gateway: string }[] = [];
                          devices.forEach(device => {
                            device.interfaces.forEach(iface => {
                              if (iface.ipAddress && iface.subnetMask) {
                                const subnetCidr = calculateSubnetCidr(iface.ipAddress, iface.subnetMask);
                                const existing = subnets.find(s => s.subnet === subnetCidr);
                                if (existing) {
                                  existing.devices++;
                                  if (device.type === 'router') existing.gateway = iface.ipAddress;
                                } else {
                                  subnets.push({
                                    subnet: subnetCidr,
                                    vlan: device.type === 'switch' ? device.config.vlan || '-' : '-',
                                    devices: 1,
                                    gateway: device.type === 'router' ? iface.ipAddress : '-'
                                  });
                                }
                              }
                            });
                          });
                          return subnets.map((s, i) => (
                            <tr key={i}>
                              <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{s.subnet}</td>
                              <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{s.vlan}</td>
                              <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{s.devices}</td>
                              <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{s.gateway}</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg bg-light-sidebar dark:bg-dark-sidebar p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">ネットワークテスト</h3>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">プリセットテスト</h4>
                <div className="space-y-2">
                  {predefinedTests.map(test => (
                    <button
                      key={test.id}
                      className="w-full p-2 text-left rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-light-sidebar dark:hover:bg-dark-sidebar"
                      onClick={() => runTest(test.id)}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{test.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{test.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">カスタムテスト</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">送信元デバイス</label>
                    <select id="source-device" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800">
                      <option value="">選択してください</option>
                      {devices.filter(d => d.status === 'online').map(device => (
                        <option key={device.id} value={device.id}>{device.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">宛先デバイス</label>
                    <select id="destination-device" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800">
                      <option value="">選択してください</option>
                      {devices.filter(d => d.status === 'online').map(device => (
                        <option key={device.id} value={device.id}>{device.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">テストタイプ</label>
                    <select id="test-type" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800">
                      <option value="ping">Ping</option>
                      <option value="http">HTTP</option>
                      <option value="tcp">TCP</option>
                      <option value="traceroute">Traceroute</option>
                    </select>
                  </div>
                  <button
                    className="w-full px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                    onClick={() => {
                      const sourceId = (document.getElementById('source-device') as HTMLSelectElement).value;
                      const destId = (document.getElementById('destination-device') as HTMLSelectElement).value;
                      const testType = (document.getElementById('test-type') as HTMLSelectElement).value;
                      if (!sourceId || !destId) {
                        addLog('送信元と宛先のデバイスを選択してください');
                        return;
                      }
                      runCustomTest(sourceId, destId, testType);
                    }}
                  >
                    テスト実行 {testingInProgress && '(実行中...)'}
                  </button>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-gray-700 dark:text-gray-300">使い方ガイド:</strong> このネットワークラボは、ネットワーク構成と接続のシミュレーションを提供します。右クリックでデバイスを追加し、ドラッグして配置、設定を編集してテストできます。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'monitor' && (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">ログとモニタリング</h3>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg h-96 overflow-y-auto font-mono text-xs">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 py-1">{log}</div>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 italic">ログはまだありません</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkLabSimulator;
