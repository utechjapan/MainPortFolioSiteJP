// components/network-lab/PacketVisualizer.tsx
import React, { useEffect, useState } from 'react';
import { Circle, Arrow } from 'react-konva';
import { PacketJourney, Device, Connection } from '../../types/networkTopology';
import { calculatePortPositions } from '../../utils/networkUtils';

interface PacketVisualizerProps {
  journeys: PacketJourney[];
  devices: Device[];
  connections: Connection[];
}

const PacketVisualizer: React.FC<PacketVisualizerProps> = ({
  journeys,
  devices,
  connections,
}) => {
  const [packets, setPackets] = useState<Array<{
    id: string;
    x: number;
    y: number;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    progress: number;
    color: string;
  }>>([]);
  
  // Animation frame tracking
  const animationRef = React.useRef<number | null>(null);
  
  // Clear animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Start packet animation when journeys change
  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Clear existing packets
    setPackets([]);
    
    if (journeys.length === 0) return;
    
    // Initialize packets based on journeys
    const newPackets: {
      id: string;
      x: number;
      y: number;
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
      progress: number;
      color: string;
    }[] = [];
    
    // Animate each journey
    journeys.forEach((journey, journeyIndex) => {
      if (!journey.path || journey.path.length === 0) return;
      
      journey.path.forEach((step, stepIndex) => {
        // Find source and target devices
        const sourceDevice = devices.find(device => device.id === step.sourceDeviceId);
        const targetDevice = devices.find(device => device.id === step.targetDeviceId);
        
        if (!sourceDevice || !targetDevice) return;
        
        // Calculate port positions
        const sourcePortPositions = calculatePortPositions(sourceDevice);
        const targetPortPositions = calculatePortPositions(targetDevice);
        
        // Find the ports used for this connection
        const connection = connections.find(
          conn => 
            (conn.sourceDeviceId === step.sourceDeviceId && conn.targetDeviceId === step.targetDeviceId) ||
            (conn.sourceDeviceId === step.targetDeviceId && conn.targetDeviceId === step.sourceDeviceId)
        );
        
        if (!connection) return;
        
        // Find port indices
        const sourcePortIndex = sourceDevice.ports.findIndex(port => 
          port.id === (connection.sourceDeviceId === sourceDevice.id ? connection.sourcePortId : connection.targetPortId)
        );
        
        const targetPortIndex = targetDevice.ports.findIndex(port => 
          port.id === (connection.sourceDeviceId === targetDevice.id ? connection.sourcePortId : connection.targetPortId)
        );
        
        if (sourcePortIndex === -1 || targetPortIndex === -1) return;
        
        // Get positions
        const sourcePos = sourcePortPositions[sourcePortIndex] || { x: sourceDevice.x, y: sourceDevice.y };
        const targetPos = targetPortPositions[targetPortIndex] || { x: targetDevice.x, y: targetDevice.y };
        
        // Create a packet with a delay based on step index
        newPackets.push({
          id: `packet-${journeyIndex}-${stepIndex}`,
          x: sourcePos.x,
          y: sourcePos.y,
          sourceX: sourcePos.x,
          sourceY: sourcePos.y,
          targetX: targetPos.x,
          targetY: targetPos.y,
          progress: 0,
          color: journey.success ? '#10B981' : '#EF4444', // Green for success, red for failure
        });
      });
    });
    
    // Set initial packets
    setPackets(newPackets);
    
    let startTime: number | null = null;
    let lastStepTime: number | null = null;
    const animationDuration = 1500; // 1.5 seconds for a full journey
    const stepInterval = 300; // 300ms between starting each step
    
    // Animation function
    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
        lastStepTime = timestamp;
      }
      
      const elapsedSinceStart = timestamp - startTime;
      
      // Update packet positions
      setPackets(prevPackets => 
        prevPackets.map((packet, index) => {
          // Calculate when this packet should start moving (staggered start)
          const packetStartTime = index * stepInterval;
          
          // If it's not time for this packet to start, return as is
          if (elapsedSinceStart < packetStartTime) {
            return packet;
          }
          
          // Calculate progress for this packet
          const packetElapsed = elapsedSinceStart - packetStartTime;
          const progress = Math.min(packetElapsed / animationDuration, 1);
          
          // If packet has reached the target, keep it there
          if (progress >= 1) {
            return {
              ...packet,
              x: packet.targetX,
              y: packet.targetY,
              progress: 1,
            };
          }
          
          // Calculate current position based on progress
          const x = packet.sourceX + (packet.targetX - packet.sourceX) * progress;
          const y = packet.sourceY + (packet.targetY - packet.sourceY) * progress;
          
          return {
            ...packet,
            x,
            y,
            progress,
          };
        })
      );
      
      // Continue animation if not all packets have reached the end
      const allComplete = packets.every(packet => packet.progress >= 1);
      
      if (!allComplete) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Reset everything after a pause
        setTimeout(() => {
          setPackets([]);
        }, 1000);
      }
    };
    
    // Start animation
    if (newPackets.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [journeys, devices, connections]);
  
  // If no packets, don't render anything
  if (packets.length === 0) return null;
  
  return (
    <>
      {/* Draw packet indicators */}
      {packets.map(packet => (
        <Circle
          key={packet.id}
          x={packet.x}
          y={packet.y}
          radius={5}
          fill={packet.color}
          shadowColor={packet.color}
          shadowBlur={10}
          shadowOpacity={0.5}
          perfectDrawEnabled={false}
          listening={false}
        />
      ))}
    </>
  );
};

export default PacketVisualizer;