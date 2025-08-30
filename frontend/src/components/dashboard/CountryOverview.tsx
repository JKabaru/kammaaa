import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GlobeAltIcon,
  ChartBarIcon,
  TrendingUpIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatNumber, formatDate } from '../../lib/utils';
import type { CountryWithStats } from '../../types';

interface CountryOverviewProps {
  countries: CountryWithStats[];
  onCountrySelect?: (country: CountryWithStats) => void;
}

const CountryOverview: React.FC<CountryOverviewProps> = ({ 
  countries, 
  onCountrySelect 
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(countries[0]?.country_code || '');

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const country = countries.find(c => c.country_code === countryCode);
    if (country && onCountrySelect) {
      onCountrySelect(country);
    }
  };

  const selectedCountryData = countries.find(c => c.country_code === selectedCountry);

  if (!selectedCountryData) {
    return (
      <Card>
        <div className="text-center py-8 text-text-secondary">
          No country data available
        </div>
      </Card>
    );
  }

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy >= 90) return 'success';
    if (accuracy >= 80) return 'warning';
    return 'error';
  };

  return (
    <Card glow>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-mono uppercase text-text-primary tracking-wider">
          Country Overview
        </h3>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="px-3 py-2 bg-charcoal border border-quantum-ember/20 rounded-lg text-text-primary focus:border-quantum-ember focus:ring-2 focus:ring-quantum-ember/20"
        >
          {countries.map(country => (
            <option key={country.country_code} value={country.country_code}>
              {country.country_name}
            </option>
          ))}
        </select>
      </div>

      {/* Country Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-stabilizer-cyan/10 rounded-lg">
          <GlobeAltIcon className="w-8 h-8 text-stabilizer-cyan" />
        </div>
        <div>
          <h4 className="text-xl font-semibold text-text-primary">
            {selectedCountryData.country_name}
          </h4>
          <p className="text-text-secondary">
            {selectedCountryData.country_code} • {selectedCountryData.region}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-deep-void/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="w-4 h-4 text-quantum-ember" />
            <span className="text-text-secondary text-sm">Total Indicators</span>
          </div>
          <p className="text-2xl font-mono font-bold text-text-primary">
            {selectedCountryData.totalIndicators}
          </p>
        </div>

        <div className="bg-deep-void/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUpIcon className="w-4 h-4 text-radiant-magenta" />
            <span className="text-text-secondary text-sm">Forecast Accuracy</span>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-mono font-bold text-text-primary">
              {formatNumber(selectedCountryData.forecastAccuracy, 1)}%
            </p>
            <Badge 
              variant={getAccuracyStatus(selectedCountryData.forecastAccuracy)} 
              size="sm"
            >
              {selectedCountryData.forecastAccuracy >= 90 ? 'Excellent' : 
               selectedCountryData.forecastAccuracy >= 80 ? 'Good' : 'Fair'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3 mb-6">
        <h5 className="text-sm font-medium text-text-primary uppercase tracking-wide">
          Recent Activity
        </h5>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-deep-void/30 rounded-lg">
            <div>
              <p className="text-text-primary text-sm font-medium">GDP Forecast Updated</p>
              <p className="text-text-secondary text-xs">2 hours ago</p>
            </div>
            <Badge variant="success" size="sm">New</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-deep-void/30 rounded-lg">
            <div>
              <p className="text-text-primary text-sm font-medium">CPI Data Ingested</p>
              <p className="text-text-secondary text-xs">5 hours ago</p>
            </div>
            <Badge variant="info" size="sm">Updated</Badge>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-quantum-ember/20">
        <span className="text-text-secondary text-xs">
          Last updated: {formatDate(selectedCountryData.lastUpdated)}
        </span>
        <button className="flex items-center space-x-1 text-quantum-ember text-sm font-medium hover:text-quantum-ember/80 transition-colors">
          <span>View Full Report</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};

export default CountryOverview;