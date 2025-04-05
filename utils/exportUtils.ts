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
): Promise<boolean> => {
  try {
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    
    // Set title
    doc.setFontSize(18);
    doc.text('ネットワークトポロジー図', 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`生成日時: ${new Date().toLocaleString()}`, 14, 30);
    
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
    doc.text('デバイス一覧', 14, deviceYPos);
    
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
            doc.text(`IP: ${iface.ipAddress}${iface.subnetMask ? '/' + subnetMaskToCidr(iface.subnetMask) : ''}`, x + 5, y);
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
    doc.text('接続一覧', 14, y);
    
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

// Helper function: convert subnet mask to CIDR notation
const subnetMaskToCidr = (subnetMask: string): number => {
  try {
    // Split the subnet mask into its octets
    const octets = subnetMask.split('.').map(octet => parseInt(octet, 10));
    
    // Check if the subnet mask is valid
    if (octets.length !== 4 || octets.some(octet => isNaN(octet) || octet < 0 || octet > 255)) {
      throw new Error('Invalid subnet mask');
    }
    
    // Convert each octet to binary and count the number of 1s
    let count = 0;
    for (const octet of octets) {
      // Convert to binary string
      const binary = octet.toString(2);
      // Count the number of 1s
      count += binary.split('').filter(bit => bit === '1').length;
    }
    
    return count;
  } catch (error) {
    console.error('Error converting subnet mask to CIDR:', error);
    return 24; // Default to /24 if there's an error
  }
};

// Export network configuration to CSV
export const exportToCSV = (
  devices: Device[],
  connections: Connection[],
  vlans: VlanDefinition[],
  filename: string = 'network-config.csv'
): boolean => {
  try {
    // Generate CSV content
    let csvContent = "デバイス名,タイプ,ホスト名,IPアドレス,サブネットマスク,ゲートウェイ,VLAN,ポート\n";
    
    // Add device information
    devices.forEach(device => {
      let baseInfo = `"${device.name}","${device.type}","${device.config.hostname || ''}",`;
      
      if (device.config.interfaces && device.config.interfaces.length > 0) {
        device.config.interfaces.forEach((iface, index) => {
          let row = baseInfo;
          row += `"${iface.ipAddress || ''}","${iface.subnetMask || ''}","${device.config.gateway || ''}",`;
          
          // Add VLAN info
          const portVlans = device.ports
            .filter(p => p.vlanId)
            .map(p => `${p.name}:VLAN${p.vlanId}`)
            .join('; ');
          
          row += `"${portVlans}",`;
          
          // Add port info
          const ports = device.ports.map(p => p.name).join(', ');
          row += `"${ports}"`;
          
          csvContent += row + "\n";
        });
      } else {
        // Device without interfaces
        csvContent += `${baseInfo}"","","","","${device.ports.map(p => p.name).join(', ')}"\n`;
      }
    });
    
    // Add VLAN information
    csvContent += "\n\nVLAN ID,名前,色\n";
    vlans.forEach(vlan => {
      csvContent += `${vlan.id},"${vlan.name}","${vlan.color}"\n`;
    });
    
    // Add connection information
    csvContent += "\n\n接続元デバイス,接続元ポート,接続先デバイス,接続先ポート,ステータス,タイプ,帯域幅\n";
    connections.forEach(conn => {
      const sourceDevice = devices.find(d => d.id === conn.sourceDeviceId);
      const targetDevice = devices.find(d => d.id === conn.targetDeviceId);
      
      if (sourceDevice && targetDevice) {
        const sourcePort = sourceDevice.ports.find(p => p.id === conn.sourcePortId);
        const targetPort = targetDevice.ports.find(p => p.id === conn.targetPortId);
        
        if (sourcePort && targetPort) {
          csvContent += `"${sourceDevice.name}","${sourcePort.name}","${targetDevice.name}","${targetPort.name}","${conn.status}","${conn.type}","${conn.bandwidth || ''}"\n`;
        }
      }
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};