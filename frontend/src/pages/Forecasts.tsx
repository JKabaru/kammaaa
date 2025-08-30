import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  FunnelIcon,
  PlusIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';
import Header from '../components/navigation/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SearchInput from '../components/ui/SearchInput';
import ForecastForm from '../components/forms/ForecastForm';
import ForecastChart from '../components/charts/ForecastChart';
import { useForecasts } from '../hooks/useData';
import { formatNumber, formatDate } from '../lib/utils';
import type { ChartDataPoint } from '../types';

const Forecasts: React.FC = () => {
  const { forecasts, loading, error } = useForecasts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHorizon, setSelectedHorizon] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  const handleAddForecast = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    // In a real app, you'd refresh the data here
    console.log('Forecast generated successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        Error loading forecasts: {error}
      </div>
    );
  }

  const filteredForecasts = forecasts.filter(forecast => {
    const matchesSearch = forecast.indicator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         forecast.country_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHorizon = selectedHorizon === 'all' || forecast.forecast_horizon === selectedHorizon;
    const matchesCountry = selectedCountry === 'all' || forecast.country_code === selectedCountry;
    return matchesSearch && matchesHorizon && matchesCountry;
  });

  const countries = Array.from(new Set(forecasts.map(f => f.country_code)));
  const horizons = Array.from(new Set(forecasts.map(f => f.forecast_horizon)));

  // Transform data for chart
  const chartData: ChartDataPoint[] = filteredForecasts.slice(0, 20).map(forecast => ({
    date: forecast.forecast_date,
    value: forecast.forecast_value,
    forecast: forecast.forecast_value,
    confidence_lower: forecast.confidence_interval_lower || undefined,
    confidence_upper: forecast.confidence_interval_upper || undefined
  }));

  const getTrendDirection = (value: number) => {
    return value > 0 ? 'up' : value < 0 ? 'down' : 'stable';
  };

  const getTrendIcon = (value: number) => {
    const trend = getTrendDirection(value);
    switch (trend) {
      case 'up': return <TrendingUpIcon className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDownIcon className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 bg-text-secondary rounded-full" />;
    }
  };

  const getTrendColor = (value: number) => {
    const trend = getTrendDirection(value);
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Forecasts" 
        subtitle="Economic forecasts and predictive analytics across all indicators"
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search forecasts by indicator or country..."
                onSearch={setSearchQuery}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              
              <select
                value={selectedHorizon}
                onChange={(e) => setSelectedHorizon(e.target.value)}
                className="px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
              >
                <option value="all">All Horizons</option>
                {horizons.map(horizon => (
                  <option key={horizon} value={horizon}>{horizon}</option>
                ))}
              </select>

              <Button variant="secondary" icon={<FunnelIcon className="w-4 h-4" />}>
                Filters
              </Button>
              
              <Button 
                variant="primary" 
                icon={<PlusIcon className="w-4 h-4" />}
                onClick={handleAddForecast}
              >
                Generate Forecast
              </Button>
            </div>
          </div>
        </Card>

        {/* Chart Overview */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-charcoal border border-quantum-ember/20 rounded-xl p-6">
              <ForecastChart 
                data={chartData}
                title="Forecast Trends Overview"
                showConfidenceInterval={true}
              />
            </div>
          </motion.div>
        )}

        {/* Forecasts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredForecasts.map((forecast, index) => (
            <motion.div
              key={forecast.forecast_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover glow>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-radiant-magenta/10 rounded-lg">
                      <ChartBarIcon className="w-6 h-6 text-radiant-magenta" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {forecast.indicator_name}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {forecast.country_name} ({forecast.country_code})
                      </p>
                    </div>
                  </div>
                  <Badge variant="info" size="sm">
                    {forecast.forecast_horizon}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Forecast Value</span>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(forecast.forecast_value)}
                      <span className={`font-mono font-bold ${getTrendColor(forecast.forecast_value)}`}>
                        {formatNumber(forecast.forecast_value, 2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Confidence Range</span>
                    <span className="text-text-primary font-mono text-sm">
                      {forecast.confidence_interval_lower ? 
                        `${formatNumber(forecast.confidence_interval_lower, 1)} - ${formatNumber(forecast.confidence_interval_upper || 0, 1)}` 
                        : 'N/A'
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Model</span>
                    <Badge variant="default" size="sm">
                      {forecast.model_name}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Forecast Date</span>
                    <span className="text-text-primary font-mono text-sm">
                      {formatDate(forecast.forecast_date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Accuracy Score</span>
                    <span className="text-text-primary font-mono">
                      {forecast.accuracy_score.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-quantum-ember/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">
                      Generated {formatDate(forecast.created_at)}
                    </span>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredForecasts.length === 0 && (
          <div className="text-center py-12">
            <ChartBarIcon className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No forecasts found matching your criteria</p>
            <Button 
              variant="primary" 
              className="mt-4"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={handleAddForecast}
            >
              Generate Your First Forecast
            </Button>
          </div>
        )}
      </div>

      <ForecastForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default Forecasts;