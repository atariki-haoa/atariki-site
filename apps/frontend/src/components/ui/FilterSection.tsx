import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
  delay = 0,
}) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const copy = useMemo(
    () =>
      isSpanish
        ? { results: `Mostrando ${filteredCount} de ${totalCount} proyectos` }
        : { results: `Showing ${filteredCount} of ${totalCount} projects` },
    [filteredCount, isSpanish, totalCount]
  );

  const selectClass =
    'bg-term-panelAlt border border-term-border text-term-text px-3 py-2.5 rounded-lg font-mono text-[13px]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-term-panel border border-term-border rounded-xl px-6 py-5 mb-7 flex flex-wrap gap-4 items-center justify-between"
    >
      <div className="flex gap-3 flex-wrap">
        <select
          value={selectedCategory}
          onChange={e => onCategoryChange(e.target.value)}
          className={selectClass}
        >
          {categories.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={e => onStatusChange(e.target.value)}
          className={selectClass}
        >
          {statuses.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="text-[13px] text-term-dim">{copy.results}</div>
    </motion.div>
  );
};

export default FilterSection;
