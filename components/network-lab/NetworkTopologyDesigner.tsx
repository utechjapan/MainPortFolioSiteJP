// components/network-lab/NetworkTopologyDesigner.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useHotkeys } from 'react-hotkeys-hook';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
    { id: 1, name: 'Default', color: '#0077B6' }
  ]);

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
  const [grid, setGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();

  // Simulation state
  const [simulationState, setSimulationState] = useState<SimulationState>('stopped');
  const [packetJourneys, setPacketJourneys] = useState<PacketJourney[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

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
    if (notification.type === 'error' || notification.type === 'warning') {
      console.error(notification.message);
    }
    
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
  const handleAddDevice = (type: DeviceType, x: number, y: number) => {
    const deviceTypeInfo = getDeviceTypeInfo(type);
    const id = generateDeviceId(type);
    
    // Adjust position to grid if snapToGrid is enabled
    const adjustedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x;
    const adjustedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y;
    
    const config = getDefaultDeviceConfig(type);
    
    const newDevice: Device = {
      id,
      type,
      name: `${deviceTypeInfo.label} ${devices.filter(d => d.type === type).length + 1}`,
      x: adjustedX,
      y: adjustedY,
      width: deviceTypeInfo.width,
      height: deviceTypeInfo.height,
      ports: deviceTypeInfo.defaultPorts.map((port, index) => ({
        id: `${id}-port-${index}`,
        name: port.name,
        type: port.type,
        isConnected: false,
        vlanId: port.type === 'ethernet' ? 1 : undefined, // Assign default VLAN to ethernet ports
      })),
      status: 'off',
      config,
    };

    setDevices([...devices, newDevice]);
    setSelectedItem({ type: 'device', id });
    addNotification({ 
      type: 'success', 
      message: `Added new ${deviceTypeInfo.label}` 
    });
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
        title: 'Delete Device',
        message: `This device has ${connectedConnections.length} connections. Deleting it will also remove these connections. Proceed?`,
        onConfirm: () => {
          // Delete device and its connections
          setConnections(connections.filter(
            conn => conn.sourceDeviceId !== id && conn.targetDeviceId !== id
          ));
          setDevices(devices.filter(device => device.id !== id));
          setSelectedItem(null);
          addNotification({ 
            type: 'info', 
            message: 'Device and its connections deleted' 
          });
        }
      });
    } else {
      // No connections, just delete the device
      setDevices(devices.filter(device => device.id !== id));
      setSelectedItem(null);
      addNotification({ 
        type: 'info', 
        message: 'Device deleted' 
      });
    }
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
        message: 'This port is already connected. Please select an available port.',
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
        message: `Incompatible port types: ${sourcePort.type} and ${targetPort.type}` 
      });
      setDrawingConnection(null);
      return;
    }

    // Create new connection
    const connectionId = generateConnectionId();
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
      message: `Connection created between ${sourceDevice.name} and ${targetDevice.name}` 
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
      message: 'Connection deleted' 
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
  };

  // Handle canvas click
  const handleCanvasClick = (e: any) => {
    // Deselect when clicking on empty canvas
    if (e.target === e.currentTarget || e.target.nodeType === 'Stage') {
      setSelectedItem(null);
    }
  };

  // Handle network simulation
  const handleStartSimulation = () => {
    // Validate network first
    const validationResult = verifyNetworkConnectivity(devices, connections);
    
    if (!validationResult.valid) {
      addNotification({
        type: 'error',
        message: `Simulation error: ${validationResult.error}`,
        duration: 7000,
      });
      return;
    }
    
    // Power on all devices
    const poweredDevices = devices.map(device => ({
      ...device,
      status: 'on' as const
    }));
    
    setDevices(poweredDevices);
    setSimulationState('running');
    
    // Initialize connections
    const activeConnections = connections.map(conn => ({
      ...conn,
      status: 'active' as const
    }));
    
    setConnections(activeConnections);
    
    addNotification({
      type: 'success',
      message: 'Network simulation started',
    });
    
    addToConsole('==== SIMULATION STARTED ====');
    addToConsole('Initializing network devices...');
    poweredDevices.forEach(device => {
      addToConsole(`Device ${device.name} (${device.id}) powered on`);
    });
    addToConsole('All devices powered on successfully');
    
    // Run the simulation algorithm
    try {
      const simulationResult = simulateNetwork(poweredDevices, activeConnections, vlans);
      addToConsole('Network topology successfully initialized');
      addToConsole(`Discovered ${simulationResult.routes.length} routes`);
      
      // Update devices with simulation results (IP addresses, etc)
      setDevices(simulationResult.devices);
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Simulation error: ${(error as Error).message}`,
        duration: 7000,
      });
      addToConsole(`ERROR: ${(error as Error).message}`);
      setSimulationState('stopped');
    }
  };

  // Handle simulation stop
  const handleStopSimulation = () => {
    setSimulationState('stopped');
    
    // Reset device status
    const resetDevices = devices.map(device => ({
      ...device,
      status: 'off' as const
    }));
    
    setDevices(resetDevices);
    
    // Reset connections
    const resetConnections = connections.map(conn => ({
      ...conn,
      status: 'inactive' as const
    }));
    
    setConnections(resetConnections);
    setPacketJourneys([]);
    
    addNotification({
      type: 'info',
      message: 'Network simulation stopped',
    });
    
    addToConsole('==== SIMULATION STOPPED ====');
  };

  // Handle ping test
  const handlePingTest = (sourceId: string, targetId: string) => {
    if (simulationState !== 'running') {
      addNotification({
        type: 'warning',
        message: 'Start the simulation first to run ping tests',
      });
      return;
    }
    
    const sourceDevice = devices.find(d => d.id === sourceId);
    const targetDevice = devices.find(d => d.id === targetId);
    
    if (!sourceDevice || !targetDevice) {
      addNotification({
        type: 'error',
        message: 'Source or target device not found',
      });
      return;
    }
    
    addToConsole(`PING: ${sourceDevice.name} -> ${targetDevice.name}`);
    
    try {
      const pingResult = pingDevices(sourceDevice, targetDevice, devices, connections, vlans);
      
      // Visualize packet journey
      setPacketJourneys([pingResult.journey]);
      
      if (pingResult.success) {
        addToConsole(`Ping successful: ${pingResult.stats.sent} packets transmitted, ${pingResult.stats.received} received, ${pingResult.stats.latency}ms latency`);
        addNotification({
          type: 'success',
          message: `Ping successful: ${pingResult.stats.latency}ms latency`,
        });
      } else {
        addToConsole(`Ping failed: ${pingResult.error}`);
        addNotification({
          type: 'error',
          message: `Ping failed: ${pingResult.error}`,
        });
      }
    } catch (error) {
      addToConsole(`Ping error: ${(error as Error).message}`);
      addNotification({
        type: 'error',
        message: `Ping error: ${(error as Error).message}`,
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
      message: 'Topology exported to JSON',
    });
  };

  // Handle export to PDF
  const handleExportToPdf = async () => {
    try {
      if (!stageRef.current) return;
      
      addNotification({
        type: 'info',
        message: 'Generating PDF. Please wait...',
      });
      
      // Hide the UI elements that shouldn't be in the export
      const stage = stageRef.current.getStage();
      const dataUrl = stage.toDataURL({ pixelRatio: 2 });
      
      // Create PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      // Add title
      doc.setFontSize(18);
      doc.text('Network Topology Diagram', 14, 22);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      
      // Add image
      const imgWidth = doc.internal.pageSize.getWidth() - 28;
      const imgHeight = (stage.height() * imgWidth) / stage.width();
      doc.addImage(dataUrl, 'PNG', 14, 35, imgWidth, imgHeight);
      
      // Add device inventory
      const deviceYPos = imgHeight + 45;
      doc.setFontSize(14);
      doc.text('Device Inventory', 14, deviceYPos);
      
      doc.setFontSize(10);
      let yPos = deviceYPos + 10;
      devices.forEach((device, index) => {
        doc.text(`${index + 1}. ${device.name} (${device.type})`, 14, yPos);
        yPos += 5;
      });
      
      // Save PDF
      doc.save('network-topology.pdf');
      
      addNotification({
        type: 'success',
        message: 'Topology exported to PDF',
      });
    } catch (error) {
      console.error('PDF export error:', error);
      addNotification({
        type: 'error',
        message: `PDF export failed: ${(error as Error).message}`,
      });
    }
  };

  // Handle clear topology
  const handleClearTopology = () => {
    setConfirmationDialog({
      open: true,
      title: 'Clear Topology',
      message: 'This will delete all devices and connections. Are you sure?',
      onConfirm: () => {
        setDevices([]);
        setConnections([]);
        setSelectedItem(null);
        addNotification({
          type: 'info',
          message: 'Topology cleared',
        });
      }
    });
  };

  // Handle import topology
  const handleImportTopology = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (!data.devices || !data.connections) {
        throw new Error('Invalid topology data format');
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
        message: `Imported topology with ${data.devices.length} devices and ${data.connections.length} connections`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Import failed: ${(error as Error).message}`,
      });
    }
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

  // Keyboard shortcuts
  useHotkeys('delete', () => {
    if (!selectedItem) return;
    
    if (selectedItem.type === 'device') {
      handleDeleteDevice(selectedItem.id);
    } else if (selectedItem.type === 'connection') {
      handleDeleteConnection(selectedItem.id);
    }
  }, [selectedItem, devices, connections]);

  useHotkeys('ctrl+z', () => {
    // Implement undo logic here
  });

  useHotkeys('ctrl+y', () => {
    // Implement redo logic here
  });

  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    handleExportToJson();
  });

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
      
      // Determine connection color based on status and selection
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
      
      // Determine if this connection is part of a packet journey
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
      
      // Calculate center point of the line for possible label
      const centerX = (sourcePos.x + targetPos.x) / 2;
      const centerY = (sourcePos.y + targetPos.y) / 2;
      
      return (
        <React.Fragment key={connection.id}>
          <Line
            points={[sourcePos.x, sourcePos.y, targetPos.x, targetPos.y]}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            onClick={() => handleSelectConnection(connection.id)}
            hitStrokeWidth={10} // Make it easier to click
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
            listening={true}
          />
          {/* Connection type indicator (optional) */}
          {connection.type === 'fiber' && (
            <Line
              points={[sourcePos.x, sourcePos.y, targetPos.x, targetPos.y]}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              dash={[10, 5]}
              opacity={0.7}
              listening={false}
            />
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
      return <div className="p-4 text-gray-500">No item selected</div>;
    }
    
    if (selectedItem.type === 'device') {
      const device = devices.find(d => d.id === selectedItem.id);
      if (!device) return null;
      
      return (
        <DeviceProperties
          device={device}
          vlans={vlans}
          onUpdate={handleUpdateDevice}
          onDelete={() => handleDeleteDevice(device.id)}
          onStartConnection={handleStartConnection}
          simulationState={simulationState}
          devices={devices}
          onPingTest={handlePingTest}
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
        />
      );
    }
    
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top toolbar */}
      <Toolbar
        onExport={() => setShowExportModal(true)}
        onClear={handleClearTopology}
        onImport={handleImportTopology}
        onManageVlans={() => setShowVlansModal(true)}
        simulationState={simulationState}
        onStartSimulation={handleStartSimulation}
        onStopSimulation={handleStopSimulation}
        onToggleConsole={() => setShowConsole(!showConsole)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Device library sidebar */}
        <DeviceLibrary onAddDevice={handleAddDevice} />
        
        {/* Main canvas area */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden border-l border-r border-gray-300 dark:border-gray-700"
          onMouseUp={handleStageMouseUp}
        >
          {/* Stage controls */}
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
          
          {/* Konva stage */}
          <Stage
            ref={stageRef}
            width={viewportWidth}
            height={viewportHeight}
            x={position.x}
            y={position.y}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
            onClick={handleCanvasClick}
            draggable={false}
            perfectDrawEnabled={false}
          >
            <Layer>
              {/* Grid */}
              {renderGrid()}
              
              {/* Connections */}
              {renderConnections()}
              
              {/* Drawing connection (if active) */}
              {renderDrawingConnection()}
              
              {/* Devices */}
              {devices.map(device => (
                <TopologyNode
                  key={device.id}
                  device={device}
                  isSelected={selectedItem?.type === 'device' && selectedItem.id === device.id}
                  onSelect={() => handleSelectDevice(device.id)}
                  onMove={(newX, newY) => {
                    // Adjust position to grid if snapToGrid is enabled
                    const adjustedX = snapToGrid ? Math.round(newX / gridSize) * gridSize : newX;
                    const adjustedY = snapToGrid ? Math.round(newY / gridSize) * gridSize : newY;
                    
                    handleUpdateDevice({
                      ...device,
                      x: adjustedX,
                      y: adjustedY,
                    });
                  }}
                  onPortClick={(portId) => {
                    if (drawingConnection) {
                      handleEndConnection(device.id, portId);
                    } else {
                      handleStartConnection(device.id, portId);
                    }
                  }}
                  vlans={vlans}
                />
              ))}
              
              {/* Packet Visualizer */}
              <PacketVisualizer
                journeys={packetJourneys}
                devices={devices}
                connections={connections}
              />
            </Layer>
          </Stage>
          
          {/* Status bar */}
          <StatusBar
            deviceCount={devices.length}
            connectionCount={connections.length}
            scale={scale}
            position={position}
            simulationState={simulationState}
          />
        </div>
        
        {/* Properties panel */}
        <div className="w-64 bg-white dark:bg-gray-800 overflow-y-auto border-l border-gray-300 dark:border-gray-700 flex flex-col">
          <div className="p-2 bg-gray-200 dark:bg-gray-700 font-semibold">
            Properties
          </div>
          <div className="flex-1 overflow-y-auto">
            {renderPropertiesPanel()}
          </div>
        </div>
      </div>
      
      {/* Console panel */}
      {showConsole && (
        <ConsolePanel
          output={consoleOutput}
          onClose={() => setShowConsole(false)}
          onClear={clearConsole}
        />
      )}
      
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExportJson={handleExportToJson}
        onExportPdf={handleExportToPdf}
      />
      
      {/* VLAN Management Modal */}
      <ManageVlansModal
        isOpen={showVlansModal}
        onClose={() => setShowVlansModal(false)}
        vlans={vlans}
        onUpdate={handleVlansUpdate}
      />
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialog.open}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        onConfirm={() => {
          confirmationDialog.onConfirm();
          setConfirmationDialog({ ...confirmationDialog, open: false });
        }}
        onCancel={() => setConfirmationDialog({ ...confirmationDialog, open: false })}
      />
      
      {/* Notification System */}
      <NotificationSystem notifications={notifications} />
    </div>
  );
};

export default NetworkTopologyDesigner;