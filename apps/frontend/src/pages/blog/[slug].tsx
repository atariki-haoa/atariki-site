import React from 'react';
import type { GetServerSideProps } from 'next';
import Markdown from 'react-markdown';
import Layout from '../../components/functional/Layout';
import { useLanguage } from '../../context/LanguageContext';
import { getPostBySlug } from '../../server/backendClient';
import type { PostData } from '../../types/post';

interface BlogPostPageProps {
  post: PostData;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const dateFormatter = new Intl.DateTimeFormat(isSpanish ? 'es-CL' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const copy = isSpanish ? { download: 'Descargar .md' } : { download: 'Download .md' };

  return (
    <Layout title={`${post.title} - Ariel Lobos Haoa`} description={post.title} canonicalUrl={`/blog/${post.slug}`}>
      <div className="min-h-screen flex flex-col bg-transparent text-term-text">
        <main className="flex-1 max-w-[820px] w-full mx-auto px-6 py-14">
          <article>
            <div className="mb-8">
              <span className="text-term-dim text-xs">{dateFormatter.format(new Date(post.created_at))}</span>
              <h1 className="text-3xl font-bold text-term-text mt-2 mb-4">{post.title}</h1>
              <a
                href={`/api/blog/${post.slug}/download`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-term-panelAlt text-term-sub rounded-lg text-[12.5px] hover:text-term-text transition-colors duration-200"
              >
                {copy.download}
              </a>
            </div>

            <div className="space-y-4">
              <Markdown
                components={{
                  h1: ({ node, ...rest }) => <h2 className="text-2xl font-bold text-term-text mt-8 mb-3" {...rest} />,
                  h2: ({ node, ...rest }) => <h3 className="text-xl font-bold text-term-text mt-8 mb-3" {...rest} />,
                  h3: ({ node, ...rest }) => <h4 className="text-lg font-bold text-term-text mt-6 mb-2" {...rest} />,
                  p: ({ node, ...rest }) => <p className="text-term-sub text-[15px] leading-relaxed mb-4" {...rest} />,
                  a: ({ node, ...rest }) => (
                    <a className="text-term-blue hover:text-term-blueHover underline" target="_blank" rel="noopener noreferrer" {...rest} />
                  ),
                  ul: ({ node, ...rest }) => <ul className="list-disc list-inside text-term-sub text-[15px] mb-4 space-y-1" {...rest} />,
                  ol: ({ node, ...rest }) => <ol className="list-decimal list-inside text-term-sub text-[15px] mb-4 space-y-1" {...rest} />,
                  li: ({ node, ...rest }) => <li className="text-term-sub" {...rest} />,
                  code: ({ node, className, ...rest }) => (
                    <code className={`bg-term-panelAlt text-term-amber px-1.5 py-0.5 rounded text-[13px] ${className ?? ''}`.trim()} {...rest} />
                  ),
                  pre: ({ node, ...rest }) => (
                    <pre className="bg-term-panelAlt border border-term-border rounded-lg p-4 overflow-x-auto mb-4 text-[13px]" {...rest} />
                  ),
                  blockquote: ({ node, ...rest }) => (
                    <blockquote className="border-l-2 border-term-border pl-4 text-term-muted italic mb-4" {...rest} />
                  ),
                }}
              >
                {post.content_md}
              </Markdown>
            </div>
          </article>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug;
  if (typeof slug !== 'string') {
    return { notFound: true };
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
};

export default BlogPostPage;
