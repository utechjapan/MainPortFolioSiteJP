// components/network-lab/NetworkTopologyDesigner.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Line, Group, Text, Path } from 'react-konva';
import { useHotkeys } from 'react-hotkeys-hook';
import { saveAs } from 'file-saver';
import useWindowSize from '../../hooks/useWindowSize';

// Import components
import TopologyNode from './TopologyNode';
import DeviceProperties from './DeviceProperties';
import ConnectionProperties from './ConnectionProperties';
import Toolbar from './Toolbar';
import DeviceLibrary from './DeviceLibrary';
import TopologyControls from './TopologyControls';
import ExportModal from './ExportModal';
import StatusBar from './StatusBar';
import ConfirmationDialog from './ConfirmationDialog';
import NotificationSystem from './NotificationSystem';
import ManageVlansModal from './ManageVlansModal';
import SimulationControls from './SimulationControls';
import PacketVisualizer from './PacketVisualizer';
import ConsolePanel from './ConsolePanel';
import DiagramTypeSwitch from './DiagramTypeSwitch';
import ConnectionPathEditor from './ConnectionPathEditor';
import DeviceConfigModal from './DeviceConfigModal';
import ImportTemplateModal from './ImportTemplateModal';
import HelpModal from './HelpModal';

// Import types and utils
import {
  Device,
  Connection,
  DeviceType,
  Position,
  SelectionType,
  Notification,
  SimulationState,
  VlanDefinition,
  PacketJourney,
  DiagramType,
  ConnectionPathPoint,
  DeviceTemplate,
  NetworkConfig,
} from '../../types/networkTopology';
import {
  generateDeviceId,
  generateConnectionId,
  getDeviceTypeInfo,
  calculatePortPositions,
  simulateNetwork,
  createDefaultConfig,
  deviceDistance,
  getConnectedRouters,
  getSubnetFromCidr,
  verifyNetworkConnectivity,
  pingDevices,
  getDefaultDeviceConfig,
  translateErrorMessage,
  getDeviceTemplates,
  exportToCSV
} from '../../utils/networkUtils';
import { getExportTopologyAsJSON, exportToPdf } from '../../utils/exportUtils';

