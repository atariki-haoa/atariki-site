import React from 'react';
import Head from 'next/head';
import { FaUser, FaComments, FaTools, FaGraduationCap, FaLightbulb, FaStar, FaRocket, FaCogs, FaBrain } from 'react-icons/fa';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-gray-100">
      <Head>
        <title>Sobre Mí - Ariel Lobos Haoa</title>
        <meta name="description" content="Sobre Mí - Ariel Lobos Haoa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 p-8">
        <section className="p-8 bg-gray-800 text-gray-100 rounded-lg my-8">
          <h2 className="text-2xl font-bold text-blue-500 mb-4">
            <FaUser className="inline-block w-6 h-6 mr-2" />
            Sobre mí
          </h2>
          <div className="space-y-8">
            <div>
              <p className="mb-4">
                Soy Ariel Atariki Lobos Haoa, Ingeniero en Computación con más de 10 años de experiencia en el desarrollo de soluciones tecnológicas. Me considero una persona con gran capacidad de liderazgo, con un enfoque en la buena comunicación y el trabajo en equipo, siempre buscando que los proyectos se desarrollen en un entorno de colaboración y satisfacción para todos los involucrados. Soy adaptable a distintos ambientes, tanto en el trabajo remoto como en oficina, y me desempeño bien interactuando con diferentes personas, desde equipos técnicos hasta clientes y usuarios no técnicos.
              </p>
              <FaStar className="text-yellow-500 mx-auto my-4 animate-bounce" />
              <p className="mb-4">
                <FaComments className="inline-block w-6 h-6 mr-2" />
                Una de mis fortalezas clave es la habilidad para conectar áreas técnicas y no técnicas, lo que me permite facilitar la comunicación entre diferentes equipos y asegurar que los proyectos avancen de manera eficiente. He trabajado tanto con pequeñas empresas (PyMEs) como con grandes corporaciones, aportando en la gestión y ejecución de proyectos que requieren soluciones tecnológicas robustas. Además, me gusta innovar y enfrentar nuevos desafíos, aplicando un enfoque pragmático para la resolución de problemas.
              </p>
              <FaRocket className="text-red-500 mx-auto my-4 animate-bounce" />
              <p className="mb-4">
                <FaTools className="inline-block w-6 h-6 mr-2" />
                Fuera del ámbito laboral, soy un entusiasta de la tecnología y la creación. Me fascina la impresión 3D, la mecanización CNC, la carpintería, y la electrónica, lo que me ha permitido mezclar mi pasión por la tecnología con proyectos personales creativos. Estos intereses no solo me mantienen actualizado, sino que también me ayudan a desarrollar soluciones que integran tanto software como hardware.
              </p>
              <FaCogs className="text-green-500 mx-auto my-4 animate-bounce" />
              <p className="mb-4">
                <FaGraduationCap className="inline-block w-6 h-6 mr-2" />
                A nivel académico, soy Ingeniero en Computación por la Universidad Andrés Bello (UNAB) y técnico en electrónica por el DUOC UC. Además, continuamente estudio y me mantengo actualizado, ya sea con cursos en Node.js, C#, o perfeccionando mi inglés y mis conocimientos en matemáticas, siempre buscando expandir mis horizontes. Actualmente, estoy considerando cursar un magíster relacionado con la aplicación de tecnologías de Inteligencia Artificial, particularmente en el ámbito de Redes Neuronales Artificiales (RNA) y modelos de lenguaje (LLMs), áreas que me resultan muy interesantes.
              </p>
              <FaBrain className="text-blue-500 mx-auto my-4 animate-bounce" />
              <p className="mb-4">
                <FaLightbulb className="inline-block w-6 h-6 mr-2" />
                En resumen, soy una persona apasionada por la tecnología y el aprendizaje continuo. Me esfuerzo por liderar con empatía, garantizar la eficiencia de los proyectos y siempre buscar nuevas oportunidades para mejorar, tanto en lo personal como en lo profesional.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;