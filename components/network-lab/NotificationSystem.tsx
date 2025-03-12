// components/network-lab/NotificationSystem.tsx
import React, { useEffect, useState } from 'react';
import { Notification } from '../../types/networkTopology';

interface NotificationSystemProps {
  notifications: Notification[];
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
}) => {
  // Track which notifications are visible to animate them properly
  const [visibleIds, setVisibleIds] = useState<string[]>([]);
  
  // Update visible IDs when notifications change
  useEffect(() => {
    // Add new notifications to visible IDs
    const newIds = notifications
      .filter(notification => !visibleIds.includes(notification.id))
      .map(notification => notification.id);
      
    if (newIds.length > 0) {
      setVisibleIds(prev => [...prev, ...newIds]);
    }
    
    // Clean up removed notifications after animation
    const currentIds = notifications.map(notification => notification.id);
    const removedIds = visibleIds.filter(id => !currentIds.includes(id));
    
    if (removedIds.length > 0) {
      // Wait for exit animation to complete
      setTimeout(() => {
        setVisibleIds(prev => prev.filter(id => !removedIds.includes(id)));
      }, 500);
    }
  }, [notifications, visibleIds]);

  // Get the icon for a notification based on its type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Get the background color for a notification based on its type
  const getNotificationBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      {notifications.map(notification => {
        const isVisible = visibleIds.includes(notification.id);
        const bgColor = getNotificationBgColor(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`transform transition-all duration-300 ease-in-out ${
              isVisible
                ? 'translate-x-0 opacity-100 max-h-40'
                : 'translate-x-full opacity-0 max-h-0'
            } overflow-hidden`}
          >
            <div className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border ${bgColor}`}>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {notification.title || notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSystem;