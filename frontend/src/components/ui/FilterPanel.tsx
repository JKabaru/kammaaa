import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  TagIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import Button from './Button';
import Badge from './Badge';
import Card from './Card';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  options: FilterOption[];
  multiple?: boolean;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filterGroups: FilterGroup[];
  activeFilters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
  onClearAll: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filterGroups,
  activeFilters,
  onFiltersChange,
  onClearAll
}) => {
  const [localFilters, setLocalFilters] = useState(activeFilters);

  const handleFilterChange = (groupKey: string, value: string, checked: boolean) => {
    const group = filterGroups.find(g => g.key === groupKey);
    if (!group) return;

    setLocalFilters(prev => {
      const currentValues = prev[groupKey] || [];
      
      if (group.multiple) {
        if (checked) {
          return { ...prev, [groupKey]: [...currentValues, value] };
        } else {
          return { ...prev, [groupKey]: currentValues.filter(v => v !== value) };
        }
      } else {
        return { ...prev, [groupKey]: checked ? [value] : [] };
      }
    });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onClearAll();
  };

  const totalActiveFilters = Object.values(localFilters).flat().length;

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
            className="fixed right-0 top-0 h-full w-80 bg-charcoal border-l border-quantum-ember/20 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-5 h-5 text-quantum-ember" />
                  <h3 className="text-lg font-mono uppercase text-text-primary tracking-wider">
                    Filters
                  </h3>
                  {totalActiveFilters > 0 && (
                    <Badge variant="info" size="sm">
                      {totalActiveFilters}
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

              {/* Filter Groups */}
              <div className="space-y-6">
                {filterGroups.map((group) => {
                  const Icon = group.icon;
                  const activeValues = localFilters[group.key] || [];

                  return (
                    <div key={group.key}>
                      <div className="flex items-center space-x-2 mb-3">
                        <Icon className="w-4 h-4 text-quantum-ember" />
                        <h4 className="text-sm font-medium text-text-primary uppercase tracking-wide">
                          {group.label}
                        </h4>
                      </div>
                      
                      <div className="space-y-2">
                        {group.options.map((option) => {
                          const isActive = activeValues.includes(option.value);
                          
                          return (
                            <label
                              key={option.value}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-deep-void/30 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type={group.multiple ? 'checkbox' : 'radio'}
                                  name={group.key}
                                  checked={isActive}
                                  onChange={(e) => handleFilterChange(group.key, option.value, e.target.checked)}
                                  className="w-4 h-4 text-quantum-ember bg-charcoal border-quantum-ember/20 rounded focus:ring-quantum-ember focus:ring-2"
                                />
                                <span className="text-text-primary text-sm">
                                  {option.label}
                                </span>
                              </div>
                              {option.count && (
                                <Badge variant="default" size="sm">
                                  {option.count}
                                </Badge>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-quantum-ember/20 space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleApply}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleReset}
                >
                  Clear All
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;