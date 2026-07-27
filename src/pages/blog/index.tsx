import React, { useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import Layout from '../../components/functional/Layout';
import BlogListSection from '../../components/logical/BlogListSection';
import { useLanguage } from '../../context/LanguageContext';
import postsRepo from '../../server/postsRepo';
import type { PostData } from '../../types/post';

interface BlogPageProps {
  posts: PostData[];
}

const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const seoCopy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Blog - Ariel Lobos Haoa',
            description: 'Notas técnicas y aprendizajes de Ariel Lobos Haoa.',
            keywords: 'blog, notas técnicas, desarrollo de software, Ariel Lobos Haoa',
            sectionTitle: 'Blog',
            sectionDescription: 'Notas técnicas, guías y aprendizajes, publicados en inglés.',
          }
        : {
            title: 'Blog - Ariel Lobos Haoa',
            description: 'Technical notes and learnings from Ariel Lobos Haoa.',
            keywords: 'blog, technical notes, software development, Ariel Lobos Haoa',
            sectionTitle: 'Blog',
            sectionDescription: 'Technical notes, guides, and learnings.',
          },
    [isSpanish]
  );

  return (
    <Layout title={seoCopy.title} description={seoCopy.description} canonicalUrl="/blog" keywords={seoCopy.keywords}>
      <div className="min-h-screen flex flex-col bg-transparent text-term-text">
        <main className="flex-1 max-w-[1180px] w-full mx-auto px-6 py-14">
          <BlogListSection posts={posts} title={seoCopy.sectionTitle} description={seoCopy.sectionDescription} />
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<BlogPageProps> = async () => {
  const posts = postsRepo.list();
  return { props: { posts } };
};

export default BlogPage;
