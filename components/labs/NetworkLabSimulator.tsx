// components/labs/NetworkLabSimulator.tsx
import React, { useState, useEffect, useRef } from 'react';

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

// Dummy initial states (replace with your actual data)
const initialDevices: NetworkDevice[] = [
  {
    id: '1',
    type: 'router',
    name: 'Edge Router',
    x: 400,
    y: 100,
    location: 'tokyo-office',
    interfaces: [
      { id: '1-1', name: 'eth0', type: 'ethernet', ipAddress: '203.0.113.1', subnetMask: '255.255.255.0', status: 'up' },
    ],
    config: { routes: [], firewallRules: [] },
    status: 'online',
    icon: 'fa-network-wired',
    zIndex: 10,
    isDragging: false,
  }
];
const initialConnections: Connection[] = [];
const initialLocations: Location[] = [];
const predefinedTests: any[] = [];

// Fix 2: Subnet CIDR calculation function
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

// Fix 1: Dynamic Tailwind classes helper
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
    case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    case 'green': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
    case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
    case 'cyan': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400';
    case 'red': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
    case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
    case 'sky': return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400';
    default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
  }
};

const NetworkLabSimulator: React.FC = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>(initialDevices);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [createConnectionMode, setCreateConnectionMode] = useState<{ active: boolean; source?: { deviceId: string; interfaceId: string } }>({ active: false });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [testingInProgress, setTestingInProgress] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    addLog('ネットワークラボが初期化されました。');
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  const selectDevice = (device: NetworkDevice | null) => {
    setSelectedDevice(device);
    setSelectedConnection(null);
    if (device) addLog(`デバイス選択: ${device.name}`);
  };

  const selectConnection = (connection: Connection | null) => {
    setSelectedConnection(connection);
    setSelectedDevice(null);
    if (connection) {
      addLog(`接続選択: ${connection.from.deviceId} から ${connection.to.deviceId}`);
    }
  };

  // Fix 3 and 4: Drag handler with touch passive:false and state updater
  const startDrag = (deviceId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (e.nativeEvent instanceof TouchEvent) e.preventDefault();
    let clientX = e instanceof React.MouseEvent ? e.clientX : e.touches[0].clientX;
    let clientY = e instanceof React.MouseEvent ? e.clientY : e.touches[0].clientY;

    setDevices(prev =>
      prev.map(device =>
        device.id === deviceId ? { ...device, isDragging: true, zIndex: Math.max(...prev.map(d => d.zIndex)) + 1 } : device
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
      clientX = moveClientX;
      clientY = moveClientY;
    };

    const handleEnd = () => {
      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId ? { ...device, isDragging: false } : device
        )
      );
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
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
    selectDevice(null);
    selectConnection(null);
  };

  // (Other functions such as checkRouting, checkFirewall, simulateNetworkTest would be here)

  // For brevity, we render a placeholder simulator
  return (
    <div className="bg-light-card dark:bg-dark-card p-4 md:p-6 rounded-lg shadow-lg mb-8" ref={canvasRef} onClick={handleCanvasClick} onMouseDown={startPan}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">ネットワーク設定ラボ</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">ここにネットワークシミュレーションのコンテンツが表示されます。</p>
      <div className="mt-4">
        {logs.map((log, i) => (
          <div key={i} className="text-xs">{log}</div>
        ))}
      </div>
    </div>
  );
};

export default NetworkLabSimulator;
