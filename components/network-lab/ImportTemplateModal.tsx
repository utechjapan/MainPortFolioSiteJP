// components/network-lab/ImportTemplateModal.tsx
import React, { useState } from 'react';
import { DeviceTemplate, Position } from '../../types/networkTopology';

interface ImportTemplateModalProps {
  isOpen: boolean;
  templates: DeviceTemplate[];
  onClose: () => void;
  onImport: (templates: DeviceTemplate[], position: Position) => void;
}

const ImportTemplateModal: React.FC<ImportTemplateModalProps> = ({
  isOpen,
  templates,
  onClose,
  onImport,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [position, setPosition] = useState<Position>({ x: 100, y: 100 });

  if (!isOpen) return null;

  // Group templates by category
  const templateCategories: { [key: string]: DeviceTemplate[] } = {};
  templates.forEach(template => {
    if (!templateCategories[template.category || '未分類']) {
      templateCategories[template.category || '未分類'] = [];
    }
    templateCategories[template.category || '未分類'].push(template);
  });

  // Filter templates based on search query
  const filteredTemplates = Object.entries(templateCategories).reduce(
    (acc, [category, templates]) => {
      const filtered = templates.filter(
        template => 
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      
      return acc;
    },
    {} as { [key: string]: DeviceTemplate[] }
  );

  // Get selected template group
  const getSelectedTemplateGroup = (): DeviceTemplate[] => {
    if (!selectedTemplate) return [];
    
    // If it's a category, return all templates in that category
    if (templateCategories[selectedTemplate]) {
      return templateCategories[selectedTemplate];
    }
    
    // Otherwise, find the individual template
    for (const category in templateCategories) {
      const template = templateCategories[category].find(t => t.id === selectedTemplate);
      if (template) {
        return [template];
      }
    }
    
    return [];
  };

  // Handle import
  const handleImport = () => {
    const selectedTemplates = getSelectedTemplateGroup();
    if (selectedTemplates.length > 0) {
      onImport(selectedTemplates, position);
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  テンプレートを選択
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    インポートするデバイステンプレートを選択してください。グループテンプレートは複数のデバイスを一度にインポートします。
                  </p>
                </div>
              </div>
            </div>
            
            {/* Search input */}
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="テンプレートを検索..."
                  className="block w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Template selector */}
            <div className="mt-4 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-md">
              <div className="divide-y divide-gray-300 dark:divide-gray-700">
                {Object.keys(filteredTemplates).length > 0 ? (
                  Object.entries(filteredTemplates).map(([category, templates]) => (
                    <div key={category} className="py-2">
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {category}
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {templates.map((template) => (
                          <div 
                            key={template.id} 
                            className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                              selectedTemplate === template.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded">
                                <i className={`fas fa-${template.icon || 'cube'} text-gray-600 dark:text-gray-400`}></i>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {template.name}
                                </div>
                                {template.description && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {template.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <input
                              type="radio"
                              checked={selectedTemplate === template.id}
                              onChange={() => setSelectedTemplate(template.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    検索条件に一致するテンプレートが見つかりません
                  </div>
                )}
              </div>
            </div>
            
            {/* Position selector */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  X座標
                </label>
                <input
                  type="number"
                  value={position.x}
                  onChange={(e) => setPosition({ ...position, x: parseInt(e.target.value) })}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Y座標
                </label>
                <input
                  type="number"
                  value={position.y}
                  onChange={(e) => setPosition({ ...position, y: parseInt(e.target.value) })}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleImport}
              disabled={!selectedTemplate}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-300 disabled:cursor-not-allowed dark:disabled:bg-blue-900"
            >
              インポート
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportTemplateModal;