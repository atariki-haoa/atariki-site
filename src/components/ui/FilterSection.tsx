import React from 'react';
import { motion } from 'framer-motion';
import { FaFilter } from 'react-icons/fa';

interface FilterSectionProps {
  categories: string[];
  statuses: string[];
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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
    >
      <div className="flex items-center mb-4">
        <FaFilter className="text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-200">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Categoría</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-2">Estado</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'Todos los estados' : status}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        Mostrando {filteredCount} de {totalCount} proyectos
      </div>
    </motion.div>
  );
};

export default FilterSection;
