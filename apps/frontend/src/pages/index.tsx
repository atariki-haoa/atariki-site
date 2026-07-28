import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from '../components/functional/Layout';
import {
  FaReact,
  FaNodeJs,
  FaJs,
  FaPython,
  FaArrowDown,
  FaCode,
  FaRocket,
  FaDownload,
} from 'react-icons/fa';
import { SiTypescript, SiFlutter } from 'react-icons/si';
import SkillPopup from '../components/ui/SkillPopup';
import Terminal from '../components/ui/Terminal';
import { PersonStructuredData, WebsiteStructuredData } from '../components/ui/StructuredData';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { getSkillsData, type SkillData } from '../data/skills';

interface SkillWithIcon {
  id: number;
  color: string;
  IconComponent: React.ComponentType<any>;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  FaReact,
  FaNodeJs,
  FaJs,
  SiTypescript,
  FaPython,
  SiFlutter,
};

const Home: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const skillsData = useMemo(() => getSkillsData(locale), [locale]);

  const skillsWithIcons = useMemo<SkillWithIcon[]>(() => {
    return skillsData
      .map(skill => {
        const IconComponent = iconMap[skill.icon];
        if (!IconComponent) {
          return null;
        }
        return {
          id: skill.id,
          color: skill.color,
          IconComponent,
        };
      })
      .filter((skill): skill is SkillWithIcon => skill !== null);
  }, [skillsData]);

  const heroCopy = useMemo(
    () =>
      isSpanish
        ? {
            badge: 'Disponible para nuevos proyectos',
            greeting: '¡Hola! Soy',
            role: 'Ingeniero en Computación & Full Stack Developer',
            projectsCta: 'Ver Proyectos',
            contactCta: 'Contactar',
            techLabel: 'Tecnologías principales',
            scrollLabel: 'Desplázate hacia abajo',
          }
        : {
            badge: 'Available for new projects',
            greeting: "Hi! I'm",
            role: 'Computer Engineer & Full Stack Developer',
            projectsCta: 'View Projects',
            contactCta: 'Get in Touch',
            techLabel: 'Core technologies',
            scrollLabel: 'Scroll down',
          },
    [isSpanish]
  );

  const aboutCopy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Sobre Mí',
            intro:
              'Con más de 10 años de experiencia en desarrollo de software, me especializo en crear soluciones robustas que conectan equipos técnicos y no técnicos. Mi enfoque combina liderazgo empático con expertise técnico sólido.',
            highlights: [
              {
                title: 'Desarrollo Full Stack',
                description: 'React, Node.js, TypeScript, Python',
                Icon: FaCode,
                colorClass: 'text-blue-400',
              },
              {
                title: 'Liderazgo Técnico',
                description: 'Gestión de equipos y proyectos',
                Icon: FaRocket,
                colorClass: 'text-purple-400',
              },
              {
                title: 'Innovación',
                description: 'IA, Impresión 3D, Automatización',
                Icon: FaDownload,
                colorClass: 'text-green-400',
              },
            ],
            cta: 'Conocer Más Sobre Mí',
          }
        : {
            title: 'About Me',
            intro:
              'With more than 10 years of software experience, I specialize in building robust solutions that connect technical and non-technical teams. I pair empathetic leadership with solid technical expertise.',
            highlights: [
              {
                title: 'Full Stack Development',
                description: 'React, Node.js, TypeScript, Python',
                Icon: FaCode,
                colorClass: 'text-blue-400',
              },
              {
                title: 'Technical Leadership',
                description: 'Team and project management',
                Icon: FaRocket,
                colorClass: 'text-purple-400',
              },
              {
                title: 'Innovation',
                description: 'AI, 3D printing, Automation',
                Icon: FaDownload,
                colorClass: 'text-green-400',
              },
            ],
            cta: 'Read More About Me',
          },
    [isSpanish]
  );

  const seoCopy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Ariel Atariki Lobos Haoa - Desarrollador Full Stack | React, Node.js, TypeScript',
            description:
              'Desarrollador Full Stack especializado en React, Node.js, TypeScript y Python. Portfolio profesional con experiencia en desarrollo web moderno, liderazgo técnico y soluciones escalables.',
            keywords:
              'desarrollador full stack, React, Node.js, TypeScript, Python, desarrollador web, portfolio, Chile, Santiago, liderazgo técnico',
            personJobTitle: 'Desarrollador Full Stack',
            personDescription:
              'Desarrollador Full Stack especializado en React, Node.js, TypeScript y Python con experiencia liderando equipos y creando soluciones escalables.',
            websiteDescription:
              'Portfolio profesional de Ariel Atariki Lobos Haoa, desarrollador Full Stack especializado en tecnologías modernas.',
          }
        : {
            title: 'Ariel Atariki Lobos Haoa - Full Stack Developer | React, Node.js, TypeScript',
            description:
              'Full Stack Developer specialized in React, Node.js, TypeScript, and Python. Portfolio showcasing modern web development, technical leadership, and scalable solutions.',
            keywords:
              'full stack developer, React, Node.js, TypeScript, Python, web developer, portfolio, Chile, Santiago, technical leadership',
            personJobTitle: 'Full Stack Developer',
            personDescription:
              'Full Stack Developer focused on React, Node.js, TypeScript, and Python with experience leading teams and delivering scalable solutions.',
            websiteDescription:
              'Professional portfolio of Ariel Atariki Lobos Haoa, a Full Stack Developer specialized in modern technologies.',
          },
    [isSpanish]
  );

  const handleSkillClick = useCallback(
    (skillId: number) => {
      const skillData = skillsData.find(skill => skill.id === skillId);
      setSelectedSkill(skillData ?? null);
    },
    [skillsData]
  );

  const handleClosePopup = useCallback(() => {
    setSelectedSkill(null);
  }, []);

  const handleScrollDown = useCallback(() => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  }, []);

  return (
    <>
      <PersonStructuredData
        name="Ariel Atariki Lobos Haoa"
        jobTitle={seoCopy.personJobTitle}
        description={seoCopy.personDescription}
        url="https://atariki.dev"
        image="https://atariki.dev/profile-image.jpg"
        sameAs={['https://github.com/atariki-haoa', 'https://linkedin.com/in/atariki-haoa']}
        address={{
          addressCountry: 'Chile',
          addressLocality: 'Santiago',
        }}
      />

      <WebsiteStructuredData
        name="Ariel Atariki Lobos Haoa - Portfolio"
        description={seoCopy.websiteDescription}
        url="https://atariki.dev"
        author={{ name: 'Ariel Atariki Lobos Haoa', url: 'https://atariki.dev' }}
        inLanguage={locale}
        copyrightYear={2024}
      />

      <Layout
        title={seoCopy.title}
        description={seoCopy.description}
        canonicalUrl="/"
        keywords={seoCopy.keywords}
        ogImage="/og-home.jpg"
      >
        <div className="min-h-screen">
          <section className="max-w-[1180px] mx-auto px-6 py-16 md:py-20 flex gap-14 items-center flex-wrap">
            <div className="flex-1 min-w-[340px]">
              <div className="inline-flex items-center gap-2 text-term-green text-sm font-semibold mb-5 bg-[#4ade8014] border border-[#4ade8030] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-term-green" />
                {heroCopy.badge}
              </div>

              <h1 className="text-[clamp(40px,6vw,72px)] font-bold leading-[1.05] mb-5 tracking-tight text-gradient-hero">
                Ariel Lobos
              </h1>
              <h2 className="text-[clamp(18px,2.2vw,24px)] font-semibold text-term-sub mb-5">{heroCopy.role}</h2>
              <p className="text-[17px] leading-relaxed text-term-muted max-w-[520px] mb-8">
                {isSpanish ? (
                  <>
                    Especialista en <span className="text-term-blue font-semibold">React</span>,{' '}
                    <span className="text-term-green font-semibold">Node.js</span> y{' '}
                    <span className="text-term-purple font-semibold">TypeScript</span>. Más de 10 años liderando
                    equipos y construyendo soluciones que conectan negocio y tecnología.
                  </>
                ) : (
                  <>
                    Specialist in <span className="text-term-blue font-semibold">React</span>,{' '}
                    <span className="text-term-green font-semibold">Node.js</span>, and{' '}
                    <span className="text-term-purple font-semibold">TypeScript</span>. 10+ years leading teams
                    and building solutions that connect business and technology.
                  </>
                )}
              </p>

              <div className="flex gap-3.5 flex-wrap mb-9">
                <Link
                  href="/projects"
                  className="flex items-center gap-2 text-white px-6 py-3.5 rounded-[10px] font-semibold text-[15px]"
                  style={{ background: 'linear-gradient(120deg,#3f6fe0,#8b6ff0)' }}
                >
                  <FaRocket />
                  {heroCopy.projectsCta}
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-term-text border border-[#333a4a] px-6 py-3.5 rounded-[10px] font-semibold text-[15px]"
                >
                  <FaCode />
                  {heroCopy.contactCta}
                </Link>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[1.5px] text-term-dim mb-3.5">{heroCopy.techLabel}</p>
                <div className="flex gap-3.5 flex-wrap">
                  {skillsWithIcons.map(({ id, IconComponent, color }) => (
                    <button
                      key={id}
                      onClick={() => handleSkillClick(id)}
                      className="bg-term-panel border border-term-border w-12 h-12 rounded-[10px] flex items-center justify-center"
                    >
                      <IconComponent size={24} color={color} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-[360px] max-w-[520px]">
              <Terminal />
              <div className="flex items-center justify-center mt-5 text-term-dim text-xs">
                <button
                  onClick={handleScrollDown}
                  aria-label={heroCopy.scrollLabel}
                  className="bg-transparent border-none p-2 text-term-dim animate-bounce"
                >
                  <FaArrowDown className="text-base" />
                </button>
              </div>
            </div>
          </section>

          <section id="about-section" className="max-w-[900px] mx-auto px-6 py-10 pb-24 text-center">
            <h3 className="text-[28px] font-bold mb-7">{aboutCopy.title}</h3>
            <div className="bg-term-panel border border-term-border rounded-2xl p-10">
              <p className="text-term-sub text-base leading-relaxed mb-8">{aboutCopy.intro}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {aboutCopy.highlights.map(({ title, description, Icon, colorClass }) => (
                  <div key={title} className="bg-term-panelAlt rounded-xl p-5">
                    <Icon className={`${colorClass} text-2xl mx-auto mb-2.5`} />
                    <h4 className="text-[15px] font-semibold mb-1">{title}</h4>
                    <p className="text-term-dim text-[13px]">{description}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-block text-white px-[26px] py-3 rounded-[10px] font-semibold text-sm"
                style={{ background: 'linear-gradient(120deg,#8b6ff0,#3f6fe0)' }}
              >
                {aboutCopy.cta}
              </Link>
            </div>
          </section>

          <AnimatePresence mode="wait">
            {selectedSkill && (
              <SkillPopup key={`skill-${selectedSkill.id}`} skill={selectedSkill} onClose={handleClosePopup} />
            )}
          </AnimatePresence>
        </div>
      </Layout>
    </>
  );
};

export default Home;
