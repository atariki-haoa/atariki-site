import type { Locale } from './locale';

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
