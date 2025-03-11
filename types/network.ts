// types/network.ts
export interface NetworkInterface {
  id: string;
  name: string;
  type: string;
  ipAddress?: string;
  subnetMask?: string;
  status: 'up' | 'down';
}

export interface Route {
  destination: string;
  nextHop: string;
  metric: number;
}

export interface FirewallRule {
  id: string;
  action: 'allow' | 'deny';
  source: string;
  destination: string;
  protocol: 'tcp' | 'udp' | 'icmp' | 'any';
  port?: number | string;
  description?: string;
  enabled: boolean;
}

export interface VpnConfig {
  type: 'site-to-site' | 'client-to-site';
  encryption: 'aes-256' | 'aes-128' | '3des';
  remoteEndpoint?: string;
  localSubnets?: string[];
  remoteSubnets?: string[];
  status: 'connected' | 'disconnected' | 'connecting';
}

export interface NetworkDevice {
  id: string;
  type: 'router' | 'switch' | 'server' | 'firewall' | 'cloud' | 'vpn' | 'client' | 'workstation';
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

export interface Connection {
  id: string;
  from: { deviceId: string; interfaceId: string };
  to: { deviceId: string; interfaceId: string };
  type: 'ethernet' | 'fiber' | 'wireless' | 'vpn';
  status: 'active' | 'inactive' | 'error';
  bandwidth?: string;
  latency?: number;
  color?: string;
}

export interface Location {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  devices: string[];
}

export interface TestResult {
  id: string;
  source: string;
  destination: string;
  success: boolean;
  message: string;
  details: string[];
  timestamp: Date;
}
