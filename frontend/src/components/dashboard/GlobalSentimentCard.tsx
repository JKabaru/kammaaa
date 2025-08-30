import React from 'react';
import { motion } from 'framer-motion';
import {
  GlobeAltIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatNumber } from '../../lib/utils';

interface SentimentData {
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  lastUpdate: string;
}

interface GlobalSentimentCardProps {
  data?: SentimentData;
}

const GlobalSentimentCard: React.FC<GlobalSentimentCardProps> = ({ data }) => {
  // Mock data if none provided
  const sentimentData: SentimentData = data || {
    current: 67.8,
    previous: 64.2,
    trend: 'up',
    confidence: 89.3,
    lastUpdate: new Date().toISOString()
  };

  const change = sentimentData.current - sentimentData.previous;
  const changePercent = (change / sentimentData.previous) * 100;

  const getSentimentStatus = (value: number) => {
    if (value >= 70) return { variant: 'success' as const, label: 'Positive', color: 'text-green-400' };
    if (value >= 50) return { variant: 'warning' as const, label: 'Neutral', color: 'text-yellow-400' };
    return { variant: 'error' as const, label: 'Negative', color: 'text-red-400' };
  };

  const status = getSentimentStatus(sentimentData.current);
  const TrendIcon = sentimentData.trend === 'up' ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Card glow className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-ember via-transparent to-radiant-magenta" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-quantum-ember/10 rounded-lg">
              <GlobeAltIcon className="w-8 h-8 text-quantum-ember" />
            </div>
            <div>
              <h3 className="text-lg font-mono uppercase text-text-primary tracking-wider">
                Global Economic Sentiment
              </h3>
              <p className="text-text-secondary text-sm">
                Aggregated across all monitored indicators
              </p>
            </div>
          </div>
          <Badge variant={status.variant} size="md">
            {status.label}
          </Badge>
        </div>

        {/* Main Sentiment Score */}
        <div className="flex items-end space-x-4 mb-6">
          <div>
            <p className="text-4xl font-mono font-bold text-text-primary">
              {formatNumber(sentimentData.current, 1)}
            </p>
            <p className="text-text-secondary text-sm uppercase tracking-wide">
              Sentiment Index
            </p>
          </div>
          
          <div className="flex items-center space-x-2 pb-2">
            <TrendIcon className={`w-5 h-5 ${sentimentData.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
            <span className={`font-mono font-bold ${sentimentData.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {change > 0 ? '+' : ''}{formatNumber(change, 1)}
            </span>
            <span className="text-text-secondary text-sm">
              ({changePercent > 0 ? '+' : ''}{formatNumber(changePercent, 1)}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-secondary text-sm">Sentiment Range</span>
            <span className="text-text-primary font-mono text-sm">
              {formatNumber(sentimentData.current, 1)}/100
            </span>
          </div>
          <div className="w-full bg-deep-void/50 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${sentimentData.current}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-2 rounded-full ${
                sentimentData.current >= 70 ? 'bg-green-400' :
                sentimentData.current >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-text-secondary text-xs uppercase tracking-wide">Confidence</p>
            <p className="text-text-primary font-mono text-lg font-bold">
              {formatNumber(sentimentData.confidence, 1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-text-secondary text-xs uppercase tracking-wide">Trend</p>
            <div className="flex items-center justify-center space-x-1">
              <TrendIcon className={`w-4 h-4 ${sentimentData.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`font-mono text-lg font-bold ${sentimentData.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {sentimentData.trend.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-quantum-ember/20">
          <span className="text-text-secondary text-xs">
            Last updated: {new Date(sentimentData.lastUpdate).toLocaleString()}
          </span>
          <button className="flex items-center space-x-1 text-quantum-ember text-sm font-medium hover:text-quantum-ember/80 transition-colors">
            <span>View Details</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default GlobalSentimentCard;