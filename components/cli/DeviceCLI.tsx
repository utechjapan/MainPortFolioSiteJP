// components/cli/DeviceCLI.tsx
import React, { useState } from 'react';
import { NetworkDevice } from '../../types/network';

interface DeviceCLIProps {
  device: NetworkDevice;
  onClose: () => void;
}

const DeviceCLI: React.FC<DeviceCLIProps> = ({ device, onClose }) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const handleExecute = () => {
    let response = '';
    // Simulate different CLI outputs based on device type
    switch (device.type) {
      case 'router':
        if (command === 'show ip interface brief') {
          response = device.interfaces
            .map(i => `${i.name} ${i.ipAddress || 'N/A'} ${i.subnetMask || ''} ${i.status}`)
            .join('\n');
        } else if (command === 'configure terminal') {
          response = 'Enter configuration commands, one per line.';
        } else {
          response = `Unknown command: ${command}`;
        }
        break;
      case 'switch':
        if (command === 'show vlan') {
          response = `VLANs: ${device.config.vlan || 'Not configured'}`;
        } else {
          response = `Unknown command: ${command}`;
        }
        break;
      case 'firewall':
        if (command === 'show policies') {
          response = device.config.firewallRules
            ?.map(r => `${r.id} ${r.action} ${r.source} -> ${r.destination} (${r.protocol})`)
            .join('\n') || 'No policies configured';
        } else {
          response = `Unknown command: ${command}`;
        }
        break;
      case 'server':
      case 'workstation':
        if (command.startsWith('ping')) {
          response = 'Pinging... Reply received.';
        } else {
          response = `Unknown command: ${command}`;
        }
        break;
      default:
        response = `CLI not available for device type ${device.type}`;
    }
    setOutput(prev => [...prev, `> ${command}`, response]);
    setCommand('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-11/12 md:w-1/2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">CLI: {device.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded h-40 overflow-y-auto text-xs font-mono mb-2">
          {output.length === 0 ? (
            <div className="text-gray-500">Welcome to the CLI. Type your commands below.</div>
          ) : (
            output.map((line, idx) => <div key={idx}>{line}</div>)
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleExecute(); }}
          />
          <button onClick={handleExecute} className="px-4 bg-primary hover:bg-primary-dark text-white rounded-r">
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceCLI;
