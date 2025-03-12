// types/networkTopology.ts

// Device types
export type DeviceType = 'router' | 'switch' | 'server' | 'workstation' | 'firewall';

// Interface/port types
export type PortType = 'ethernet' | 'fiber' | 'serial' | 'usb' | 'console';

// Device port interface
export interface Port {
  id: string;
  name: string;
  type: PortType;
  isConnected: boolean;
  vlanId?: number;
}

// Network interface (like eth0, etc.)
export interface NetworkInterface {
  ipAddress: string;
  subnetMask: string;
  macAddress?: string;
  gateway?: string;
  dns?: string[];
}

// Routing table entry
export interface Route {
  destination: string;
  nextHop: string;
  metric: number;
  interface?: string;
}

// Firewall rule
export interface FirewallRule {
  id: string;
  name?: string;
  sourceIp: string;
  destinationIp: string;
  protocol: 'tcp' | 'udp' | 'icmp' | 'any';
  sourcePort?: string;
  destinationPort?: string;
  action: 'allow' | 'deny';
}

// Device configuration object
export interface DeviceConfig {
  hostname?: string;
  interfaces?: NetworkInterface[];
  routes?: Route[];
  firewallRules?: FirewallRule[];
  gateway?: string;
  dns?: string[];
  vlan?: string; // For switches
  dhcp?: boolean;
  nat?: boolean;
  [key: string]: any; // Allow for additional device-specific configuration
}

// Position coordinates
export interface Position {
  x: number;
  y: number;
}

// Main device object
export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  ports: Port[];
  status: 'on' | 'off' | 'error' | 'warning';
  config: DeviceConfig;
  zIndex: number;
  isDragging?: boolean;
}

// Connection between devices
export interface Connection {
  id: string;
  sourceDeviceId: string;
  sourcePortId: string;
  targetDeviceId: string;
  targetPortId: string;
  status: 'active' | 'inactive' | 'error';
  type: PortType;
  bandwidth?: string;
  latency?: number;
}

// Network area/location
export interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  devices: string[];
}

// VLAN definition
export interface VlanDefinition {
  id: number;
  name: string;
  color: string;
}

// Types of items that can be selected
export type SelectionType = 'device' | 'connection';

// Simulation states
export type SimulationState = 'running' | 'stopped' | 'paused';

// Notification types and interface
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  timestamp: Date;
  duration?: number;
}

// Simulation path step
export interface PathStep {
  sourceDeviceId: string;
  targetDeviceId: string;
  success: boolean;
  delay?: number; // Milliseconds delay to represent processing time
}

// Packet journey (e.g., for ping or traceroute visualization)
export interface PacketJourney {
  id: string;
  path: PathStep[];
  success: boolean;
  timing?: number[]; // Timing information for each step
}

// Ping test result
export interface PingResult {
  success: boolean;
  error?: string;
  stats: {
    sent: number;
    received: number;
    lost: number;
    latency: number;
  };
  journey: PacketJourney;
}