const NetworkTopologyDesigner: React.FC = () => {
  // Canvas state
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  
  // Network topology state
  const [devices, setDevices] = useState<Device[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [vlans, setVlans] = useState<VlanDefinition[]>([
    { id: 1, name: 'デフォルト', color: '#0077B6' }
  ]);

  // Diagram type (logical or physical)
  const [diagramType, setDiagramType] = useState<DiagramType>('logical');

  // UI state
  const [drawingConnection, setDrawingConnection] = useState<{
    from: string;
    fromPort: string;
    points: number[];
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    type: SelectionType;
    id: string;
  } | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showVlansModal, setShowVlansModal] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showDeviceConfigModal, setShowDeviceConfigModal] = useState<boolean>(false);
  const [showImportTemplateModal, setShowImportTemplateModal] = useState<boolean>(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [deviceTemplates, setDeviceTemplates] = useState<DeviceTemplate[]>(getDeviceTemplates());
  const [grid, setGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();

  // Simulation state
  const [simulationState, setSimulationState] = useState<SimulationState>('stopped');
  const [packetJourneys, setPacketJourneys] = useState<PacketJourney[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [selectedDeviceForConfig, setSelectedDeviceForConfig] = useState<Device | null>(null);

  // Update viewport dimensions
  const viewportWidth = containerRef.current?.clientWidth || width - 320; // Adjust for sidebar
  const viewportHeight = containerRef.current?.clientHeight || height - 100; // Adjust for header/footer

  // Calculate grid size based on scale
  const gridSize = 20;
  const gridScaled = gridSize * scale;

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [
      ...prev,
      {
        ...notification,
        id,
        timestamp: new Date(),
      }
    ]);
    
    // Auto-dismiss after timeout
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration || 5000);
  };

  // Add to console output
  const addToConsole = (message: string) => {
    setConsoleOutput(prev => [...prev, message]);
  };

  // Clear console
  const clearConsole = () => {
    setConsoleOutput([]);
  };

  // Handle device adding
  const handleAddDevice = (type: DeviceType, x: number, y: number, template?: DeviceTemplate) => {
    try {
      const deviceTypeInfo = getDeviceTypeInfo(type);
      const id = generateDeviceId(type);
      
      // Adjust position to grid if snapToGrid is enabled
      const adjustedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x;
      const adjustedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y;
      
      // Use template config if provided, otherwise get default
      const config = template ? template.config : getDefaultDeviceConfig(type);
      
      const portCount = template?.portCount || deviceTypeInfo.defaultPorts.length;
      
      // Generate ports based on port count
      const ports = Array(portCount).fill(null).map((_, index) => {
        const basePort = deviceTypeInfo.defaultPorts[index % deviceTypeInfo.defaultPorts.length];
        return {
          id: `${id}-port-${index}`,
          name: index < deviceTypeInfo.defaultPorts.length 
            ? basePort.name 
            : `${basePort.type}${index}`,
          type: basePort.type,
          isConnected: false,
          vlanId: basePort.type === 'ethernet' ? 1 : undefined, // Assign default VLAN to ethernet ports
        };
      });
      
      const newDevice: Device = {
        id,
        type,
        name: template ? template.name : `${deviceTypeInfo.label} ${devices.filter(d => d.type === type).length + 1}`,
        x: adjustedX,
        y: adjustedY,
        width: deviceTypeInfo.width,
        height: deviceTypeInfo.height,
        ports,
        status: 'off',
        config,
        zIndex: devices.length + 1,
      };

      setDevices([...devices, newDevice]);
      setSelectedItem({ type: 'device', id });
      
      addNotification({ 
        type: 'success', 
        message: `${deviceTypeInfo.label}を追加しました` 
      });
      
      return newDevice;
    } catch (error: any) {
      console.error('Error adding device:', error);
      addNotification({
        type: 'error',
        message: translateErrorMessage(error.message) || 'デバイスの追加に失敗しました'
      });
      return null;
    }
  };

  // Handle device selection
  const handleSelectDevice = (id: string) => {
    setSelectedItem({ type: 'device', id });
  };

  // Handle device update
  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices(devices.map(device => 
      device.id === updatedDevice.id ? updatedDevice : device
    ));
  };

  // Handle device deletion
  const handleDeleteDevice = (id: string) => {
    // Check for existing connections to this device
    const connectedConnections = connections.filter(
      conn => conn.sourceDeviceId === id || conn.targetDeviceId === id
    );

    if (connectedConnections.length > 0) {
      setConfirmationDialog({
        open: true,
        title: 'デバイスを削除',
        message: `このデバイスには${connectedConnections.length}個の接続があります。削除するとこれらの接続も削除されます。続行しますか？`,
        onConfirm: () => {
          // Delete device and its connections
          setConnections(connections.filter(
            conn => conn.sourceDeviceId !== id && conn.targetDeviceId !== id
          ));
          setDevices(devices.filter(device => device.id !== id));
          setSelectedItem(null);
          addNotification({ 
            type: 'info', 
            message: 'デバイスと接続を削除しました' 
          });
        }
      });
    } else {
      // No connections, just delete the device
      setDevices(devices.filter(device => device.id !== id));
      setSelectedItem(null);
      addNotification({ 
        type: 'info', 
        message: 'デバイスを削除しました' 
      });
    }
  };

  // Handle device configuration
  const handleConfigureDevice = (device: Device) => {
    setSelectedDeviceForConfig(device);
    setShowDeviceConfigModal(true);
  };

  // Handle device configuration save
  const handleSaveDeviceConfig = (device: Device, config: NetworkConfig) => {
    const updatedDevice = {
      ...device,
      config,
    };
    
    handleUpdateDevice(updatedDevice);
    setShowDeviceConfigModal(false);
    setSelectedDeviceForConfig(null);
    
    addNotification({
      type: 'success',
      message: `${device.name}の設定を更新しました`
    });
  };

  // Handle connection creation
  const handleStartConnection = (deviceId: string, portId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;
    
    // Calculate port position
    const portPositions = calculatePortPositions(device);
    const port = device.ports.find(p => p.id === portId);
    const portIndex = device.ports.findIndex(p => p.id === portId);
    
    if (port && !port.isConnected && portPositions[portIndex]) {
      setDrawingConnection({
        from: deviceId,
        fromPort: portId,
        points: [portPositions[portIndex].x, portPositions[portIndex].y, portPositions[portIndex].x, portPositions[portIndex].y],
      });
      
      addNotification({
        type: 'info',
        message: '接続先のポートをクリックするか、ESCを押してキャンセルしてください',
        duration: 3000,
      });
    } else if (port && port.isConnected) {
      addNotification({
        type: 'warning',
        message: 'このポートは既に接続されています'
      });
    }
  };

  // Handle ongoing connection drawing
  const handleDrawConnection = (e: any) => {
    if (!drawingConnection) return;

    const stage = stageRef.current;
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    // Adjust for stage position and scale
    const adjustedX = (point.x - position.x) / scale;
    const adjustedY = (point.y - position.y) / scale;

    setDrawingConnection({
      ...drawingConnection,
      points: [
        drawingConnection.points[0],
        drawingConnection.points[1],
        adjustedX,
        adjustedY,
      ],
    });
  };

  // Handle connection completion
  const handleEndConnection = (targetDeviceId: string, targetPortId: string) => {
    if (!drawingConnection) return;

    const sourceDevice = devices.find(d => d.id === drawingConnection.from);
    const targetDevice = devices.find(d => d.id === targetDeviceId);
    
    if (!sourceDevice || !targetDevice) {
      setDrawingConnection(null);
      return;
    }

    const sourcePort = sourceDevice.ports.find(p => p.id === drawingConnection.fromPort);
    const targetPort = targetDevice.ports.find(p => p.id === targetPortId);

    if (!sourcePort || !targetPort) {
      setDrawingConnection(null);
      return;
    }

    // Check if the port is already connected
    if (targetPort.isConnected) {
      addNotification({ 
        type: 'warning', 
        message: 'このポートは既に接続されています。利用可能なポートを選択してください。',
      });
      setDrawingConnection(null);
      return;
    }

    // Check if it's a valid connection (certain device types may have restrictions)
    const sourcePortIndex = sourceDevice.ports.findIndex(p => p.id === drawingConnection.fromPort);
    const targetPortIndex = targetDevice.ports.findIndex(p => p.id === targetPortId);
    
    if (sourcePortIndex === -1 || targetPortIndex === -1) {
      setDrawingConnection(null);
      return;
    }

    // Check port type compatibility
    if (sourcePort.type !== targetPort.type) {
      addNotification({ 
        type: 'error', 
        message: `互換性のないポートタイプ：${sourcePort.type}と${targetPort.type}を接続することはできません` 
      });
      setDrawingConnection(null);
      return;
    }

    // Create new connection
    const connectionId = generateConnectionId();
    
    // Calculate connection path points
    const sourcePortPositions = calculatePortPositions(sourceDevice);
    const targetPortPositions = calculatePortPositions(targetDevice);
    
    const sourcePos = sourcePortPositions[sourcePortIndex];
    const targetPos = targetPortPositions[targetPortIndex];
    
    if (!sourcePos || !targetPos) {
      setDrawingConnection(null);
      return;
    }
    
    // Default path points (straight line)
    const pathPoints: ConnectionPathPoint[] = [
      { x: sourcePos.x, y: sourcePos.y, type: 'endpoint' },
      { x: targetPos.x, y: targetPos.y, type: 'endpoint' }
    ];
    
    const newConnection: Connection = {
      id: connectionId,
      sourceDeviceId: drawingConnection.from,
      sourcePortId: drawingConnection.fromPort,
      targetDeviceId,
      targetPortId,
      status: 'inactive',
      type: sourcePort.type,
      bandwidth: '1 Gbps',
      latency: 1, // 1ms default latency
      pathPoints,
    };
    
    // Update port connection status
    const updatedDevices = devices.map(device => {
      if (device.id === sourceDevice.id) {
        return {
          ...device,
          ports: device.ports.map(port => 
            port.id === sourcePort.id ? { ...port, isConnected: true } : port
          )
        };
      }
      if (device.id === targetDevice.id) {
        return {
          ...device,
          ports: device.ports.map(port => 
            port.id === targetPort.id ? { ...port, isConnected: true } : port
          )
        };
      }
      return device;
    });

    setConnections([...connections, newConnection]);
    setDevices(updatedDevices);
    setDrawingConnection(null);
    setSelectedItem({ type: 'connection', id: connectionId });
    
    addNotification({ 
      type: 'success', 
      message: `${sourceDevice.name}と${targetDevice.name}の間に接続を作成しました` 
    });
  };

  // Cancel drawing connection
  const handleCancelConnection = () => {
    setDrawingConnection(null);
  };

  // Handle connection selection
  const handleSelectConnection = (id: string) => {
    setSelectedItem({ type: 'connection', id });
  };

  // Handle connection update
  const handleUpdateConnection = (updatedConnection: Connection) => {
    setConnections(connections.map(connection => 
      connection.id === updatedConnection.id ? updatedConnection : connection
    ));
  };

  // Handle connection deletion
  const handleDeleteConnection = (id: string) => {
    const connection = connections.find(c => c.id === id);
    if (!connection) return;

    // Update port connection status
    const sourceDevice = devices.find(d => d.id === connection.sourceDeviceId);
    const targetDevice = devices.find(d => d.id === connection.targetDeviceId);
    
    if (sourceDevice && targetDevice) {
      const updatedDevices = devices.map(device => {
        if (device.id === sourceDevice.id) {
          return {
            ...device,
            ports: device.ports.map(port => 
              port.id === connection.sourcePortId ? { ...port, isConnected: false } : port
            )
          };
        }
        if (device.id === targetDevice.id) {
          return {
            ...device,
            ports: device.ports.map(port => 
              port.id === connection.targetPortId ? { ...port, isConnected: false } : port
            )
          };
        }
        return device;
      });
      setDevices(updatedDevices);
    }

    setConnections(connections.filter(c => c.id !== id));
    setSelectedItem(null);
    
    addNotification({ 
      type: 'info', 
      message: '接続を削除しました' 
    });
  };

  // Handle editing connection path
  const handleEditConnectionPath = (connection: Connection) => {
    setEditingConnection(connection);
  };

  // Handle save connection path
  const handleSaveConnectionPath = (connection: Connection, pathPoints: ConnectionPathPoint[]) => {
    const updatedConnection = {
      ...connection,
      pathPoints,
    };
    
    handleUpdateConnection(updatedConnection);
    setEditingConnection(null);
    
    addNotification({
      type: 'success',
      message: '接続パスを更新しました'
    });
  };

  // Handle VLAN updates
  const handleVlansUpdate = (updatedVlans: VlanDefinition[]) => {
    setVlans(updatedVlans);
    
    // Update device ports if their VLAN was deleted
    const validVlanIds = updatedVlans.map(v => v.id);
    const updatedDevices = devices.map(device => ({
      ...device,
      ports: device.ports.map(port => {
        if (port.vlanId && !validVlanIds.includes(port.vlanId)) {
          return { ...port, vlanId: 1 }; // Reset to default VLAN
        }
        return port;
      })
    }));
    
    setDevices(updatedDevices);
    setShowVlansModal(false);
    
    addNotification({
      type: 'success',
      message: 'VLANを更新しました'
    });
  };

  // Handle canvas click
  const handleCanvasClick = (e: any) => {
    // Deselect when clicking on empty canvas
    if (e.target === e.currentTarget || e.target.nodeType === 'Stage') {
      setSelectedItem(null);
    }
  };

  // Handle importing templates
  const handleImportTemplate = () => {
    setShowImportTemplateModal(true);
  };

  // Handle importing template group
  const handleImportTemplateGroup = (templates: DeviceTemplate[], position: Position) => {
    try {
      const createdDevices: Device[] = [];
      const newConnections: Connection[] = [];
      
      // Create devices
      for (const template of templates) {
        const x = position.x + (template.relativePosition?.x || 0);
        const y = position.y + (template.relativePosition?.y || 0);
        
        const device = handleAddDevice(template.type, x, y, template);
        if (device) {
          createdDevices.push(device);
        }
      }
      
      // Create connections if specified in template
      if (templates.length > 1) {
        // In a real implementation, you would create connections based on template definitions
      }
      
      if (newConnections.length > 0) {
        setConnections([...connections, ...newConnections]);
      }
      
      setShowImportTemplateModal(false);
      
      addNotification({
        type: 'success',
        message: `${templates.length}個のデバイステンプレートをインポートしました`
      });
    } catch (error: any) {
      console.error('Error importing templates:', error);
      addNotification({
        type: 'error',
        message: translateErrorMessage(error.message) || 'テンプレートのインポートに失敗しました'
      });
    }
  };

  // Handle network simulation
  const handleStartSimulation = () => {
    // Validate network first
    const validationResult = verifyNetworkConnectivity(devices, connections);
    
    if (!validationResult.valid) {
      addNotification({
        type: 'error',
        message: `シミュレーションエラー: ${translateErrorMessage(validationResult.error || '')}`,
        duration: 7000,
      });
      return;
    }
    
    // Power on all devices
    const poweredDevices = devices.map(device => ({
      ...device,
      status: 'on' as 'on' // Explicitly cast to the allowed literal type
    }));
    setDevices(poweredDevices);
    setSimulationState('running');
    
    // Initialize connections
    const activeConnections = connections.map(conn => ({
      ...conn,
      status: 'active' as 'active' // Explicitly cast to the allowed literal type
    }));
    
    setConnections(activeConnections.map(connection => ({
      ...connection,
      status: 'active', // Ensure the status is a valid literal type
    })));
    
    addNotification({
      type: 'success',
      message: 'ネットワークシミュレーションを開始しました',
    });
    
    addToConsole('==== シミュレーション開始 ====');
    addToConsole('ネットワークデバイスを初期化しています...');
    poweredDevices.forEach(device => {
      addToConsole(`デバイス ${device.name} (${device.id}) の電源をオンにしました`);
    });
    addToConsole('すべてのデバイスの電源がオンになりました');
    
    // Run the simulation algorithm
    try {
      const simulationResult = simulateNetwork(poweredDevices, activeConnections, vlans);
      addToConsole('ネットワークトポロジーが正常に初期化されました');
      addToConsole(`${simulationResult.routes.length}個のルートを検出しました`);
      
      // Update devices with simulation results (IP addresses, etc)
      setDevices(simulationResult.devices);
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `シミュレーションエラー: ${translateErrorMessage(error.message)}`,
        duration: 7000,
      });
      addToConsole(`エラー: ${translateErrorMessage(error.message)}`);
      setSimulationState('stopped');
    }
  };

  // Handle simulation stop
  const handleStopSimulation = () => {
    setSimulationState('stopped');
    
    // Reset device status with explicit literal cast
    const resetDevices = devices.map(device => ({
      ...device,
      status: 'off' as 'off'
    }));
    
    setDevices(resetDevices);
    
    // Reset connections with explicit literal cast
    const resetConnections = connections.map(conn => ({
      ...conn,
      status: 'inactive' as 'inactive'
    }));
    
    setConnections(resetConnections);
    setPacketJourneys([]);
    
    addNotification({
      type: 'info',
      message: 'ネットワークシミュレーションを停止しました',
    });
    
    addToConsole('==== シミュレーション停止 ====');
  };

  // Handle ping test
  const handlePingTest = (sourceId: string, targetId: string) => {
    if (simulationState !== 'running') {
      addNotification({
        type: 'warning',
        message: 'Pingテストを実行するには、先にシミュレーションを開始してください',
      });
      return;
    }
    
    const sourceDevice = devices.find(d => d.id === sourceId);
    const targetDevice = devices.find(d => d.id === targetId);
    
    if (!sourceDevice || !targetDevice) {
      addNotification({
        type: 'error',
        message: '送信元または宛先デバイスが見つかりません',
      });
      return;
    }
    
    addToConsole(`PING: ${sourceDevice.name} -> ${targetDevice.name}`);
    
    try {
      const pingResult = pingDevices(sourceDevice, targetDevice, devices, connections, vlans);
      
      // Visualize packet journey
      setPacketJourneys([pingResult.journey]);
      
      if (pingResult.success) {
        addToConsole(`Ping成功: ${pingResult.stats.sent}パケット送信, ${pingResult.stats.received}パケット受信, ${pingResult.stats.latency}msレイテンシ`);
        addNotification({
          type: 'success',
          message: `Ping成功: ${pingResult.stats.latency}msレイテンシ`,
        });
      } else {
        addToConsole(`Ping失敗: ${translateErrorMessage(pingResult.error || '')}`);
        addNotification({
          type: 'error',
          message: `Ping失敗: ${translateErrorMessage(pingResult.error || '')}`,
        });
      }
    } catch (error: any) {
      addToConsole(`Pingエラー: ${translateErrorMessage(error.message)}`);
      addNotification({
        type: 'error',
        message: `Pingエラー: ${translateErrorMessage(error.message)}`,
      });
    }
  };

  // Handle export to JSON
  const handleExportToJson = () => {
    const jsonData = getExportTopologyAsJSON(devices, connections, vlans);
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    saveAs(blob, 'network-topology.json');
    
    addNotification({
      type: 'success',
      message: 'トポロジーをJSONにエクスポートしました',
    });
  };

  // Handle export to PDF
  const handleExportToPdf = async () => {
    try {
      if (!stageRef.current) return;
      
      addNotification({
        type: 'info',
        message: 'PDFを生成しています。お待ちください...',
      });
      
      // Get the Konva stage
      const stage = stageRef.current.getStage();
      const dataUrl = stage.toDataURL({ pixelRatio: 2 });
      
      // Export to PDF
      const success = await exportToPdf(devices, connections, dataUrl, diagramType === 'logical' ? '論理構成図.pdf' : '物理構成図.pdf');
      
      if (success) {
        addNotification({
          type: 'success',
          message: 'トポロジーをPDFにエクスポートしました',
        });
      } else {
        throw new Error('PDFエクスポートに失敗しました');
      }
    } catch (error: any) {
      console.error('PDF export error:', error);
      addNotification({
        type: 'error',
        message: `PDFエクスポートに失敗しました: ${translateErrorMessage(error.message)}`,
      });
    }
  };

  // Handle export to CSV
  const handleExportToCSV = () => {
    try {
      const success = exportToCSV(devices, connections, vlans, diagramType === 'logical' ? '論理構成図_設定.csv' : '物理構成図_設定.csv');
      
      if (success) {
        addNotification({
          type: 'success',
          message: 'ネットワーク設定をCSVにエクスポートしました',
        });
      } else {
        throw new Error('CSVエクスポートに失敗しました');
      }
    } catch (error: any) {
      console.error('CSV export error:', error);
      addNotification({
        type: 'error',
        message: `CSVエクスポートに失敗しました: ${translateErrorMessage(error.message)}`,
      });
    }
  };

  // Handle importing from JSON
  const handleImportTopology = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.devices || !data.connections) {
        throw new Error('無効なトポロジーデータフォーマットです');
      }
      
      // Set devices and connections from imported data
      setDevices(data.devices);
      setConnections(data.connections);
      
      // Import VLANs if available
      if (data.vlans && Array.isArray(data.vlans)) {
        setVlans(data.vlans);
      }
      
      addNotification({
        type: 'success',
        message: `${data.devices.length}個のデバイスと${data.connections.length}個の接続をインポートしました`,
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `インポートに失敗しました: ${translateErrorMessage(error.message)}`,
      });
    }
  };

  // Handle clear topology
  const handleClearTopology = () => {
    setConfirmationDialog({
      open: true,
      title: 'トポロジーをクリア',
      message: 'これによりすべてのデバイスと接続が削除されます。続行しますか？',
      onConfirm: () => {
        setDevices([]);
        setConnections([]);
        setSelectedItem(null);
        addNotification({
          type: 'info',
          message: 'トポロジーをクリアしました',
        });
      }
    });
  };

  // Handle zoom
  const handleZoom = (newScale: number) => {
    setScale(Math.min(Math.max(0.1, newScale), 3));
  };

  // Handle centering the view
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

  // Handle toggling grid
  const handleToggleGrid = () => {
    setGrid(!grid);
  };

  // Handle toggling snap to grid
  const handleToggleSnapToGrid = () => {
    setSnapToGrid(!snapToGrid);
  };

  // Handle diagram type change
  const handleDiagramTypeChange = (type: DiagramType) => {
    setDiagramType(type);
    addNotification({
      type: 'info',
      message: type === 'logical' ? '論理構成図モードに切り替えました' : '物理構成図モードに切り替えました',
      duration: 3000,
    });
  };

  // Keyboard shortcuts
  useHotkeys('delete', () => {
    if (!selectedItem) return;
    
    if (selectedItem.type === 'device') {
      handleDeleteDevice(selectedItem.id);
    } else if (selectedItem.type === 'connection') {
      handleDeleteConnection(selectedItem.id);
    }
  }, [selectedItem, devices, connections]);

  useHotkeys('escape', () => {
    if (drawingConnection) {
      handleCancelConnection();
    } else {
      setSelectedItem(null);
    }
  });

  // Render grid
  const renderGrid = () => {
    if (!grid) return null;
    
    const gridLines = [];
    const gridWidth = viewportWidth / scale;
    const gridHeight = viewportHeight / scale;
    
    // Calculate visible grid area
    const startX = Math.floor(-position.x / scale / gridSize) * gridSize;
    const startY = Math.floor(-position.y / scale / gridSize) * gridSize;
    const endX = startX + gridWidth + gridSize;
    const endY = startY + gridHeight + gridSize;
    
    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      gridLines.push(
        <Line
          key={`v-${x}`}
          points={[x, startY, x, endY]}
          stroke="#ddd"
          strokeWidth={0.5 / scale}
          opacity={0.5}
        />
      );
    }
    
    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      gridLines.push(
        <Line
          key={`h-${y}`}
          points={[startX, y, endX, y]}
          stroke="#ddd"
          strokeWidth={0.5 / scale}
          opacity={0.5}
        />
      );
    }
    
    return gridLines;
  };

  // Calculate connection points and render connections
  const renderConnections = () => {
    return connections.map(connection => {
      const sourceDevice = devices.find(d => d.id === connection.sourceDeviceId);
      const targetDevice = devices.find(d => d.id === connection.targetDeviceId);
      
      if (!sourceDevice || !targetDevice) return null;
      
      const sourcePortIndex = sourceDevice.ports.findIndex(p => p.id === connection.sourcePortId);
      const targetPortIndex = targetDevice.ports.findIndex(p => p.id === connection.targetPortId);
      
      if (sourcePortIndex === -1 || targetPortIndex === -1) return null;
      
      const sourcePortPositions = calculatePortPositions(sourceDevice);
      const targetPortPositions = calculatePortPositions(targetDevice);
      
      const sourcePos = sourcePortPositions[sourcePortIndex];
      const targetPos = targetPortPositions[targetPortIndex];
      
      if (!sourcePos || !targetPos) return null;
      
      // Determine styling/color
      let strokeColor = '#666';
      let strokeWidth = 1;
      const isSelected = selectedItem?.type === 'connection' && selectedItem.id === connection.id;
      
      if (connection.status === 'active') {
        strokeColor = '#4CAF50';
      } else if (connection.status === 'error') {
        strokeColor = '#F44336';
      }
      
      if (isSelected) {
        strokeColor = '#2196F3';
        strokeWidth = 2;
      }
      
      const isInActiveJourney = packetJourneys.some(journey => 
        journey.path.some(step => 
          (step.sourceDeviceId === connection.sourceDeviceId && step.targetDeviceId === connection.targetDeviceId) ||
          (step.sourceDeviceId === connection.targetDeviceId && step.targetDeviceId === connection.sourceDeviceId)
        )
      );
      
      if (isInActiveJourney) {
        strokeColor = '#FFC107';
        strokeWidth = 3;
      }
      
      // Build curved path using connection.pathPoints if available; otherwise fallback to straight line
      let pathData = '';
      if (connection.pathPoints && connection.pathPoints.length >= 2) {
        const start = connection.pathPoints[0];
        const end = connection.pathPoints[connection.pathPoints.length - 1];
        const cpX = (start.x + end.x) / 2;
        const cpY = (start.y + end.y) / 2;
        pathData = `M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`;
      } else {
        pathData = `M ${sourcePos.x} ${sourcePos.y} L ${targetPos.x} ${targetPos.y}`;
      }
      
      const connectionLabel = diagramType === 'logical'
        ? (connection.bandwidth || '')
        : `${sourceDevice.name} -> ${targetDevice.name}`;
      
      return (
        <React.Fragment key={connection.id}>
          <Path
            data={pathData}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            onClick={() => handleSelectConnection(connection.id)}
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
            listening={true}
          />
          {/* For fiber connections, add a dashed path as an indicator */}
          {connection.type === 'fiber' && (
            <Path
              data={pathData}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              dash={[10, 5]}
              opacity={0.7}
              listening={false}
            />
          )}
          {/* Connection label */}
          {connectionLabel && (
            <Group x={(sourcePos.x + targetPos.x) / 2} y={(sourcePos.y + targetPos.y) / 2}>
              <Text
                text={connectionLabel}
                fontSize={12 / scale}
                fill={strokeColor}
                align="center"
                verticalAlign="middle"
                offsetX={-10}
                offsetY={-10}
                padding={4}
                listening={false}
              />
            </Group>
          )}
        </React.Fragment>
      );
    });
  };

  // Render the active drawing connection
  const renderDrawingConnection = () => {
    if (!drawingConnection) return null;
    
    return (
      <Line
        points={drawingConnection.points}
        stroke="#2196F3"
        strokeWidth={2}
        dash={[5, 5]}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
      />
    );
  };

  // Handle stage drag
  const handleStageMouseDown = (e: any) => {
    // Only handle drag on empty canvas or right-click
    if (e.evt.button !== 0 || e.target !== e.currentTarget) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.evt.clientX,
      y: e.evt.clientY,
    });
  };

  const handleStageMouseMove = (e: any) => {
    // Handle drawing connection
    if (drawingConnection) {
      handleDrawConnection(e);
      return;
    }
    
    // Handle stage drag
    if (isDragging && dragStart) {
      const dx = e.evt.clientX - dragStart.x;
      const dy = e.evt.clientY - dragStart.y;
      
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      });
      
      setDragStart({
        x: e.evt.clientX,
        y: e.evt.clientY,
      });
    }
  };

  const handleStageMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // Initialize properties panel based on selected item
  const renderPropertiesPanel = () => {
    if (!selectedItem) {
      return <div className="p-4 text-gray-500">項目が選択されていません</div>;
    }
    
    if (selectedItem.type === 'device') {
      const device = devices.find(d => d.id === selectedItem.id);
      if (!device) return null;
      
      return (
        <DeviceProperties
          device={device}
          vlans={vlans}
          devices={devices}
          simulationState={simulationState}
          onUpdate={handleUpdateDevice}
          onDelete={() => handleDeleteDevice(device.id)}
          onStartConnection={handleStartConnection}
          onPingTest={handlePingTest}
          onConfigureDevice={handleConfigureDevice}
        />
      );
    }
    
    if (selectedItem.type === 'connection') {
      const connection = connections.find(c => c.id === selectedItem.id);
      if (!connection) return null;
      
      const sourceDevice = devices.find(d => d.id === connection.sourceDeviceId);
      const targetDevice = devices.find(d => d.id === connection.targetDeviceId);
      
      if (!sourceDevice || !targetDevice) return null;
      
      return (
        <ConnectionProperties
          connection={connection}
          sourceDevice={sourceDevice}
          targetDevice={targetDevice}
          onUpdate={handleUpdateConnection}
          onDelete={() => handleDeleteConnection(connection.id)}
          onEditPath={handleEditConnectionPath}
        />
      );
    }
    
    return null;
  };
  
  // Display modals for various functions
  const showExportModalDialog = showExportModal && (
    <ExportModal
      isOpen={showExportModal}
      onClose={() => setShowExportModal(false)}
      onExportJson={handleExportToJson}
      onExportPdf={handleExportToPdf}
      onExportCsv={handleExportToCSV}
    />
  );

  const showVlansModalDialog = showVlansModal && (
    <ManageVlansModal
      isOpen={showVlansModal}
      onClose={() => setShowVlansModal(false)}
      vlans={vlans}
      onUpdate={handleVlansUpdate}
    />
  );

  const showConsolePanel = showConsole && (
    <ConsolePanel
      output={consoleOutput}
      onClose={() => setShowConsole(false)}
      onClear={clearConsole}
    />
  );

  const showDeviceConfigModalDialog = showDeviceConfigModal && selectedDeviceForConfig && (
    <DeviceConfigModal
      isOpen={showDeviceConfigModal}
      device={selectedDeviceForConfig}
      onClose={() => setShowDeviceConfigModal(false)}
      onSave={handleSaveDeviceConfig}
      diagramType={diagramType}
    />
  );

  const showConnectionPathEditor = editingConnection && (
    <ConnectionPathEditor
      isOpen={!!editingConnection}
      connection={editingConnection}
      devices={devices}
      onClose={() => setEditingConnection(null)}
      onSave={handleSaveConnectionPath}
    />
  );

  const showImportTemplateModalDialog = showImportTemplateModal && (
    <ImportTemplateModal
      isOpen={showImportTemplateModal}
      templates={deviceTemplates}
      onClose={() => setShowImportTemplateModal(false)}
      onImport={handleImportTemplateGroup}
    />
  );

  const showHelpModalDialog = showHelpModal && (
    <HelpModal
      isOpen={showHelpModal}
      onClose={() => setShowHelpModal(false)}
    />
  );

  const showConfirmationDialog = confirmationDialog.open && (
    <ConfirmationDialog
      isOpen={confirmationDialog.open}
      title={confirmationDialog.title}
      message={confirmationDialog.message}
      onConfirm={() => {
        confirmationDialog.onConfirm();
        setConfirmationDialog(prev => ({ ...prev, open: false }));
      }}
      onCancel={() => setConfirmationDialog(prev => ({ ...prev, open: false }))}
    />
  );

  function handleMoveDevice(id: string, x: number, y: number): void {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id
          ? {
              ...device,
              x: snapToGrid ? Math.round(x / gridSize) * gridSize : x,
              y: snapToGrid ? Math.round(y / gridSize) * gridSize : y,
            }
          : device
      )
    );
  }

  function handleDragEnd(e: any, device: Device): void {
    const stage = stageRef.current;
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Adjust for stage position and scale
    const adjustedX = (pointerPosition.x - position.x) / scale;
    const adjustedY = (pointerPosition.y - position.y) / scale;

    // Update the device's position
    setDevices((prevDevices) =>
      prevDevices.map((d) =>
        d.id === device.id
          ? {
              ...d,
              x: snapToGrid ? Math.round(adjustedX / gridSize) * gridSize : adjustedX,
              y: snapToGrid ? Math.round(adjustedY / gridSize) * gridSize : adjustedY,
            }
          : d
      )
    );
  }

  return (
    <div className="h-full flex" ref={containerRef}>
      {/* Device Library */}
      <DeviceLibrary onAddDevice={handleAddDevice} diagramType={diagramType} />
      
      {/* Main canvas */}
      <div className="relative flex-1 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {/* Diagram type switch */}
        <DiagramTypeSwitch diagramType={diagramType} onChange={handleDiagramTypeChange} />
        
        {/* Toolbar */}
        <Toolbar
          onExport={() => setShowExportModal(true)}
          onClear={handleClearTopology}
          onImport={handleImportTopology}
          onImportTemplate={handleImportTemplate}
          onManageVlans={() => setShowVlansModal(true)}
          onHelp={() => setShowHelpModal(true)}
          simulationState={simulationState}
          onStartSimulation={handleStartSimulation}
          onStopSimulation={handleStopSimulation}
          onToggleConsole={() => setShowConsole(!showConsole)}
        />
        
        {/* Canvas controls */}
        <TopologyControls
          scale={scale}
          onZoomIn={() => handleZoom(scale + 0.1)}
          onZoomOut={() => handleZoom(scale - 0.1)}
          onZoomReset={() => handleZoom(1)}
          onCenterView={handleCenterView}
          onToggleGrid={handleToggleGrid}
          grid={grid}
          onToggleSnapToGrid={handleToggleSnapToGrid}
          snapToGrid={snapToGrid}
        />
        
        {/* Status bar */}
        <StatusBar
          deviceCount={devices.length}
          connectionCount={connections.length}
          scale={scale}
          position={position}
          simulationState={simulationState}
          diagramType={diagramType}
        />
        
        {/* Stage */}
        <Stage
          width={viewportWidth}
          height={viewportHeight}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          ref={stageRef}
          onClick={handleCanvasClick}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
        >
          <Layer>
            {/* Grid */}
            {grid && renderGrid()}
            
            {/* Connections */}
            {renderConnections()}
            
            {/* Active drawing connection */}
            {drawingConnection && renderDrawingConnection()}
            
            {/* Devices */}
            {devices.map(device => (
              <TopologyNode
              key={device.id}
              device={device}
              isSelected={selectedItem?.type === 'device' && selectedItem.id === device.id}
              onSelect={() => handleSelectDevice(device.id)}
              onMove={(x, y) => handleMoveDevice(device.id, x, y)} // ✅ added this line
              onDragEnd={(e: any) => handleDragEnd(e, device)}
              onPortClick={(portId) => {
                if (drawingConnection) {
                  handleEndConnection(device.id, portId);
                } else {
                  handleStartConnection(device.id, portId);
                }
              }}
              vlans={vlans}
              diagramType={diagramType}
            />
            
            ))}
            
            {/* Packet journey visualization */}
            {simulationState === 'running' && (
              <PacketVisualizer
                journeys={packetJourneys}
                devices={devices}
                connections={connections}
                scale={scale}
              />
            )}
          </Layer>
        </Stage>
        
        {/* Simulation controls */}
        <SimulationControls
          simulationState={simulationState}
          onStartSimulation={handleStartSimulation}
          onStopSimulation={handleStopSimulation}
          onToggleConsole={() => setShowConsole(!showConsole)}
        />
        
        {/* Right properties panel */}
        <div className="absolute top-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-auto h-[calc(100vh-160px)] z-10">
          {renderPropertiesPanel()}
        </div>
        
        {/* Notification system */}
        <NotificationSystem notifications={notifications} />
        
        {/* Modals */}
        {showExportModalDialog}
        {showVlansModalDialog}
        {showConsolePanel}
        {showDeviceConfigModalDialog}
        {showConnectionPathEditor}
        {showImportTemplateModalDialog}
        {showHelpModalDialog}
        {showConfirmationDialog}
      </div>
    </div>
  );
};

export default NetworkTopologyDesigner;