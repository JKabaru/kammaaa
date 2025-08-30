import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  variant = 'default',
  size = 'md',
  animated = true,
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const variants = {
    default: 'bg-quantum-ember',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const getVariantByValue = (val: number) => {
    if (val >= 80) return 'success';
    if (val >= 60) return 'warning';
    if (val >= 40) return 'default';
    return 'error';
  };

  const autoVariant = variant === 'default' ? getVariantByValue(percentage) : variant;

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-text-secondary text-sm font-medium">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-text-primary font-mono text-sm">
              {value.toFixed(1)}{max === 100 ? '%' : `/${max}`}
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full bg-deep-void/50 rounded-full overflow-hidden',
        sizes[size]
      )}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { 
            duration: 1, 
            ease: 'easeOut',
            delay: 0.2
          } : {}}
          className={cn(
            'h-full rounded-full transition-colors duration-300',
            variants[autoVariant]
          )}
        />
      </div>
    </div>
  );
};

export default ProgressBar;