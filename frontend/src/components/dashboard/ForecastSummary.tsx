import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatNumber, getRelativeTime } from '../../lib/utils';
import type { ForecastWithDetails } from '../../types';

interface ForecastSummaryProps {
  forecasts: ForecastWithDetails[];
  title?: string;
}

const ForecastSummary: React.FC<ForecastSummaryProps> = ({ 
  forecasts, 
  title = 'Recent Forecasts' 
}) => {
  const recentForecasts = forecasts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const totalForecasts = forecasts.length;
  const successfulForecasts = forecasts.filter(f => f.accuracy_score > 80).length;
  const averageAccuracy = forecasts.reduce((sum, f) => sum + f.accuracy_score, 0) / forecasts.length;

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy >= 90) return { variant: 'success' as const, icon: CheckCircleIcon, color: 'text-green-400' };
    if (accuracy >= 80) return { variant: 'warning' as const, icon: ExclamationTriangleIcon, color: 'text-yellow-400' };
    return { variant: 'error' as const, icon: ExclamationTriangleIcon, color: 'text-red-400' };
  };

  const getForecastTrend = (value: number) => {
    if (value > 0) return { color: 'text-green-400', symbol: '+' };
    if (value < 0) return { color: 'text-red-400', symbol: '' };
    return { color: 'text-text-secondary', symbol: '' };
  };

  return (
    <Card glow>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-mono uppercase text-text-primary tracking-wider">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <Badge variant="info" size="sm">
            {totalForecasts} total
          </Badge>
          <Badge variant="success" size="sm">
            {successfulForecasts} accurate
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-text-secondary text-xs uppercase tracking-wide">Total</p>
          <p className="text-text-primary font-mono text-lg font-bold">{totalForecasts}</p>
        </div>
        <div className="text-center">
          <p className="text-text-secondary text-xs uppercase tracking-wide">Avg Accuracy</p>
          <p className="text-text-primary font-mono text-lg font-bold">
            {formatNumber(averageAccuracy, 1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-text-secondary text-xs uppercase tracking-wide">Success Rate</p>
          <p className="text-text-primary font-mono text-lg font-bold">
            {formatNumber((successfulForecasts / totalForecasts) * 100, 1)}%
          </p>
        </div>
      </div>

      {/* Recent Forecasts List */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-text-primary uppercase tracking-wide">
          Latest Forecasts
        </h5>
        
        {recentForecasts.map((forecast, index) => {
          const status = getAccuracyStatus(forecast.accuracy_score);
          const trend = getForecastTrend(forecast.forecast_value);
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={forecast.forecast_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-deep-void/30 rounded-lg hover:bg-deep-void/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-quantum-ember/10 rounded-lg">
                  <ChartBarIcon className="w-4 h-4 text-quantum-ember" />
                </div>
                <div>
                  <p className="text-text-primary font-medium text-sm">
                    {forecast.indicator_name}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {forecast.country_name} • {forecast.forecast_horizon}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`font-mono font-bold text-sm ${trend.color}`}>
                    {trend.symbol}{formatNumber(forecast.forecast_value, 1)}
                  </span>
                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                </div>
                <p className="text-text-secondary text-xs">
                  {getRelativeTime(forecast.created_at)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {recentForecasts.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <ChartBarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No forecasts available</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-quantum-ember/20">
        <button className="flex items-center space-x-1 text-quantum-ember text-sm font-medium hover:text-quantum-ember/80 transition-colors">
          <span>View All Forecasts</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};

export default ForecastSummary;