import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, 
  FaExternalLinkAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaChevronDown,
  FaStar,
  FaCode,
  FaRocket,
  FaDatabase,
  FaCog
} from 'react-icons/fa';

interface ProjectData {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  status: string;
  featured: boolean;
  githubUrl: string;
  liveUrl: string | null;
  imageUrl: string;
  startDate: string;
  endDate: string | null;
  highlights: string[];
  role: string;
  teamSize: number;
  metrics: Record<string, string | number>;
}

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  isExpanded?: boolean;
  onToggleExpand?: (index: number) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'frontend': return FaCode;
    case 'backend': return FaDatabase;
    case 'devops': return FaCog;
    case 'data science': return FaRocket;
    default: return FaCode;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'frontend': return 'from-blue-600 to-cyan-600';
    case 'backend': return 'from-green-600 to-emerald-600';
    case 'devops': return 'from-orange-600 to-red-600';
    case 'data science': return 'from-purple-600 to-pink-600';
    default: return 'from-gray-600 to-gray-700';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completado': return 'bg-green-600';
    case 'en desarrollo': return 'bg-blue-600';
    case 'mantenimiento': return 'bg-yellow-600';
    default: return 'bg-gray-600';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  index, 
  isExpanded = false, 
  onToggleExpand 
}) => {
  const CategoryIcon = getCategoryIcon(project.category);
  const categoryGradient = getCategoryColor(project.category);
  const statusColor = getStatusColor(project.status);

  const toggleExpanded = () => {
    if (onToggleExpand) {
      onToggleExpand(index);
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const getDuration = () => {
    if (!project.endDate) return 'En curso';
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return months === 1 ? '1 mes' : `${months} meses`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 ${
        project.featured ? 'ring-2 ring-yellow-500/20' : ''
      }`}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <FaStar className="mr-1" size={10} />
            Destacado
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryGradient}`}>
              <CategoryIcon className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-100 leading-tight">
                {project.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-400">{project.category}</span>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${statusColor}`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Technologies Preview */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech, techIndex) => (
            <span 
              key={techIndex}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-gray-600 text-gray-400 text-xs rounded-md">
              +{project.technologies.length - 4} más
            </span>
          )}
        </div>

        {/* Expand Button */}
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
        >
          <span className="text-sm mr-2">
            {isExpanded ? 'Ver menos' : 'Ver detalles'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown size={12} />
          </motion.div>
        </button>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-gray-700"
          >
            <div className="p-6 pt-4 space-y-4">
              {/* Long Description */}
              <div>
                <h4 className="text-sm font-semibold text-gray-200 mb-2">Descripción Detallada</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {project.longDescription}
                </p>
              </div>

              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-200 mb-2">Información del Proyecto</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-300">
                      <FaCalendarAlt className="mr-2 text-gray-400" size={12} />
                      <span>{formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Presente'}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaUsers className="mr-2 text-gray-400" size={12} />
                      <span>{project.role} • {project.teamSize} persona{project.teamSize > 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Duración:</span> {getDuration()}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-200 mb-2">Métricas</h4>
                  <div className="space-y-1">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-gray-300 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-sm font-semibold text-gray-200 mb-2">Aspectos Destacados</h4>
                <ul className="space-y-1">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="text-sm text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2 mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* All Technologies */}
              <div>
                <h4 className="text-sm font-semibold text-gray-200 mb-2">Tecnologías Utilizadas</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200 text-sm"
                >
                  <FaGithub className="mr-2" size={14} />
                  Ver Código
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center px-4 py-2 bg-gradient-to-r ${categoryGradient} hover:opacity-90 text-white rounded-lg transition-opacity duration-200 text-sm`}
                  >
                    <FaExternalLinkAlt className="mr-2" size={14} />
                    Ver Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCard;
