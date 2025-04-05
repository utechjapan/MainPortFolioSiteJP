import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { Device, VlanDefinition, DiagramType } from '../../types/networkTopology';
import { getDeviceTypeInfo, calculatePortPositions } from '../../utils/networkUtils';

export interface TopologyNodeProps {
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onPortClick: (portId: string) => void;
  vlans: VlanDefinition[];
  diagramType: DiagramType;
  onDragEnd?: (e: any) => void; // ✅ Added for external drag handler
}

const TopologyNode: React.FC<TopologyNodeProps> = ({
  device,
  isSelected,
  onSelect,
  onMove,
  onPortClick,
  vlans,
  diagramType,
  onDragEnd,
}) => {
  const deviceTypeInfo = getDeviceTypeInfo(device.type);
  const portPositions = calculatePortPositions(device);

  // Handle drag end
  const handleDragEnd = (e: any) => {
    onMove(e.target.x(), e.target.y());

    // ✅ Optional external drag handler
    if (onDragEnd) {
      onDragEnd(e);
    }
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

      {/* Device name */}
      <Text
        text={device.name}
        fontSize={14}
        fill="#000"
        x={5}
        y={device.height + 5}
      />

      {/* Port rendering (simplified) */}
      {portPositions.map((pos, index) => (
        <Circle
          key={index}
          x={pos.x}
          y={pos.y}
          radius={4}
          fill="#555"
          onClick={() => onPortClick(device.ports[index].id)}
        />
      ))}
    </Group>
  );
};

// Optional: device type icons (not currently used but you might want this later)
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
