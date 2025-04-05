export interface DeviceConfig {
  hostname?: string;
  interfaces?: { ipAddress: string; subnetMask: string }[];
  routes?: { destination: string; nextHop: string; metric: number; interface?: string }[];
  nat?: boolean;
  dhcp?: boolean;
  vlan?: string;
  gateway?: string;
  dns?: string[];
  firewallRules?: {
    id: string;
    name: string;
    sourceIp: string;
    destinationIp: string;
    protocol: string;
    action: string;
  }[];
  vlans?: { id: number; name: string; interfaces?: any[] }[];
  [key: string]: any;
}
