// components/labs/Connection.tsx
import React from 'react';
import { Connection } from '../../types/network';
import { getConnectionColor, getConnectionLineStyle } from './helpers';

interface ConnectionProps {
  connection: Connection;
  zoom: number;
  panOffset: { x: number; y: number };
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  onSelect: (conn: Connection, e: React.MouseEvent) => void;
}

const ConnectionComponent: React.FC<ConnectionProps> = ({
  connection,
  zoom,
  panOffset,
  x1,
  y1,
  x2,
  y2,
  onSelect,
}) => {
  const lineColor = getConnectionColor(connection);
  const lineStyle = getConnectionLineStyle(connection);
  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <line
        x1={(x1 + panOffset.x) * zoom}
        y1={(y1 + panOffset.y) * zoom}
        x2={(x2 + panOffset.x) * zoom}
        y2={(y2 + panOffset.y) * zoom}
        stroke={lineColor}
        strokeWidth={2}
        strokeDasharray={lineStyle}
        className="cursor-pointer"
        style={{ pointerEvents: 'stroke' }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(connection, e);
        }}
      />
      {connection.type === 'vpn' && (
        <text
          x={((x1 + x2) / 2 + panOffset.x) * zoom}
          y={((y1 + y2) / 2 + panOffset.y - 10) * zoom}
          textAnchor="middle"
          fill={lineColor}
          className="text-xs font-medium select-none"
        >
          VPN
        </text>
      )}
    </svg>
  );
};

export default ConnectionComponent;
