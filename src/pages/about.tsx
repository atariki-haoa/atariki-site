import React from 'react';
import Layout from '../components/functional/Layout';
import Experience from '../components/logical/Experience';

const AboutPage: React.FC = () => {
  return (
    <Layout title="Sobre Mí - Ariel Lobos Haoa" description="Sobre Mí - Ariel Lobos Haoa">
      <div className="min-h-screen flex flex-col bg-transparent text-gray-100">
        <main className="flex-1 p-8">
          <Experience />
        </main>
      </div>
    </Layout>
  );
};

export default AboutPage;