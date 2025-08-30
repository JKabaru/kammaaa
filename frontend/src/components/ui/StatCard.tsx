import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import Card from './Card';
import Badge from './Badge';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'stable';
  };
  badge?: {
    label: string;
    variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  };
  color?: 'quantum-ember' | 'radiant-magenta' | 'stabilizer-cyan' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  badge,
  color = 'quantum-ember',
  size = 'md',
  className
}) => {
  const colorClasses = {
    'quantum-ember': {
      icon: 'text-quantum-ember',
      bg: 'bg-quantum-ember/10',
      accent: 'text-quantum-ember'
    },
    'radiant-magenta': {
      icon: 'text-radiant-magenta',
      bg: 'bg-radiant-magenta/10',
      accent: 'text-radiant-magenta'
    },
    'stabilizer-cyan': {
      icon: 'text-stabilizer-cyan',
      bg: 'bg-stabilizer-cyan/10',
      accent: 'text-stabilizer-cyan'
    },
    'green': {
      icon: 'text-green-400',
      bg: 'bg-green-400/10',
      accent: 'text-green-400'
    },
    'yellow': {
      icon: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      accent: 'text-yellow-400'
    },
    'red': {
      icon: 'text-red-400',
      bg: 'bg-red-400/10',
      accent: 'text-red-400'
    }
  };

  const sizeClasses = {
    sm: {
      container: 'p-4',
      icon: 'p-2',
      iconSize: 'w-4 h-4',
      value: 'text-lg',
      title: 'text-sm'
    },
    md: {
      container: 'p-6',
      icon: 'p-3',
      iconSize: 'w-6 h-6',
      value: 'text-2xl',
      title: 'text-base'
    },
    lg: {
      container: 'p-8',
      icon: 'p-4',
      iconSize: 'w-8 h-8',
      value: 'text-3xl',
      title: 'text-lg'
    }
  };

  const colorConfig = colorClasses[color];
  const sizeConfig = sizeClasses[size];

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-text-secondary';
    }
  };

  const getTrendSymbol = (direction: string) => {
    switch (direction) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <Card hover glow className={cn(sizeConfig.container, className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            {icon && (
              <div className={cn('rounded-lg', sizeConfig.icon, colorConfig.bg)}>
                <div className={cn(sizeConfig.iconSize, colorConfig.icon)}>
                  {icon}
                </div>
              </div>
            )}
            <div>
              <p className={cn(
                'font-medium text-text-secondary uppercase tracking-wide',
                sizeConfig.title
              )}>
                {title}
              </p>
              {subtitle && (
                <p className="text-text-secondary text-xs mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-end space-x-3">
            <p className={cn(
              'font-mono font-bold text-text-primary',
              sizeConfig.value
            )}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            
            {trend && (
              <div className="flex items-center space-x-1 pb-1">
                <span className={cn('text-sm', getTrendColor(trend.direction))}>
                  {getTrendSymbol(trend.direction)}
                </span>
                <span className={cn('font-mono text-sm font-bold', getTrendColor(trend.direction))}>
                  {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}
                </span>
                <span className="text-text-secondary text-xs">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {badge && (
          <Badge variant={badge.variant} size="sm">
            {badge.label}
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default StatCard;