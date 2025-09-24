import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaRocket, FaUsers, FaCode, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperienceCardData {
  id: number;
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  metrics?: string[];
}

interface ExperienceCardProps {
  experience: ExperienceCardData;
  index: number;
  isLast: boolean;
  onNext: (index: number) => void;
  isLeft?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (index: number) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ 
  experience, 
  index, 
  isLast, 
  onNext, 
  isLeft = false, 
  isExpanded = false, 
  onToggleExpand 
}) => {
  const toggleExpanded = () => {
    if (onToggleExpand) {
      onToggleExpand(index);
    }
  };

  return (
    <div className={`relative mb-8 ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'} md:w-1/2`}>
      {/* Timeline Dot */}
      <div className={`absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900 z-10 ${
        isLeft 
          ? 'top-6 left-6 md:top-1/2 md:right-0 md:left-auto md:transform md:-translate-y-1/2 md:translate-x-1/2' 
          : 'top-6 left-6 md:top-1/2 md:left-0 md:transform md:-translate-y-1/2 md:-translate-x-1/2'
      }`}></div>

      {/* Card Container with Motion */}
      <motion.div 
        className="ml-12 md:ml-0 bg-gray-800 rounded-xl shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Compact Header - Always Visible */}
        <div 
          className="p-4 cursor-pointer"
          onClick={toggleExpanded}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-200 mb-1">{experience.position}</h3>
              <h4 className="text-base text-blue-400 font-semibold">{experience.company}</h4>
            </div>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                <FaCalendarAlt className="inline mr-1" />
                {experience.period}
              </span>
              <motion.div 
                className="text-blue-400"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <FaChevronDown size={16} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Expanded Content with Animation */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="px-4 pb-4 border-t border-gray-700"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
            {/* Location */}
            <div className="pt-4 mb-4">
              <p className="text-gray-400 flex items-center text-sm">
                <FaMapMarkerAlt className="mr-1" />
                {experience.location}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-4 leading-relaxed text-sm">{experience.description}</p>

            {/* Achievements */}
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                <FaTrophy className="mr-1 text-yellow-500" size={12} />
                Logros Principales
              </h5>
              <ul className="space-y-1">
                {experience.achievements.slice(0, 3).map((achievement, i) => (
                  <li key={i} className="text-gray-300 flex items-start text-xs">
                    <FaRocket className="mr-2 mt-0.5 text-blue-400 flex-shrink-0" size={10} />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics */}
            {experience.metrics && (
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                  <FaUsers className="mr-1 text-green-500" size={12} />
                  Métricas
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  {experience.metrics.map((metric, i) => (
                    <div key={i} className="bg-gray-700 rounded-md p-2 text-center">
                      <span className="text-green-400 font-semibold text-xs break-words leading-tight">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                <FaCode className="mr-1 text-purple-500" size={12} />
                Tecnologías
              </h5>
              <div className="flex flex-wrap gap-1">
                {experience.technologies.slice(0, 6).map((tech, i) => (
                  <span
                    key={i}
                    className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs hover:bg-purple-600 hover:text-white transition-colors duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-center pt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext(index);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 group"
                aria-label={isLast ? "Ver sección Sobre mí" : "Ver siguiente experiencia"}
                title={isLast ? "Ver sección Sobre mí" : "Ver siguiente experiencia"}
              >
                <FaChevronDown size={12} className="group-hover:animate-bounce" />
              </button>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExperienceCard;
