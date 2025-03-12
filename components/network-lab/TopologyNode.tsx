// components/network-lab/TopologyNode.tsx
import React from 'react';
import { Group, Rect, Text, Circle, Image } from 'react-konva';
import { Device, VlanDefinition } from '../../types/networkTopology';
import { getDeviceTypeInfo, calculatePortPositions } from '../../utils/networkUtils';

interface TopologyNodeProps {
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onPortClick: (portId: string) => void;
  vlans: VlanDefinition[];
}

const TopologyNode: React.FC<TopologyNodeProps> = ({
  device,
  isSelected,
  onSelect,
  onMove,
  onPortClick,
  vlans,
}) => {
  const deviceTypeInfo = getDeviceTypeInfo(device.type);
  const portPositions = calculatePortPositions(device);
  
  // Determine device status color
  let statusColor = '#ccc'; // Default: gray (off)
  if (device.status === 'on') statusColor = '#4CAF50'; // Green (on)
  if (device.status === 'error') statusColor = '#F44336'; // Red (error)
  if (device.status === 'warning') statusColor = '#FFC107'; // Yellow (warning)
  
  // Get IP addresses for label (if available)
  const ipAddressLabel = device.config.interfaces?.[0]?.ipAddress || '';
  
  return (
    <Group
      x={device.x}
      y={device.y}
      draggable
      onDragStart={onSelect}
      onDragEnd={(e) => {
        onMove(e.target.x(), e.target.y());
      }}
      onClick={onSelect}
    >
      {/* Background */}
      <Rect
        width={device.width}
        height={device.height}
        fill={deviceTypeInfo.fill || '#fff'}
        stroke={isSelected ? '#2196F3' : deviceTypeInfo.stroke || '#333'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={4}
        shadowColor="rgba(0,0,0,0.3)"
        shadowBlur={5}
        shadowOffset={{ x: 2, y: 2 }}
        shadowOpacity={0.3}
      />

      {/* Device Icon */}
      <Text
        x={device.width / 2}
        y={device.height / 2 - 10}
        text={deviceTypeInfo.icon || '⬛'}
        fontSize={24}
        fontFamily="FontAwesome"
        fill={deviceTypeInfo.iconColor || '#333'}
        align="center"
        verticalAlign="middle"
        width={device.width}
      />

      {/* Status indicator */}
      <Circle
        x={device.width - 8}
        y={8}
        radius={4}
        fill={statusColor}
      />

      {/* Device name */}
      <Text
        x={0}
        y={device.height - 30}
        text={device.name}
        fontSize={12}
        fontFamily="Arial"
        fill="#333"
        align="center"
        width={device.width}
      />

      {/* IP Address (if available) */}
      {ipAddressLabel && (
        <Text
          x={0}
          y={device.height - 15}
          text={ipAddressLabel}
          fontSize={10}
          fontFamily="monospace"
          fill="#666"
          align="center"
          width={device.width}
        />
      )}

      {/* Ports */}
      {device.ports.map((port, index) => {
        if (!portPositions[index]) return null;
        
        // Determine port color based on VLAN (if applicable)
        let portColor = '#666';
        if (port.vlanId) {
          const vlan = vlans.find(v => v.id === port.vlanId);
          if (vlan) {
            portColor = vlan.color;
          }
        }
        
        // Add different style for connected ports
        const portStroke = port.isConnected ? portColor : '#666';
        const portFill = port.isConnected ? portColor : 'white';
        
        return (
          <Group 
            key={port.id}
            x={portPositions[index].x - device.x}
            y={portPositions[index].y - device.y}
            onClick={(e) => {
              e.cancelBubble = true; // Don't propagate to device
              onPortClick(port.id);
            }}
          >
            <Circle
              radius={6}
              fill={portFill}
              stroke={portStroke}
              strokeWidth={1}
            />
            {/* Port label (optional) */}
            <Text
              x={-12}
              y={portPositions[index].side === 'left' ? -18 : 8}
              width={24}
              text={port.name}
              fontSize={8}
              fontFamily="Arial"
              fill="#666"
              align="center"
            />
          </Group>
        );
      })}
    </Group>
  );
};

export default TopologyNode;