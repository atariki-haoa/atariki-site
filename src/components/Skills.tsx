import React from 'react';
import { FaReact, FaNodeJs, FaJs, FaPython } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';

const skills = [
  { icon: FaReact, color: '#61DAFB' },
  { icon: FaNodeJs, color: '#339933' },
  { icon: FaJs, color: '#F7DF1E' },
  { icon: SiTypescript, color: '#3178C6' },
  { icon: FaPython, color: '#3776AB' }
];

const Skills: React.FC = () => {
  return (
    <div className="skills-container flex flex-wrap justify-center items-center py-8">
      {skills.map((skill, index) => {
        const IconComponent = skill.icon;
        return (
          <div key={index} className="m-4">
            <IconComponent size={50} color={skill.color} />
          </div>
        );
      })}
    </div>
  );
};

export default Skills;
