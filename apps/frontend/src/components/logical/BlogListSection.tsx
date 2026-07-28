import React from 'react';
import { motion } from 'framer-motion';
import BlogPostCard from '../ui/BlogPostCard';
import { useLanguage } from '../../context/LanguageContext';
import type { PostData } from '../../types/post';

interface BlogListSectionProps {
  posts: PostData[];
  title: string;
  description: string;
}

const BlogListSection: React.FC<BlogListSectionProps> = ({ posts, title, description }) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-term-text mb-2">{title}</h1>
        <p className="text-term-sub text-[15px]">{description}</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-term-muted text-base">
            {isSpanish ? 'Todavía no hay entradas publicadas' : 'No entries published yet'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default BlogListSection;
