import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { getExcerpt } from '../../utils/blog';
import type { PostData, PostType } from '../../types/post';

interface BlogPostCardProps {
  post: PostData;
  index: number;
}

const TYPE_ACCENT: Record<PostType, string> = {
  conversation: '#5b93ff',
  guide: '#4ade80',
  note: '#fbbf24',
};

const TYPE_LABEL_ES: Record<PostType, string> = {
  conversation: 'Conversación',
  guide: 'Guía',
  note: 'Nota',
};

const TYPE_LABEL_EN: Record<PostType, string> = {
  conversation: 'Conversation',
  guide: 'Guide',
  note: 'Note',
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, index }) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(isSpanish ? 'es-CL' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    [isSpanish]
  );

  const typeLabel = (isSpanish ? TYPE_LABEL_ES : TYPE_LABEL_EN)[post.type];
  const typeAccent = TYPE_ACCENT[post.type];
  const excerpt = useMemo(() => getExcerpt(post.content_md), [post.content_md]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block bg-term-panel border border-term-border rounded-2xl p-[22px] hover:border-term-blue transition-colors duration-200"
      >
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="w-[5px] h-[5px] rounded-full" style={{ background: typeAccent }} />
          <span className="text-xs" style={{ color: typeAccent }}>
            {typeLabel}
          </span>
          <span className="text-term-dim text-xs">·</span>
          <span className="text-term-dim text-xs">{dateFormatter.format(new Date(post.created_at))}</span>
        </div>
        <h3 className="text-[17px] font-bold text-term-text mb-2">{post.title}</h3>
        <p className="text-term-sub text-[13.5px] leading-relaxed">{excerpt}</p>
      </Link>
    </motion.div>
  );
};

export default BlogPostCard;
