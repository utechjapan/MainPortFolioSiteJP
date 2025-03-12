// components/network-lab/ManageVlansModal.tsx
import React, { useState, useEffect } from 'react';
import { VlanDefinition } from '../../types/networkTopology';

interface ManageVlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  vlans: VlanDefinition[];
  onUpdate: (updatedVlans: VlanDefinition[]) => void;
}

const ManageVlansModal: React.FC<ManageVlansModalProps> = ({
  isOpen,
  onClose,
  vlans,
  onUpdate,
}) => {
  const [editedVlans, setEditedVlans] = useState<VlanDefinition[]>([]);
  const [newVlanName, setNewVlanName] = useState('');
  const [newVlanColor, setNewVlanColor] = useState('#3B82F6'); // Default blue
  
  // Initialize edited vlans when props change
  useEffect(() => {
    setEditedVlans([...vlans]);
  }, [vlans, isOpen]);
  
  if (!isOpen) return null;
  
  // Handle VLAN update
  const handleNameChange = (id: number, name: string) => {
    setEditedVlans(
      editedVlans.map(vlan => 
        vlan.id === id ? { ...vlan, name } : vlan
      )
    );
  };
  
  // Handle color change
  const handleColorChange = (id: number, color: string) => {
    setEditedVlans(
      editedVlans.map(vlan => 
        vlan.id === id ? { ...vlan, color } : vlan
      )
    );
  };
  
  // Handle VLAN deletion
  const handleDeleteVlan = (id: number) => {
    // Don't allow deleting the default VLAN (ID 1)
    if (id === 1) return;
    
    setEditedVlans(editedVlans.filter(vlan => vlan.id !== id));
  };
  
  // Handle adding a new VLAN
  const handleAddVlan = () => {
    if (!newVlanName.trim()) return;
    
    // Generate a new unique ID
    const maxId = Math.max(...editedVlans.map(vlan => vlan.id), 0);
    const newId = maxId + 1;
    
    setEditedVlans([
      ...editedVlans,
      {
        id: newId,
        name: newVlanName,
        color: newVlanColor,
      },
    ]);
    
    // Reset form
    setNewVlanName('');
    setNewVlanColor('#3B82F6');
  };
  
  // Handle saving changes
  const handleSave = () => {
    onUpdate(editedVlans);
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Manage VLANs
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create, edit, or delete VLAN definitions that can be assigned to switch ports.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              {/* Existing VLANs */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current VLANs
                </h4>
                <div className="overflow-y-auto max-h-64 border border-gray-300 dark:border-gray-700 rounded-md">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Color
                        </th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-300 dark:divide-gray-700">
                      {editedVlans.map((vlan) => (
                        <tr key={vlan.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {vlan.id}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              value={vlan.name}
                              onChange={(e) => handleNameChange(vlan.id, e.target.value)}
                              className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              disabled={vlan.id === 1} // Don't allow editing default VLAN name
                            />
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={vlan.color}
                                onChange={(e) => handleColorChange(vlan.id, e.target.value)}
                                className="h-6 w-6 border-0 bg-transparent p-0"
                              />
                              <span className="text-gray-600 dark:text-gray-400">{vlan.color}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteVlan(vlan.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              disabled={vlan.id === 1} // Don't allow deleting default VLAN
                            >
                              {vlan.id === 1 ? (
                                <span className="text-gray-400 dark:text-gray-600" title="Default VLAN cannot be deleted">
                                  Delete
                                </span>
                              ) : (
                                <span>Delete</span>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Add new VLAN */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add New VLAN
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newVlanName}
                    onChange={(e) => setNewVlanName(e.target.value)}
                    placeholder="VLAN Name"
                    className="flex-grow rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <div className="flex items-center space-x-1">
                    <input
                      type="color"
                      value={newVlanColor}
                      onChange={(e) => setNewVlanColor(e.target.value)}
                      className="h-8 w-8 border-0 bg-transparent p-0"
                    />
                  </div>
                  <button
                    onClick={handleAddVlan}
                    disabled={!newVlanName.trim()}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Add VLAN
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageVlansModal;