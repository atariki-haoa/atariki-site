export type Locale = 'es' | 'en';

export type PostType = 'conversation' | 'guide' | 'note';

export interface PostData {
  id: number;
  slug: string;
  locale: Locale;
  type: PostType;
  title: string;
  content_md: string;
  created_at: string;
}

export interface NewPostInput {
  content_md: string;
  locale: Locale;
  type: PostType;
  date?: string;
}
