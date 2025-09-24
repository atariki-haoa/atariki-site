import React, { useCallback, useState, useEffect } from 'react';
import { FaBriefcase } from 'react-icons/fa';
import ExperienceCard from '../ui/ExperienceCard';
import rawExperienceData from '../../data/experience.json';

interface ExperienceData {
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

const experienceData: ExperienceData[] = [
  ...rawExperienceData,
];

const Experience: React.FC = () => {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Actualizar el año automáticamente
  useEffect(() => {
    const updateYear = () => {
      setCurrentYear(new Date().getFullYear());
    };

    // Actualizar inmediatamente
    updateYear();

    // Configurar intervalo para verificar cada minuto
    const interval = setInterval(updateYear, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleCardExpansion = useCallback((cardIndex: number) => {
    setExpandedCards(prev => 
      prev.includes(cardIndex) 
        ? prev.filter(index => index !== cardIndex)
        : [...prev, cardIndex]
    );
  }, []);

  const scrollToNextCard = useCallback((currentIndex: number) => {
    if (currentIndex < experienceData.length - 1) {
      const nextIndex = currentIndex + 1;
      
      // Expandir la siguiente tarjeta
      setExpandedCards(prev => 
        prev.includes(nextIndex) ? prev : [...prev, nextIndex]
      );
      
      // Hacer scroll a la siguiente tarjeta
      setTimeout(() => {
        const nextCardElement = document.getElementById(`experience-card-${nextIndex}`);
        if (nextCardElement) {
          nextCardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100); // Pequeño delay para que la expansión comience primero
    } else {
      // Si es la última tarjeta, ir a la sección "Sobre mí"
      const aboutSection = document.querySelector('section:last-child');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <section className="py-12 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-200 mb-3">
            <FaBriefcase className="inline-block w-6 h-6 mr-2 text-blue-400" />
            Experiencia Profesional
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Más de 10 años construyendo soluciones tecnológicas innovadoras y liderando equipos de desarrollo
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line - Centered */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 md:transform md:-translate-x-1/2"></div>

          {/* Current Year Indicator - At the top of timeline */}
          <div className="relative mb-6">
            <div className="ml-8 md:ml-0 md:text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full font-semibold shadow-md">
                <span className="text-sm">{currentYear}</span>
              </div>
            </div>
          </div>

          {experienceData.map((exp, index) => (
            <div key={exp.id} id={`experience-card-${index}`}>
              <ExperienceCard
                experience={exp}
                index={index}
                isLast={index === experienceData.length - 1}
                onNext={scrollToNextCard}
                isLeft={index % 2 === 0}
                isExpanded={expandedCards.includes(index)}
                onToggleExpand={toggleCardExpansion}
              />
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-center text-gray-200 mb-6">Resumen de Carrera</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">14+</div>
              <div className="text-gray-300 text-sm">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">6</div>
              <div className="text-gray-300 text-sm">Empresas Diferentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">13+</div>
              <div className="text-gray-300 text-sm">Tecnologías Dominadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">B1</div>
              <div className="text-gray-300 text-sm">Nivel de Inglés</div>
            </div>
          </div>
          
          {/* Technical Skills Highlight */}
          <div className="mt-6 text-center">
            <h4 className="text-base font-semibold text-gray-200 mb-3">Especialidades Técnicas Destacadas</h4>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">JavaScript (6 años)</span>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">Node.js (6 años)</span>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">TypeScript (5 años)</span>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs">React (4 años)</span>
              <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs">Linux (10+ años)</span>
              <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-xs">Git (7 años)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
