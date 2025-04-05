// types/networkTopology.ts

// Device types
export type DeviceType = 'router' | 'switch' | 'server' | 'workstation' | 'firewall' | 'l2switch' | 'l3switch' | 'accesspoint';

// Interface/port types
export type PortType = 'ethernet' | 'fiber' | 'serial' | 'usb' | 'console' | 'wireless';

// Diagram types (logical or physical)
export type DiagramType = 'logical' | 'physical';

// Device port interface
export interface Port {
  id: string;
  name: string;
  type: PortType;
  isConnected: boolean;
  vlanId?: number;
  speed?: string;
  duplex?: 'half' | 'full' | 'auto';
  mode?: 'access' | 'trunk' | 'hybrid';
  description?: string;
}

// Network interface (like eth0, etc.)
export interface NetworkInterface {
  ipAddress: string;
  subnetMask: string;
  macAddress?: string;
  gateway?: string;
  dns?: string[];
  dhcpEnabled?: boolean;
}

// Routing table entry
export interface Route {
  destination: string;
  nextHop: string;
  metric: number;
  interface?: string;
  administrative_distance?: number;
}

// VLAN configuration for devices
export interface VlanConfig {
  id: number;
  name: string;
  interfaces?: string[];
  ipAddress?: string;
  subnetMask?: string;
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
  enabled?: boolean;
  logging?: boolean;
}

// Device configuration object
export interface NetworkConfig {
  hostname?: string;
  interfaces?: NetworkInterface[];
  routes?: Route[];
  firewallRules?: FirewallRule[];
  gateway?: string;
  dns?: string[];
  nat?: boolean;
  dhcp?: boolean;
  vlans?: VlanConfig[];
  [key: string]: any; // Allow for additional device-specific configuration
}

export type DeviceConfig = NetworkConfig;

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
  config: NetworkConfig;
  zIndex: number;
  isDragging?: boolean;
  description?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  icon?: string;
}

// Connection path point
export interface ConnectionPathPoint {
  x: number;
  y: number;
  type: 'endpoint' | 'control';
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
  pathPoints?: ConnectionPathPoint[];
  label?: string;
  isEncrypted?: boolean;
  protocol?: string;
  description?: string;
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
  description?: string;
}

// VLAN definition
export interface VlanDefinition {
  id: number;
  name: string;
  color: string;
  description?: string;
}

// Device template for quick insertion
export interface DeviceTemplate {
  id: string;
  name: string;
  type: DeviceType;
  config?: NetworkConfig; // updated to optional to support template groups
  description?: string;
  category?: string;
  icon?: string;
  portCount?: number;
  relativePosition?: Position; // Used for template groups
  connections?: {
    sourceId: string;
    targetId: string;
    type: PortType;
  }[];
}

// Types of items that can be selected
export type SelectionType = 'device' | 'connection' | 'location';

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