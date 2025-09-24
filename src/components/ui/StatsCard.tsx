import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  value: number;
  label: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label, color, delay = 0 }) => {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700"
    >
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-gray-400 text-sm">
        {label}
      </div>
    </motion.div>
  );
};

export default StatsCard;
