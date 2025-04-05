// components/network-lab/TopologyNode.tsx
import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { Device, VlanDefinition, DiagramType } from '../../types/networkTopology';
import { getDeviceTypeInfo, calculatePortPositions } from '../../utils/networkUtils';

interface TopologyNodeProps {
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onPortClick: (portId: string) => void;
  vlans: VlanDefinition[];
  diagramType: DiagramType;
}

const TopologyNode: React.FC<TopologyNodeProps> = ({
  device,
  isSelected,
  onSelect,
  onMove,
  onPortClick,
  vlans,
  diagramType,
}) => {
  const deviceTypeInfo = getDeviceTypeInfo(device.type);
  const portPositions = calculatePortPositions(device);

  // Handle drag end
  const handleDragEnd = (e: any) => {
    onMove(e.target.x(), e.target.y());
  };

  return (
    <Group
      x={device.x}
      y={device.y}
      draggable
      onDragStart={onSelect}
      onDragEnd={handleDragEnd}
      onClick={onSelect}
    >
      <Rect
        width={device.width}
        height={device.height}
        fill={deviceTypeInfo.fill || '#fff'}
        stroke={isSelected ? '#2196F3' : deviceTypeInfo.stroke || '#333'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={4}
      />

      {/* Device icon and name */}
      {/* ...existing device icon and name rendering removed for simplicity... */}

      {/* Port rendering with reliable positioning */}
      {/* ...existing ports rendering removed for simplicity... */}
    </Group>
  );
};

// Helper function to get device icon character
function getDeviceIcon(type: string): string {
  switch (type) {
    case 'router':
      return '🌐';
    case 'switch':
      return '🔄';
    case 'server':
      return '🖥️';
    case 'workstation':
      return '💻';
    case 'firewall':
      return '🔒';
    case 'l2switch':
      return '🔀';
    case 'l3switch':
      return '🔃';
    case 'accesspoint':
      return '📶';
    default:
      return '📦';
  }
}

export default TopologyNode;