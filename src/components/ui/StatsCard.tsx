import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  value: number;
  label: string;
  color: 'blue' | 'green' | 'amber' | 'purple';
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label, color, delay = 0 }) => {
  const colorClasses = {
    blue: 'text-term-blue',
    green: 'text-term-green',
    amber: 'text-term-amber',
    purple: 'text-term-purple',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className={`text-xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-term-dim text-[11.5px]">{label}</div>
    </motion.div>
  );
};

export default StatsCard;
