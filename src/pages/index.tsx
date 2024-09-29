import React from 'react';
import Layout from '../components/Layout';
import { FaReact, FaNodeJs, FaJs, FaPython } from 'react-icons/fa';
import { SiTypescript, SiFlutter } from 'react-icons/si';

const skills = [
  { icon: FaReact, color: '#61DAFB' },
  { icon: FaNodeJs, color: '#339933' },
  { icon: FaJs, color: '#F7DF1E' },
  { icon: SiTypescript, color: '#3178C6' },
  { icon: FaPython, color: '#3776AB' },
  { icon: SiFlutter, color: '#02569B' }
];

const Home: React.FC = () => {
  return (
    <Layout title="Inicio - Ariel Lobos Haoa" description="Inicio - Ariel Lobos Haoa">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8">Ariel Lobos</h1>
        <div className="skills-container flex flex-wrap justify-center items-center mb-8 p-8 bg-gray-800 rounded-3xl shadow-lg">
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <div key={index} className="m-4">
                <IconComponent size={50} color={skill.color} />
              </div>
            );
          })}
        </div>
        <p className="text-center max-w-xl px-4">
          ¡Hola! Soy Ariel Lobos, un apasionado de la tecnología, desarrollador y creador. Disfruto resolver problemas complejos con código, explorar nuevas tecnologías, y en mi tiempo libre me dedico a proyectos como la impresión 3D y la automatización. También soy un fanático de los videojuegos y me fascinan las máquinas en general.
        </p>
      </div>
    </Layout>
  );
};

export default Home;