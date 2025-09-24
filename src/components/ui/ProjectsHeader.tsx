import React from 'react';
import { motion } from 'framer-motion';
import { FaProjectDiagram } from 'react-icons/fa';

interface ProjectsHeaderProps {
  title: string;
  description: string;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-center mb-6"
      >
        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-4">
          <FaProjectDiagram className="text-white" size={24} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h1>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
};

export default ProjectsHeader;
