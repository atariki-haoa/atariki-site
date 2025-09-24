import React from 'react';
import Head from 'next/head';
import { FaUser, FaComments, FaTools, FaGraduationCap, FaLightbulb, FaStar, FaRocket, FaCogs, FaBrain } from 'react-icons/fa';
import Experience from './Experience';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-gray-100">
      <Head>
        <title>Sobre Mí - Ariel Lobos Haoa</title>
        <meta name="description" content="Sobre Mí - Ariel Lobos Haoa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-1 p-8">
        <Experience />
      </main>
    </div>
  );
};

export default About;