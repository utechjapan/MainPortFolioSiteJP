// components/labs/helpers.ts
import { NetworkDevice, Connection } from '../../types/network';

export const getDeviceColor = (device: NetworkDevice): string => {
  if (device.status === 'offline') return 'gray';
  switch (device.type) {
    case 'router': return 'blue';
    case 'switch': return 'green';
    case 'server': return 'purple';
    case 'client':
    case 'workstation': return 'cyan';
    case 'firewall': return 'red';
    case 'vpn': return 'indigo';
    case 'cloud': return 'sky';
    default: return 'gray';
  }
};

export const getDeviceColorClasses = (device: NetworkDevice): string => {
  const color = getDeviceColor(device);
  switch (color) {
    case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700';
    case 'green': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-300 dark:border-green-700';
    case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-700';
    case 'cyan': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-700';
    case 'red': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700';
    case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700';
    case 'sky': return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-700';
    default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700';
  }
};

export const getDeviceIcon = (device: NetworkDevice): string => {
  switch (device.type) {
    case 'router': return 'fa-network-wired';
    case 'switch': return 'fa-sitemap';
    case 'server': return 'fa-server';
    case 'workstation': return 'fa-desktop';
    case 'client': return 'fa-laptop';
    case 'firewall': return 'fa-shield-alt';
    case 'vpn': return 'fa-lock';
    case 'cloud': return 'fa-cloud';
    default: return 'fa-question';
  }
};

export const getConnectionColor = (conn: Connection): string => {
  if (conn.color) return conn.color;
  if (conn.status === 'error') return '#EF4444';
  if (conn.status === 'inactive') return '#9CA3AF';
  switch (conn.type) {
    case 'ethernet': return '#3B82F6';
    case 'fiber': return '#10B981';
    case 'wireless': return '#F59E0B';
    case 'vpn': return '#8B5CF6';
    default: return '#3B82F6';
  }
};

export const getConnectionLineStyle = (conn: Connection): string => {
  switch (conn.type) {
    case 'vpn': return '6,3';
    case 'wireless': return '2,2';
    default: return '';
  }
};
