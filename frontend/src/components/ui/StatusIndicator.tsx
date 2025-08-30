import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'pending' | 'info';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  animated = true,
  className
}) => {
  const statusConfig = {
    success: {
      icon: CheckCircleIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20'
    },
    error: {
      icon: XCircleIcon,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20'
    },
    pending: {
      icon: ClockIcon,
      color: 'text-stabilizer-cyan',
      bgColor: 'bg-stabilizer-cyan/10',
      borderColor: 'border-stabilizer-cyan/20'
    },
    info: {
      icon: CheckCircleIcon,
      color: 'text-quantum-ember',
      bgColor: 'bg-quantum-ember/10',
      borderColor: 'border-quantum-ember/20'
    }
  };

  const sizes = {
    sm: {
      container: 'p-1.5',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    md: {
      container: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      container: 'p-3',
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  const config = statusConfig[status];
  const sizeConfig = sizes[size];
  const Icon = config.icon;

  const iconElement = (
    <Icon className={cn(sizeConfig.icon, config.color)} />
  );

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <motion.div
        animate={animated && status === 'pending' ? { 
          scale: [1, 1.1, 1],
          opacity: [1, 0.7, 1]
        } : {}}
        transition={animated ? { 
          duration: 2, 
          repeat: Infinity,
          ease: 'easeInOut'
        } : {}}
        className={cn(
          'rounded-full border',
          sizeConfig.container,
          config.bgColor,
          config.borderColor
        )}
      >
        {animated && status === 'pending' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {iconElement}
          </motion.div>
        ) : (
          iconElement
        )}
      </motion.div>
      
      {label && (
        <span className={cn('font-medium', config.color, sizeConfig.text)}>
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;