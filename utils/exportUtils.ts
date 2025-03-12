// utils/exportUtils.ts
import { jsPDF } from 'jspdf';
import { Device, Connection, VlanDefinition } from '../types/networkTopology';

// Export topology as JSON
export const getExportTopologyAsJSON = (
  devices: Device[],
  connections: Connection[],
  vlans: VlanDefinition[]
) => {
  // Create a copy to avoid modifying the original objects
  const exportData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    devices: JSON.parse(JSON.stringify(devices)),
    connections: JSON.parse(JSON.stringify(connections)),
    vlans: JSON.parse(JSON.stringify(vlans)),
  };
  
  return exportData;
};

// Export topology to PDF
export const exportToPdf = async (
  devices: Device[],
  connections: Connection[],
  dataUrl: string,
  filename: string = 'network-topology.pdf'
) => {
  try {
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    
    // Set title
    doc.setFontSize(18);
    doc.text('Network Topology Diagram', 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add topology image
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const imageWidth = pageWidth - (2 * margin);
    const imageHeight = 100; // Adjust as needed
    
    doc.addImage(dataUrl, 'PNG', margin, 40, imageWidth, imageHeight);
    
    // Add device inventory
    const deviceYPos = imageHeight + 50;
    
    doc.setFontSize(14);
    doc.text('Device Inventory', 14, deviceYPos);
    
    doc.setFontSize(10);
    let y = deviceYPos + 10;
    
    const columns = 2; // Two columns for devices
    const columnWidth = (pageWidth - (2 * margin)) / columns;
    
    devices.forEach((device, index) => {
      const col = Math.floor(index / Math.ceil(devices.length / columns));
      const x = margin + (col * columnWidth);
      
      if (col === 0) {
        // Only increment y for the first column
        y += 8;
      }
      
      if (y > pageHeight - margin) {
        // Add new page if we've reached the bottom
        doc.addPage();
        y = margin + 10;
      }
      
      // Device details
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${device.name} (${device.type})`, x, y);
      doc.setFont('helvetica', 'normal');
      
      // Device IP addresses
      if (device.config.interfaces && device.config.interfaces.length > 0) {
        device.config.interfaces.forEach((iface, ifaceIndex) => {
          if (iface.ipAddress) {
            y += 5;
            doc.text(`IP: ${iface.ipAddress}${iface.subnetMask ? '/' + iface.subnetMask : ''}`, x + 5, y);
          }
        });
      }
    });
    
    // Add connections inventory
    y += 15;
    
    if (y > pageHeight - margin) {
      // Add new page if we've reached the bottom
      doc.addPage();
      y = margin + 10;
    }
    
    doc.setFontSize(14);
    doc.text('Connection Inventory', 14, y);
    
    doc.setFontSize(10);
    y += 10;
    
    connections.forEach((connection, index) => {
      const sourceDevice = devices.find(d => d.id === connection.sourceDeviceId);
      const targetDevice = devices.find(d => d.id === connection.targetDeviceId);
      
      if (sourceDevice && targetDevice) {
        const sourcePort = sourceDevice.ports.find(p => p.id === connection.sourcePortId);
        const targetPort = targetDevice.ports.find(p => p.id === connection.targetPortId);
        
        if (sourcePort && targetPort) {
          y += 5;
          
          if (y > pageHeight - margin) {
            // Add new page if we've reached the bottom
            doc.addPage();
            y = margin + 10;
          }
          
          doc.text(
            `${index + 1}. ${sourceDevice.name} (${sourcePort.name}) → ${targetDevice.name} (${targetPort.name}) - ${connection.type}`,
            margin,
            y
          );
        }
      }
    });
    
    // Save PDF
    doc.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};