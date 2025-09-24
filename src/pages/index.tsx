import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { FaReact, FaNodeJs, FaJs, FaPython, FaArrowDown, FaCode, FaRocket, FaDownload } from 'react-icons/fa';
import { SiTypescript, SiFlutter } from 'react-icons/si';
import SkillPopup from '../components/SkillPopup';
import Link from 'next/link';

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

  const handleScrollDown = useCallback(() => {
    window.scrollBy({ 
      top: window.innerHeight, 
      behavior: 'smooth' 
    });
  }, []);

  return (
    <Layout title="Inicio - Ariel Lobos Haoa" description="Desarrollador Full Stack | Ingeniero en Computación | Especialista en React, Node.js y TypeScript">
      <div className="min-h-screen">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          
          <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
            <div className="mb-6">
              <span className="text-blue-400 text-lg font-medium tracking-wide">¡Hola! Soy</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Ariel Lobos
            </h1>
            
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
                Ingeniero en Computación & Desarrollador Full Stack
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Especialista en <span className="text-blue-400 font-semibold">React</span>, <span className="text-green-400 font-semibold">Node.js</span> y <span className="text-blue-300 font-semibold">TypeScript</span>. 
                Apasionado por crear soluciones tecnológicas innovadoras y liderar equipos hacia el éxito.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/projects" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <FaRocket className="group-hover:animate-bounce" />
                Ver Mis Proyectos
              </Link>
              <Link 
                href="/contact" 
                className="group border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <FaCode className="group-hover:animate-pulse" />
                Contactar
              </Link>
            </div>
            
            <div className="mb-16">
              <p className="text-gray-500 mb-4">Tecnologías principales:</p>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {skills.map((s, index) => {
                  const IconComponent = s.icon;
                  return (
                    <div 
                      key={index} 
                      onClick={() => handleSkillClick(s)} 
                      className="group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-6"
                    >
                      <IconComponent 
                        size={40} 
                        color={s.color} 
                        className="group-hover:drop-shadow-lg transition-all duration-300"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
            <button 
              onClick={handleScrollDown}
              className="flex flex-col items-center text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer group bg-transparent border-none p-2"
              aria-label="Scroll down"
            >
              <FaArrowDown className="text-xl animate-bounce group-hover:animate-none" />
            </button>
          </div>
        </section>
        
        <section id="about-section" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-200 mb-8">Sobre Mí</h3>
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Con más de <span className="text-blue-400 font-semibold">10 años de experiencia</span> en desarrollo de software, 
                me especializo en crear soluciones tecnológicas robustas que conectan equipos técnicos y no técnicos. 
                Mi enfoque combina liderazgo empático con expertise técnico sólido.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-700 rounded-lg p-6">
                  <FaCode className="text-blue-400 text-3xl mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-200 mb-2">Desarrollo Full Stack</h4>
                  <p className="text-gray-400 text-sm">React, Node.js, TypeScript, Python</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <FaRocket className="text-purple-400 text-3xl mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-200 mb-2">Liderazgo Técnico</h4>
                  <p className="text-gray-400 text-sm">Gestión de equipos y proyectos</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-6">
                  <FaDownload className="text-green-400 text-3xl mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-200 mb-2">Innovación</h4>
                  <p className="text-gray-400 text-sm">IA, Impresión 3D, Automatización</p>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  href="/about" 
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Conocer Más Sobre Mí
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {selectedSkill && <SkillPopup skill={selectedSkill} onClose={handleClosePopup} />}
      </div>
    </Layout>
  );
};

export default Home;