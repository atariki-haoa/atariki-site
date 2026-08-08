import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface ExperienceCardData {
  id: number;
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface ExperienceCardProps {
  experience: ExperienceCardData;
  index: number;
  isExpanded?: boolean;
  onToggleExpand?: (index: number) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index,
  isExpanded = false,
  onToggleExpand,
}) => {
  const toggleExpanded = () => {
    if (onToggleExpand) {
      onToggleExpand(index);
    }
  };

  return (
    <div className="bg-term-panel border border-term-border rounded-xl overflow-hidden">
      <button
        onClick={toggleExpanded}
        className="w-full bg-transparent border-none px-5 py-[18px] flex justify-between items-center cursor-pointer text-left font-mono text-term-text"
      >
        <div>
          <h3 className="m-0 mb-[3px] text-base font-bold text-term-text">{experience.position}</h3>
          <p className="m-0 text-[13.5px] font-semibold text-term-blue">{experience.company}</p>
        </div>
        <div className="flex items-center gap-3.5">
          <span className="text-xs text-term-dim">{experience.period}</span>
          <motion.span
            className="text-term-text"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <FaChevronDown size={16} />
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
            className="border-t border-term-border"
          >
            <div className="px-5 pb-5">
              <p className="text-term-dim text-[12.5px] mt-3.5 mb-2.5">{experience.location}</p>
              <p className="text-term-sub text-sm leading-relaxed mb-3.5">{experience.description}</p>
              {experience.achievements.length > 0 && (
                <ul className="mb-3.5 pl-[18px] text-term-sub text-[13.5px] leading-[1.9]">
                  {experience.achievements.slice(0, 3).map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-1.5">
                {experience.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-term-panelAlt text-term-sub text-[11.5px] px-2.5 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceCard;
