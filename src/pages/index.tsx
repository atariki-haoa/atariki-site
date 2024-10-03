import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { FaReact, FaNodeJs, FaJs, FaPython } from 'react-icons/fa';
import { SiTypescript, SiFlutter } from 'react-icons/si';
import SkillPopup from '../components/SkillPopup';
import ChatBox from '../components/ChatBox';

interface Skill {
  id: number;
  icon: React.ComponentType;
  color: string;
}

interface SkillData {
  id: number;
  name: string;
  experience: string;
  description: string;
}

const skills = [
  { id: 1, icon: FaReact, color: '#61DAFB' },
  { id: 2, icon: FaNodeJs, color: '#339933' },
  { id: 3, icon: FaJs, color: '#F7DF1E' },
  { id: 4, icon: SiTypescript, color: '#3178C6' },
  { id: 5, icon: FaPython, color: '#3776AB' },
  { id: 6, icon: SiFlutter, color: '#02569B' }
];

const skillsData: SkillData[] = [
  { id: 3, name: 'JavaScript', experience: '6 años', description: 'Lenguaje de programación utilizado para desarrollo web frontend y backend.' },
  { id: 4, name: 'TypeScript', experience: '5 años', description: 'Superset de JavaScript que añade tipado estático opcional.' },
  { id: 2, name: 'NodeJS', experience: '6 años', description: 'Entorno de ejecución para JavaScript en el backend.' },
  { id: 1, name: 'React JS', experience: '4 años', description: 'Librería de JavaScript para construir interfaces de usuario.' },
  { id: 6, name: 'Flutter', experience: '3 años', description: 'Framework para construir aplicaciones móviles multiplataforma.' },
  { id: 5, name: 'Python', experience: '4 años', description: 'Lenguaje de programación de propósito general, usado para scripting y desarrollo backend.' },
];

const Home: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);

  const handleSkillClick = useCallback((skill: Skill) => {
    const skillData = skillsData.find(s => s.id === skill.id);
    setSelectedSkill(skillData || null);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedSkill(null);
  }, []);

  return (
    <Layout title="Inicio - Ariel Lobos Haoa" description="Inicio - Ariel Lobos Haoa">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8">Ariel Lobos</h1>
        <div className="skills-container flex flex-wrap justify-center items-center mb-8 p-8 bg-gray-800 rounded-3xl shadow-lg">
          {skills.map((s, index) => {
            const IconComponent = s.icon;
            return (
              <div key={index} onClick={() => handleSkillClick(s)} className="m-4 cursor-pointer">
                <IconComponent size={50} color={s.color} />
              </div>
            );
          })}
        </div>
        <p className="text-center max-w-xl px-4">
          ¡Hola! Soy Ariel Lobos, un apasionado de la tecnología, desarrollador y creador. Disfruto resolver problemas complejos con código, explorar nuevas tecnologías, y en mi tiempo libre me dedico a proyectos como la impresión 3D y la automatización. También soy un fanático de los videojuegos y me fascinan las máquinas en general.
        </p>
        {selectedSkill && <SkillPopup skill={selectedSkill} onClose={handleClosePopup} />}
      </div>
    </Layout>
  );
};

export default Home;