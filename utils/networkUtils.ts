// utils/networkUtils.ts
import {
    Device,
    DeviceType,
    Connection,
    VlanDefinition,
    Position,
    Port,
    PacketJourney,
    PingResult,
    DeviceConfig,
    Route,
  } from '../types/networkTopology';
  
  // Generate unique device ID
  export const generateDeviceId = (type: DeviceType): string => {
    return `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
  
  // Generate unique connection ID
  export const generateConnectionId = (): string => {
    return `conn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
  
  // Device type information
  interface DeviceTypeInfo {
    label: string;
    icon: string;
    iconColor?: string;
    fill?: string;
    stroke?: string;
    width: number;
    height: number;
    defaultPorts: Array<Omit<Port, 'id' | 'isConnected'>>;
    description?: string;
  }
  
  // Get device type info
  export const getDeviceTypeInfo = (type: DeviceType): DeviceTypeInfo => {
    switch (type) {
      case 'router':
        return {
          label: 'Router',
          icon: '',
          iconColor: '#2563EB',
          fill: '#E6F0FF',
          stroke: '#2563EB',
          width: 100,
          height: 80,
          defaultPorts: [
            { name: 'G0/0', type: 'ethernet' },
            { name: 'G0/1', type: 'ethernet' },
            { name: 'G0/2', type: 'ethernet' },
            { name: 'G0/3', type: 'ethernet' },
            { name: 'Console', type: 'console' },
          ],
          description: 'Network router for connecting different segments',
        };
      case 'switch':
        return {
          label: 'Switch',
          icon: '',
          iconColor: '#059669',
          fill: '#ECFDF5',
          stroke: '#059669',
          width: 100,
          height: 80,
          defaultPorts: [
            { name: 'Fa0/1', type: 'ethernet' },
            { name: 'Fa0/2', type: 'ethernet' },
            { name: 'Fa0/3', type: 'ethernet' },
            { name: 'Fa0/4', type: 'ethernet' },
            { name: 'Fa0/5', type: 'ethernet' },
            { name: 'Fa0/6', type: 'ethernet' },
            { name: 'Fa0/7', type: 'ethernet' },
            { name: 'Fa0/8', type: 'ethernet' },
            { name: 'Console', type: 'console' },
          ],
          description: 'Layer 2 switch for connecting devices',
        };
      case 'server':
        return {
          label: 'Server',
          icon: '',
          iconColor: '#7C3AED',
          fill: '#F5F3FF',
          stroke: '#7C3AED',
          width: 80,
          height: 80,
          defaultPorts: [
            { name: 'eth0', type: 'ethernet' },
            { name: 'eth1', type: 'ethernet' },
          ],
          description: 'Server computer for hosting services',
        };
      case 'workstation':
        return {
          label: 'Workstation',
          icon: '',
          iconColor: '#0891B2',
          fill: '#ECFEFF',
          stroke: '#0891B2',
          width: 80,
          height: 60,
          defaultPorts: [
            { name: 'eth0', type: 'ethernet' },
          ],
          description: 'Client computer for users',
        };
      case 'firewall':
        return {
          label: 'Firewall',
          icon: '',
          iconColor: '#DC2626',
          fill: '#FEF2F2',
          stroke: '#DC2626',
          width: 90,
          height: 80,
          defaultPorts: [
            { name: 'WAN', type: 'ethernet' },
            { name: 'LAN1', type: 'ethernet' },
            { name: 'LAN2', type: 'ethernet' },
            { name: 'DMZ', type: 'ethernet' },
            { name: 'Console', type: 'console' },
          ],
          description: 'Security device for filtering traffic',
        };
      default:
        return {
          label: type,
          icon: '',
          width: 80,
          height: 80,
          defaultPorts: [
            { name: 'Port 1', type: 'ethernet' },
          ],
        };
    }
  };
  
  // Get default configuration for a device based on its type
  export const getDefaultDeviceConfig = (type: DeviceType): DeviceConfig => {
    switch (type) {
      case 'router':
        return {
          hostname: 'Router',
          interfaces: [
            { ipAddress: '192.168.1.1', subnetMask: '255.255.255.0' },
            { ipAddress: '', subnetMask: '' },
          ],
          routes: [
            { destination: '0.0.0.0/0', nextHop: '', metric: 1 },
          ],
          nat: true,
          dhcp: true,
        };
      case 'switch':
        return {
          hostname: 'Switch',
          vlan: '1',
        };
      case 'server':
        return {
          hostname: 'Server',
          interfaces: [
            { ipAddress: '192.168.1.10', subnetMask: '255.255.255.0' },
          ],
          gateway: '192.168.1.1',
          dns: ['8.8.8.8', '8.8.4.4'],
        };
      case 'workstation':
        return {
          hostname: 'Workstation',
          interfaces: [
            { ipAddress: '', subnetMask: '' }, // Empty for DHCP by default
          ],
          dhcp: true,
        };
      case 'firewall':
        return {
          hostname: 'Firewall',
          interfaces: [
            { ipAddress: '203.0.113.1', subnetMask: '255.255.255.0' }, // WAN
            { ipAddress: '192.168.1.1', subnetMask: '255.255.255.0' }, // LAN1
          ],
          firewallRules: [
            {
              id: 'rule1',
              name: 'Allow Outbound',
              sourceIp: '192.168.1.0/24',
              destinationIp: 'any',
              protocol: 'any',
              action: 'allow',
            },
          ],
          nat: true,
          dhcp: true,
        };
      default:
        return {};
    }
  };
  
  // Create default configuration for a topology device
  export const createDefaultConfig = (device: Device): DeviceConfig => {
    return getDefaultDeviceConfig(device.type);
  };
  
  // Calculate positions for ports
  export interface PortPosition extends Position {
    side: 'top' | 'right' | 'bottom' | 'left';
  }
  
  export const calculatePortPositions = (device: Device): PortPosition[] => {
    const positions: PortPosition[] = [];
    const { ports, x, y, width, height } = device;
    
    if (!ports || ports.length === 0) return positions;
    
    // Distribute ports evenly around the device
    const numPorts = ports.length;
    
    // Decide how many ports on each side based on the total number
    let portsPerSide: { top: number; right: number; bottom: number; left: number };
    
    if (numPorts <= 4) {
      // 1-4 ports: 1 on each side
      portsPerSide = {
        top: Math.min(1, numPorts),
        right: Math.min(1, numPorts - 1),
        bottom: Math.min(1, numPorts - 2),
        left: Math.min(1, numPorts - 3),
      };
    } else if (numPorts <= 8) {
      // 5-8 ports: 2 on each side
      portsPerSide = {
        top: Math.min(2, numPorts),
        right: Math.min(2, numPorts - 2),
        bottom: Math.min(2, numPorts - 4),
        left: Math.min(2, numPorts - 6),
      };
    } else {
      // More than 8 ports: distribute evenly
      const perSide = Math.ceil(numPorts / 4);
      portsPerSide = {
        top: Math.min(perSide, numPorts),
        right: Math.min(perSide, numPorts - portsPerSide.top),
        bottom: Math.min(perSide, numPorts - portsPerSide.top - portsPerSide.right),
        left: Math.min(perSide, numPorts - portsPerSide.top - portsPerSide.right - portsPerSide.bottom),
      };
    }
    
    let portIndex = 0;
  
    // Top side - Special case for console port
    if (portsPerSide.top > 0) {
      const consolePortIndex = ports.findIndex(port => port.type === 'console');
      
      if (consolePortIndex !== -1 && consolePortIndex < portsPerSide.top) {
        // Put console port in the center top
        positions[consolePortIndex] = {
          x: x + width / 2,
          y: y,
          side: 'top',
        };
        
        // Skip the console port index when placing the rest
        const remainingTopPorts = portsPerSide.top - 1;
        if (remainingTopPorts > 0) {
          const spacing = width / (remainingTopPorts + 1);
          
          for (let i = 0; i < portsPerSide.top; i++) {
            if (portIndex !== consolePortIndex) {
              positions[portIndex] = {
                x: x + (i + 1) * spacing,
                y: y,
                side: 'top',
              };
            }
            portIndex++;
          }
        }
      } else {
        // Normal distribution
        const spacing = width / (portsPerSide.top + 1);
        
        for (let i = 0; i < portsPerSide.top; i++) {
          positions[portIndex] = {
            x: x + (i + 1) * spacing,
            y: y,
            side: 'top',
          };
          portIndex++;
        }
      }
    }
    
    // Right side
    if (portsPerSide.right > 0) {
      const spacing = height / (portsPerSide.right + 1);
      
      for (let i = 0; i < portsPerSide.right; i++) {
        positions[portIndex] = {
          x: x + width,
          y: y + (i + 1) * spacing,
          side: 'right',
        };
        portIndex++;
      }
    }
    
    // Bottom side
    if (portsPerSide.bottom > 0) {
      const spacing = width / (portsPerSide.bottom + 1);
      
      for (let i = 0; i < portsPerSide.bottom; i++) {
        positions[portIndex] = {
          x: x + width - (i + 1) * spacing,
          y: y + height,
          side: 'bottom',
        };
        portIndex++;
      }
    }
    
    // Left side
    if (portsPerSide.left > 0) {
      const spacing = height / (portsPerSide.left + 1);
      
      for (let i = 0; i < portsPerSide.left; i++) {
        positions[portIndex] = {
          x: x,
          y: y + height - (i + 1) * spacing,
          side: 'left',
        };
        portIndex++;
      }
    }
    
    return positions;
  };
  
  // Calculate distance between two devices
  export const deviceDistance = (device1: Device, device2: Device): number => {
    const centerX1 = device1.x + device1.width / 2;
    const centerY1 = device1.y + device1.height / 2;
    const centerX2 = device2.x + device2.width / 2;
    const centerY2 = device2.y + device2.height / 2;
    
    return Math.sqrt(
      Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
    );
  };
  
  // Calculate subnet from CIDR
  export const getSubnetFromCidr = (cidr: string): { network: string; mask: string } => {
    try {
      const [address, prefixStr] = cidr.split('/');
      const prefix = parseInt(prefixStr, 10);
      
      if (isNaN(prefix) || prefix < 0 || prefix > 32) {
        throw new Error('Invalid prefix length');
      }
      
      // Parse address to binary
      const ipParts = address.split('.').map(part => parseInt(part, 10));
      if (ipParts.length !== 4 || ipParts.some(part => isNaN(part) || part < 0 || part > 255)) {
        throw new Error('Invalid IP address');
      }
      
      const ipBinary = ipParts
        .map(part => part.toString(2).padStart(8, '0'))
        .join('');
      
      // Create network mask binary
      const maskBinary = '1'.repeat(prefix).padEnd(32, '0');
      
      // Calculate network address binary
      const networkBinary = ipBinary
        .split('')
        .map((bit, i) => (i < prefix ? bit : '0'))
        .join('');
      
      // Convert binary back to dotted decimal
      const networkParts = [];
      const maskParts = [];
      
      for (let i = 0; i < 4; i++) {
        networkParts.push(parseInt(networkBinary.substr(i * 8, 8), 2));
        maskParts.push(parseInt(maskBinary.substr(i * 8, 8), 2));
      }
      
      return {
        network: networkParts.join('.'),
        mask: maskParts.join('.'),
      };
    } catch (error) {
      console.error('Error parsing CIDR:', error);
      return { network: '', mask: '' };
    }
  };
  
  // Get all connected routers
  export const getConnectedRouters = (
    router: Device,
    devices: Device[],
    connections: Connection[]
  ): Device[] => {
    if (router.type !== 'router') return [];
    
    const connectedDevices: Device[] = [];
    
    // Find all connections from this router
    const routerConnections = connections.filter(
      conn => conn.sourceDeviceId === router.id || conn.targetDeviceId === router.id
    );
    
    // For each connection, find the device on the other end
    routerConnections.forEach(connection => {
      const otherDeviceId = connection.sourceDeviceId === router.id
        ? connection.targetDeviceId
        : connection.sourceDeviceId;
      
      const otherDevice = devices.find(device => device.id === otherDeviceId);
      
      if (otherDevice && otherDevice.type === 'router') {
        connectedDevices.push(otherDevice);
      }
    });
    
    return connectedDevices;
  };
  
  // Check if a specific IP is in a subnet
  export const isIpInSubnet = (
    ip: string,
    networkAddress: string,
    subnetMask: string
  ): boolean => {
    try {
      // Convert IP address to an array of integers
      const ipParts = ip.split('.').map(part => parseInt(part, 10));
      const networkParts = networkAddress.split('.').map(part => parseInt(part, 10));
      const maskParts = subnetMask.split('.').map(part => parseInt(part, 10));
      
      // Check that all parts are valid
      if (
        ipParts.length !== 4 ||
        networkParts.length !== 4 ||
        maskParts.length !== 4 ||
        ipParts.some(part => isNaN(part) || part < 0 || part > 255) ||
        networkParts.some(part => isNaN(part) || part < 0 || part > 255) ||
        maskParts.some(part => isNaN(part) || part < 0 || part > 255)
      ) {
        return false;
      }
      
      // Check if IP is in the subnet
      for (let i = 0; i < 4; i++) {
        if ((ipParts[i] & maskParts[i]) !== (networkParts[i] & maskParts[i])) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error checking IP in subnet:', error);
      return false;
    }
  };
  
  // Verify that the network topology is valid
  export const verifyNetworkConnectivity = (
    devices: Device[],
    connections: Connection[]
  ): { valid: boolean; error?: string } => {
    // Check that there are devices and connections
    if (devices.length === 0) {
      return { valid: false, error: 'No devices in the topology' };
    }
    
    if (connections.length === 0) {
      return { valid: false, error: 'No connections in the topology' };
    }
    
    // Check that all connections reference valid devices and ports
    for (const connection of connections) {
      const sourceDevice = devices.find(d => d.id === connection.sourceDeviceId);
      const targetDevice = devices.find(d => d.id === connection.targetDeviceId);
      
      if (!sourceDevice) {
        return {
          valid: false,
          error: `Connection references non-existent source device: ${connection.sourceDeviceId}`,
        };
      }
      
      if (!targetDevice) {
        return {
          valid: false,
          error: `Connection references non-existent target device: ${connection.targetDeviceId}`,
        };
      }
      
      const sourcePort = sourceDevice.ports.find(p => p.id === connection.sourcePortId);
      const targetPort = targetDevice.ports.find(p => p.id === connection.targetPortId);
      
      if (!sourcePort) {
        return {
          valid: false,
          error: `Connection references non-existent source port: ${connection.sourcePortId}`,
        };
      }
      
      if (!targetPort) {
        return {
          valid: false,
          error: `Connection references non-existent target port: ${connection.targetPortId}`,
        };
      }
    }
    
    // Check for IP address conflicts
    const ipAddresses = new Map<string, Device>();
    
    for (const device of devices) {
      if (device.config.interfaces) {
        for (const iface of device.config.interfaces) {
          if (iface.ipAddress && iface.ipAddress.trim() !== '') {
            if (ipAddresses.has(iface.ipAddress)) {
              const conflictDevice = ipAddresses.get(iface.ipAddress);
              return {
                valid: false,
                error: `IP address conflict: ${iface.ipAddress} is used by both ${device.name} and ${conflictDevice?.name}`,
              };
            }
            
            ipAddresses.set(iface.ipAddress, device);
          }
        }
      }
    }
    
    return { valid: true };
  };
  
  // Simulate the network
  export const simulateNetwork = (
    devices: Device[],
    connections: Connection[],
    vlans: VlanDefinition[]
  ): { devices: Device[]; routes: Route[] } => {
    // Create a copy of the devices to modify
    const simulatedDevices = [...devices];
    const allRoutes: Route[] = [];
    
    // Initialize all devices
    simulatedDevices.forEach(device => {
      // Set device status to on
      device.status = 'on';
      
      // Initialize interfaces for devices without them
      if (!device.config.interfaces || device.config.interfaces.length === 0) {
        device.config.interfaces = [];
        
        // For each port, add a corresponding interface
        device.ports.forEach((port, index) => {
          if (port.type === 'ethernet' || port.type === 'fiber') {
            device.config.interfaces!.push({
              ipAddress: '',
              subnetMask: '',
            });
          }
        });
      }
      
      // Set up VLANs for switches
      if (device.type === 'switch') {
        // Ensure ports have VLAN IDs
        device.ports.forEach(port => {
          if (port.type === 'ethernet' && !port.vlanId) {
            port.vlanId = 1; // Default VLAN
          }
        });
      }
    });
    
    // Dynamic IP assignment (for devices with DHCP enabled)
    simulatedDevices.forEach(device => {
      if (device.config.dhcp && device.config.interfaces && device.config.interfaces.length > 0) {
        device.config.interfaces.forEach((iface, index) => {
          if (!iface.ipAddress || iface.ipAddress.trim() === '') {
            // Find a DHCP server on this segment
            const dhcpServer = findDhcpServer(device, simulatedDevices, connections);
            
            if (dhcpServer) {
              // Assign IP from the DHCP server's subnet with a random host portion
              const serverInterface = dhcpServer.config.interfaces?.[0];
              
              if (serverInterface?.ipAddress && serverInterface?.subnetMask) {
                // Calculate subnet
                const subnet = getSubnetFromCidr(
                  `${serverInterface.ipAddress}/${subnetMaskToCidr(serverInterface.subnetMask)}`
                );
                
                // Assign a random IP in this subnet
                const hostPart = 100 + Math.floor(Math.random() * 100); // Host part between 100-199
                const networkParts = subnet.network.split('.');
                networkParts[3] = hostPart.toString();
                
                iface.ipAddress = networkParts.join('.');
                iface.subnetMask = serverInterface.subnetMask;
                
                // Set gateway to the DHCP server's IP
                if (!device.config.gateway) {
                  device.config.gateway = serverInterface.ipAddress;
                }
              }
            }
          }
        });
      }
    });
    
    // Generate routes for routers
    simulatedDevices.forEach(device => {
      if (device.type === 'router') {
        // Find all directly connected networks
        const directNetworks: { network: string; mask: string; nextHop: string; port: string }[] = [];
        
        // Add directly connected networks from interfaces
        if (device.config.interfaces) {
          device.config.interfaces.forEach((iface, index) => {
            if (iface.ipAddress && iface.subnetMask) {
              const cidr = `${iface.ipAddress}/${subnetMaskToCidr(iface.subnetMask)}`;
              const subnet = getSubnetFromCidr(cidr);
              
              directNetworks.push({
                network: subnet.network,
                mask: iface.subnetMask,
                nextHop: '0.0.0.0', // Directly connected
                port: device.ports[index]?.name || `Interface${index}`,
              });
            }
          });
        }
        
        // Generate routes to other networks
        const routerConnections = getConnectedRouters(device, simulatedDevices, connections);
        
        routerConnections.forEach(connectedRouter => {
          if (connectedRouter.config.interfaces) {
            connectedRouter.config.interfaces.forEach(iface => {
              if (iface.ipAddress && iface.subnetMask) {
                const cidr = `${iface.ipAddress}/${subnetMaskToCidr(iface.subnetMask)}`;
                const subnet = getSubnetFromCidr(cidr);
                
                // Skip if we already have a direct route to this network
                if (!directNetworks.some(net => net.network === subnet.network)) {
                  // Find the connection between these routers
                  const connection = connections.find(
                    conn =>
                      (conn.sourceDeviceId === device.id &&
                        conn.targetDeviceId === connectedRouter.id) ||
                      (conn.sourceDeviceId === connectedRouter.id &&
                        conn.targetDeviceId === device.id)
                  );
                  
                  if (connection) {
                    // Find the port on the connected router
                    const sourceIsDevice = connection.sourceDeviceId === device.id;
                    const connectedPort = sourceIsDevice
                      ? connectedRouter.ports.find(
                          p => p.id === connection.targetPortId
                        )
                      : connectedRouter.ports.find(
                          p => p.id === connection.sourcePortId
                        );
                    
                    if (connectedPort) {
                      // Add route through the connected router
                      const nextHop = iface.ipAddress;
                      
                      const newRoute: Route = {
                        destination: `${subnet.network}/${subnetMaskToCidr(subnet.mask)}`,
                        nextHop,
                        metric: 1, // Default metric
                        interface: connectedPort.name,
                      };
                      
                      // Add to device's routes
                      if (!device.config.routes) {
                        device.config.routes = [];
                      }
                      
                      // Check if route already exists
                      const existingRoute = device.config.routes.find(
                        r => r.destination === newRoute.destination
                      );
                      
                      if (!existingRoute) {
                        device.config.routes.push(newRoute);
                        allRoutes.push(newRoute);
                      }
                    }
                  }
                }
              }
            });
          }
        });
      }
    });
    
    return { devices: simulatedDevices, routes: allRoutes };
  };
  
  // Find a DHCP server on the same network segment
  const findDhcpServer = (
    device: Device,
    devices: Device[],
    connections: Connection[]
  ): Device | null => {
    // Find devices connected to this one
    const connectedDeviceIds = connections
      .filter(
        conn => conn.sourceDeviceId === device.id || conn.targetDeviceId === device.id
      )
      .map(conn =>
        conn.sourceDeviceId === device.id ? conn.targetDeviceId : conn.sourceDeviceId
      );
    
    // Check if any of these devices is a DHCP server
    for (const id of connectedDeviceIds) {
      const connectedDevice = devices.find(d => d.id === id);
      
      if (
        connectedDevice &&
        (connectedDevice.type === 'router' || connectedDevice.type === 'firewall') &&
        connectedDevice.config.dhcp
      ) {
        return connectedDevice;
      }
    }
    
    // No DHCP server found
    return null;
  };
  
  // Convert subnet mask to CIDR notation
  const subnetMaskToCidr = (subnetMask: string): number => {
    try {
      // Split the subnet mask into its octets
      const octets = subnetMask.split('.').map(octet => parseInt(octet, 10));
      
      // Check if the subnet mask is valid
      if (octets.length !== 4 || octets.some(octet => isNaN(octet) || octet < 0 || octet > 255)) {
        throw new Error('Invalid subnet mask');
      }
      
      // Convert each octet to binary and count the number of 1s
      let count = 0;
      for (const octet of octets) {
        // Convert to binary string
        const binary = octet.toString(2);
        // Count the number of 1s
        count += binary.split('').filter(bit => bit === '1').length;
      }
      
      return count;
    } catch (error) {
      console.error('Error converting subnet mask to CIDR:', error);
      return 24; // Default to /24 if there's an error
    }
  };
  
  // Ping simulation function
  export const pingDevices = (
    sourceDevice: Device,
    targetDevice: Device,
    devices: Device[],
    connections: Connection[],
    vlans: VlanDefinition[]
  ): PingResult => {
    // Check if devices are powered on
    if (sourceDevice.status !== 'on' || targetDevice.status !== 'on') {
      return {
        success: false,
        error: 'One or both devices are powered off',
        stats: { sent: 1, received: 0, lost: 1, latency: 0 },
        journey: {
          id: `ping-${Date.now()}`,
          path: [],
          success: false,
        },
      };
    }
    
    // Check if source device has an IP address
    if (!sourceDevice.config.interfaces?.[0]?.ipAddress) {
      return {
        success: false,
        error: 'Source device has no IP address',
        stats: { sent: 1, received: 0, lost: 1, latency: 0 },
        journey: {
          id: `ping-${Date.now()}`,
          path: [],
          success: false,
        },
      };
    }
    
    // Check if target device has an IP address
    if (!targetDevice.config.interfaces?.[0]?.ipAddress) {
      return {
        success: false,
        error: 'Target device has no IP address',
        stats: { sent: 1, received: 0, lost: 1, latency: 0 },
        journey: {
          id: `ping-${Date.now()}`,
          path: [],
          success: false,
        },
      };
    }
    
    // Find the path between the two devices
    const path = findNetworkPath(sourceDevice, targetDevice, devices, connections, vlans);
    
    if (!path || path.length === 0) {
      return {
        success: false,
        error: 'No path found between devices',
        stats: { sent: 1, received: 0, lost: 1, latency: 0 },
        journey: {
          id: `ping-${Date.now()}`,
          path: [],
          success: false,
        },
      };
    }
    
    // Calculate journey and latency
    const journey: PacketJourney = {
      id: `ping-${Date.now()}`,
      path: path.map(step => ({
        sourceDeviceId: step.from,
        targetDeviceId: step.to,
        success: true,
      })),
      success: true,
    };
    
    // Calculate latency based on number of hops and connection latencies
    let totalLatency = 0;
    
    for (let i = 0; i < path.length; i++) {
      const step = path[i];
      
      // Find connection for this step
      const connection = connections.find(
        conn =>
          (conn.sourceDeviceId === step.from && conn.targetDeviceId === step.to) ||
          (conn.sourceDeviceId === step.to && conn.targetDeviceId === step.from)
      );
      
      // Add latency for this connection (default 1ms if not specified)
      totalLatency += connection?.latency || 1;
      
      // Add processing delay for each hop (e.g., routers)
      const fromDevice = devices.find(d => d.id === step.from);
      if (fromDevice && fromDevice.type === 'router') {
        totalLatency += 2; // Router forwarding delay
      }
    }
    
    return {
      success: true,
      stats: { sent: 1, received: 1, lost: 0, latency: totalLatency },
      journey,
    };
  };
  
  // Network path finding function
  interface PathStep {
    from: string;
    to: string;
  }
  
  const findNetworkPath = (
    sourceDevice: Device,
    targetDevice: Device,
    devices: Device[],
    connections: Connection[],
    vlans: VlanDefinition[]
  ): PathStep[] | null => {
    // Simple case: devices are directly connected
    const directConnection = connections.find(
      conn =>
        (conn.sourceDeviceId === sourceDevice.id && conn.targetDeviceId === targetDevice.id) ||
        (conn.sourceDeviceId === targetDevice.id && conn.targetDeviceId === sourceDevice.id)
    );
    
    if (directConnection) {
      return [
        {
          from: sourceDevice.id,
          to: targetDevice.id,
        },
      ];
    }
    
    // More complex case: need to find a path through the network
    // Using a breadth-first search
    
    const visited = new Set<string>();
    const queue: { deviceId: string; path: PathStep[] }[] = [];
    
    // Start from the source device
    queue.push({ deviceId: sourceDevice.id, path: [] });
    visited.add(sourceDevice.id);
    
    while (queue.length > 0) {
      const { deviceId, path } = queue.shift()!;
      
      // Get connected devices
      const connectedDevices = getConnectedDevices(deviceId, connections);
      
      for (const connectedId of connectedDevices) {
        // If we've reached the target, return the path
        if (connectedId === targetDevice.id) {
          return [...path, { from: deviceId, to: connectedId }];
        }
        
        // If we haven't visited this device yet, add it to the queue
        if (!visited.has(connectedId)) {
          visited.add(connectedId);
          queue.push({
            deviceId: connectedId,
            path: [...path, { from: deviceId, to: connectedId }],
          });
        }
      }
    }
    
    // No path found
    return null;
  };
  
  // Get all devices connected to a specific device
  const getConnectedDevices = (
    deviceId: string,
    connections: Connection[]
  ): string[] => {
    return connections
      .filter(conn => conn.sourceDeviceId === deviceId || conn.targetDeviceId === deviceId)
      .map(conn => (conn.sourceDeviceId === deviceId ? conn.targetDeviceId : conn.sourceDeviceId));
  };

  /**
 * Translate error messages to Japanese
 */
export const translateErrorMessage = (message: string): string => {
  const translations: Record<string, string> = {
    'No devices in the topology': 'トポロジーにデバイスがありません',
    'No connections in the topology': 'トポロジーに接続がありません',
    'Connection references non-existent source device': '存在しないソースデバイスを参照しています',
    'Connection references non-existent target device': '存在しないターゲットデバイスを参照しています',
    'Connection references non-existent source port': '存在しないソースポートを参照しています',
    'Connection references non-existent target port': '存在しないターゲットポートを参照しています',
    'IP address conflict': 'IPアドレスの競合',
    'Source device has no IP address': 'ソースデバイスにIPアドレスがありません',
    'Target device has no IP address': 'ターゲットデバイスにIPアドレスがありません',
    'No path found between devices': 'デバイス間にパスが見つかりません',
    'Invalid topology data format': '無効なトポロジーデータフォーマットです',
    'One or both devices are powered off': 'いずれかまたは両方のデバイスの電源がオフです',
    'PDF export failed': 'PDFエクスポートに失敗しました',
    'CSV export failed': 'CSVエクスポートに失敗しました',
    'This port is already connected': 'このポートは既に接続されています',
    'is used by both': 'は両方で使用されています',
    'Invalid subnet mask': '無効なサブネットマスクです',
    'Failed to import': 'インポートに失敗しました',
    // Add more translations as needed
  };

  // Return the translation if available, otherwise return the original
  for (const [english, japanese] of Object.entries(translations)) {
    if (message.includes(english)) {
      return message.replace(english, japanese);
    }
  }
  
  return message;
};

/**
 * Get predefined device templates
 */
export const getDeviceTemplates = (): DeviceTemplate[] => {
  return [
    // Basic templates
    {
      id: 'simple-router',
      name: '基本ルーター',
      type: 'router',
      category: '基本デバイス',
      icon: 'network-wired',
      description: '基本的なルーター設定',
      config: {
        hostname: 'Router',
        interfaces: [
          { ipAddress: '192.168.1.1', subnetMask: '255.255.255.0' },
          { ipAddress: '10.0.0.1', subnetMask: '255.255.255.0' },
        ],
        routes: [
          { destination: '0.0.0.0/0', nextHop: '', metric: 1 }
        ],
        nat: true,
      }
    },
    {
      id: 'l2-switch',
      name: 'L2スイッチ',
      type: 'switch',
      category: '基本デバイス',
      icon: 'sitemap',
      description: '基本的なL2スイッチ設定',
      config: {
        hostname: 'Switch',
        vlans: [
          { id: 1, name: 'デフォルト' },
          { id: 10, name: 'VLAN10' },
          { id: 20, name: 'VLAN20' },
        ]
      }
    },
    {
      id: 'firewall',
      name: 'ファイアウォール',
      type: 'firewall',
      category: '基本デバイス',
      icon: 'shield-alt',
      description: '基本的なファイアウォール設定',
      config: {
        hostname: 'Firewall',
        interfaces: [
          { ipAddress: '203.0.113.1', subnetMask: '255.255.255.0' },
          { ipAddress: '192.168.1.1', subnetMask: '255.255.255.0' },
        ],
        nat: true,
        firewallRules: [
          {
            id: 'rule1',
            name: '外部アクセス許可',
            sourceIp: '192.168.1.0/24',
            destinationIp: 'any',
            protocol: 'any',
            action: 'allow',
          }
        ]
      }
    },
    {
      id: 'workstation',
      name: 'ワークステーション',
      type: 'workstation',
      category: '基本デバイス',
      icon: 'desktop',
      description: '基本的なPC設定',
      config: {
        hostname: 'PC',
        interfaces: [
          { ipAddress: '192.168.1.100', subnetMask: '255.255.255.0' }
        ],
        gateway: '192.168.1.1',
        dns: ['8.8.8.8', '1.1.1.1']
      }
    },
    
    // Template groups
    {
      id: 'small-office',
      name: '小規模オフィスネットワーク',
      type: 'router',
      category: 'テンプレートグループ',
      icon: 'building',
      description: 'ルーター、スイッチ、サーバー、PCを含む小規模オフィス向けテンプレート',
      // This is a template group - would be expanded to multiple devices when imported
    },
    {
      id: 'vlan-network',
      name: 'VLAN分離ネットワーク',
      type: 'switch',
      category: 'テンプレートグループ',
      icon: 'project-diagram',
      description: 'VLANで分離された複数のネットワークセグメント',
      // This is a template group - would be expanded to multiple devices when imported
    },
    // Add more templates as needed
  ];
};

/* 
* Utility Function Additions
* Add this to exportUtils.ts
*/

// CSV Export Function
export const exportToCSV = (
  devices: Device[],
  connections: Connection[],
  vlans: VlanDefinition[],
  filename: string = 'network-config.csv'
): boolean => {
  try {
    // Generate CSV content
    let csvContent = "デバイス名,タイプ,ホスト名,IPアドレス,サブネットマスク,ゲートウェイ,VLAN,ポート\n";
    
    // Add device information
    devices.forEach(device => {
      let baseInfo = `"${device.name}","${device.type}","${device.config.hostname || ''}",`;
      
      if (device.config.interfaces && device.config.interfaces.length > 0) {
        device.config.interfaces.forEach((iface, index) => {
          let row = baseInfo;
          row += `"${iface.ipAddress || ''}","${iface.subnetMask || ''}","${device.config.gateway || ''}",`;
          
          // Add VLAN info
          const portVlans = device.ports
            .filter(p => p.vlanId)
            .map(p => `${p.name}:VLAN${p.vlanId}`)
            .join('; ');
          
          row += `"${portVlans}",`;
          
          // Add port info
          const ports = device.ports.map(p => p.name).join(', ');
          row += `"${ports}"`;
          
          csvContent += row + "\n";
        });
      } else {
        // Device without interfaces
        csvContent += `${baseInfo}"","","","","${device.ports.map(p => p.name).join(', ')}"\n`;
      }
    });
    
    // Add VLAN information
    csvContent += "\n\nVLAN ID,名前,色\n";
    vlans.forEach(vlan => {
      csvContent += `${vlan.id},"${vlan.name}","${vlan.color}"\n`;
    });
    
    // Add connection information
    csvContent += "\n\n接続元デバイス,接続元ポート,接続先デバイス,接続先ポート,ステータス,タイプ,帯域幅\n";
    connections.forEach(conn => {
      const sourceDevice = devices.find(d => d.id === conn.sourceDeviceId);
      const targetDevice = devices.find(d => d.id === conn.targetDeviceId);
      
      if (sourceDevice && targetDevice) {
        const sourcePort = sourceDevice.ports.find(p => p.id === conn.sourcePortId);
        const targetPort = targetDevice.ports.find(p => p.id === conn.targetPortId);
        
        if (sourcePort && targetPort) {
          csvContent += `"${sourceDevice.name}","${sourcePort.name}","${targetDevice.name}","${targetPort.name}","${conn.status}","${conn.type}","${conn.bandwidth || ''}"\n`;
        }
      }
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};