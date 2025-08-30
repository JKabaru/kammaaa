import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { formatDate, getRelativeTime } from '../../lib/utils';

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

interface NotificationProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

const NotificationComponent: React.FC<NotificationProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
  compact = false
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'error': return XCircleIcon;
      case 'info': return InformationCircleIcon;
      default: return BellIcon;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success': return {
        icon: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/20'
      };
      case 'warning': return {
        icon: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/20'
      };
      case 'error': return {
        icon: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/20'
      };
      case 'info': return {
        icon: 'text-stabilizer-cyan',
        bg: 'bg-stabilizer-cyan/10',
        border: 'border-stabilizer-cyan/20'
      };
      default: return {
        icon: 'text-quantum-ember',
        bg: 'bg-quantum-ember/10',
        border: 'border-quantum-ember/20'
      };
    }
  };

  const Icon = getIcon(notification.type);
  const colors = getColors(notification.type);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center space-x-3 p-3 rounded-lg border ${colors.border} ${colors.bg} ${
          !notification.read ? 'ring-1 ring-quantum-ember/20' : ''
        }`}
      >
        <Icon className={`w-4 h-4 ${colors.icon} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-text-primary font-medium text-sm truncate">
            {notification.title}
          </p>
          <p className="text-text-secondary text-xs">
            {getRelativeTime(notification.timestamp)}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-quantum-ember rounded-full flex-shrink-0" />
        )}
      </motion.div>
    );
  }

  return (
    <Card className={`${!notification.read ? 'ring-1 ring-quantum-ember/20' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-text-primary font-medium">
              {notification.title}
            </h4>
            <div className="flex items-center space-x-2">
              {!notification.read && (
                <Badge variant="info" size="sm">New</Badge>
              )}
              <span className="text-text-secondary text-xs">
                {getRelativeTime(notification.timestamp)}
              </span>
            </div>
          </div>
          
          <p className="text-text-secondary text-sm mb-3">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {notification.actionLabel && notification.onAction && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={notification.onAction}
                >
                  {notification.actionLabel}
                </Button>
              )}
              {!notification.read && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              )}
            </div>
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(notification.id)}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationComponent;