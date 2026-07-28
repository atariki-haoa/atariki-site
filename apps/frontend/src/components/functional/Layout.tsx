import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from '../ui/Footer';

interface LayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noIndex?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  title, 
  description, 
  children, 
  canonicalUrl,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  keywords,
  noIndex = false
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://atariki.dev';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <>
      <Head>
        {/* Title y Description */}
        <title>{title}</title>
        <meta name="description" content={description} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullCanonicalUrl} />
        
        {/* Keywords */}
        {keywords && <meta name="keywords" content={keywords} />}
        
        {/* Robots */}
        <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={fullCanonicalUrl} />
        <meta property="og:image" content={fullOgImage} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="Ariel Atariki Lobos Haoa" />
        
        {/* Twitter Card */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullOgImage} />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative flex flex-col min-h-screen bg-term-bg text-term-text overflow-x-hidden">
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          className="fixed -top-52 -left-36 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, #3f6fe022, transparent 70%)' }}
        />
        <div
          className="fixed -bottom-64 -right-52 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, #a68bfa1a, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <motion.main
            className="flex-grow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {children}
          </motion.main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
