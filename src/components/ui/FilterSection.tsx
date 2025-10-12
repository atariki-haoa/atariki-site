import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaFilter } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

interface FilterSectionProps {
  categories: Array<{ value: string; label: string }>;
  statuses: Array<{ value: string; label: string }>;
  selectedCategory: string;
  selectedStatus: string;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  filteredCount: number;
  totalCount: number;
  delay?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  categories,
  statuses,
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  filteredCount,
  totalCount,
  delay = 0
}) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            heading: 'Filtros',
            category: 'Categoría',
            status: 'Estado',
            results: `Mostrando ${filteredCount} de ${totalCount} proyectos`,
          }
        : {
            heading: 'Filters',
            category: 'Category',
            status: 'Status',
            results: `Showing ${filteredCount} of ${totalCount} projects`,
          },
    [filteredCount, isSpanish, totalCount]
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
    >
      <div className="flex items-center mb-4">
        <FaFilter className="text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-200">{copy.heading}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">{copy.category}</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          >
            {categories.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">{copy.status}</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          >
            {statuses.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">{copy.results}</div>
    </motion.div>
  );
};

export default FilterSection;
