// components/labs/Node.tsx
import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { NetworkDevice } from '../../types/network';
import { getDeviceColorClasses, getDeviceIcon } from './helpers';

interface NodeProps {
  device: NetworkDevice;
  zoom: number;
  panOffset: { x: number; y: number };
  onDragStop: (id: string, x: number, y: number) => void;
  onSelect: (device: NetworkDevice, e: React.MouseEvent | React.TouchEvent) => void;
}

const Node: React.FC<NodeProps> = ({ device, zoom, panOffset, onDragStop, onSelect }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const pos = {
    x: (device.x + panOffset.x) * zoom,
    y: (device.y + panOffset.y) * zoom,
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={pos}
      scale={zoom}
      onStop={(_, data) => {
        const newX = data.x / zoom - panOffset.x;
        const newY = data.y / zoom - panOffset.y;
        onDragStop(device.id, newX, newY);
      }}
    >
      <div
        ref={nodeRef}
        className={`absolute rounded-md p-3 shadow-md border cursor-move transition-shadow duration-200 ${getDeviceColorClasses(device)} ${device.status === 'offline' ? 'opacity-60' : ''} hover:shadow-lg`}
        style={{
          transform: 'translate(-50%, -50%)',
          width: 100 * zoom,
          height: 80 * zoom,
          zIndex: device.zIndex + 10,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(device, e);
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <i className={`fas ${getDeviceIcon(device)} text-2xl mb-1`}></i>
          <div className="text-xs text-center font-medium truncate w-full">{device.name}</div>
          <div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white dark:border-gray-800"
            style={{
              backgroundColor:
                device.status === 'online'
                  ? '#10B981'
                  : device.status === 'warning'
                  ? '#F59E0B'
                  : '#EF4444',
            }}
          ></div>
        </div>
      </div>
    </Draggable>
  );
};

export default Node;
