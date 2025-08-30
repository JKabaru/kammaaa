import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import NotificationComponent from '../ui/Notification';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onClearAll
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-charcoal border-l border-quantum-ember/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-quantum-ember/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BellIcon className="w-5 h-5 text-quantum-ember" />
                  <h3 className="text-lg font-mono uppercase text-text-primary tracking-wider">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <Badge variant="error" size="sm">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<XMarkIcon className="w-4 h-4" />}
                >
                  Close
                </Button>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-deep-void/30 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-quantum-ember text-white' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    filter === 'unread' 
                      ? 'bg-quantum-ember text-white' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex space-x-2 mt-4">
                  {unreadCount > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onMarkAllAsRead}
                      icon={<CheckIcon className="w-3 h-3" />}
                    >
                      Mark All Read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    icon={<TrashIcon className="w-3 h-3" />}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NotificationComponent
                      notification={notification}
                      onMarkAsRead={onMarkAsRead}
                      onDismiss={onDismiss}
                      compact={true}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BellIcon className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
                  <p className="text-text-secondary">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;