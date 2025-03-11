// components/labs/Region.tsx
import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Location } from '../../types/network';

interface RegionProps {
  region: Location;
  zoom: number;
  panOffset: { x: number; y: number };
  onUpdate: (id: string, changes: Partial<Location>) => void;
  onDelete: (id: string) => void;
}

const Region: React.FC<RegionProps> = ({ region, zoom, panOffset, onUpdate, onDelete }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const style = {
    left: (region.x + panOffset.x) * zoom,
    top: (region.y + panOffset.y) * zoom,
    width: region.width * zoom,
    height: region.height * zoom,
    backgroundColor: region.color,
    borderColor: region.color.replace('0.2', '0.4'),
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: style.left, y: style.top }}
      scale={zoom}
      onStop={(_, data) => {
        const newX = data.x / zoom - panOffset.x;
        const newY = data.y / zoom - panOffset.y;
        onUpdate(region.id, { x: newX, y: newY });
      }}
    >
      <div ref={nodeRef} className="absolute">
        <ResizableBox
          width={style.width}
          height={style.height}
          minConstraints={[50, 50]}
          onResizeStop={(_, { size }) => {
            onUpdate(region.id, { width: size.width / zoom, height: size.height / zoom });
          }}
          handle={<span className="custom-handle" />}
        >
          <div className="w-full h-full border-2 border-dashed rounded-md relative" style={{ backgroundColor: style.backgroundColor, borderColor: style.borderColor }}>
            <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded bg-white dark:bg-gray-800 bg-opacity-70">
              {region.name}
            </div>
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
              onClick={() => onDelete(region.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
};

export default Region;
