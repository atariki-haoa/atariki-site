import React from 'react';
import { motion } from 'framer-motion';

interface ProjectsHeaderProps {
  title: string;
  description: string;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold mb-3 text-gradient-hero"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-term-muted text-base max-w-2xl mx-auto leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
};

export default ProjectsHeader;
