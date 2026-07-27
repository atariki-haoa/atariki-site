require('dotenv').config();

const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const dbPath = process.env.BLOG_DB_PATH
  ? path.resolve(process.env.BLOG_DB_PATH)
  : path.join(process.cwd(), 'data', 'blog.db');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    locale TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content_md TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const testPost = {
  slug: 'hello-world',
  locale: 'en',
  type: 'note',
  title: 'Hello, World',
  content_md: [
    '# Hello, World',
    '',
    'This is a test post inserted by `scripts/seed-post.js` to validate the V1 storage slice: SQLite persistence, the `/blog` listing, the `/blog/[slug]` detail view, and the `.md` download endpoint.',
    '',
    '## What this proves',
    '',
    '- Posts persist in SQLite across container rebuilds (via the `blog-data` volume).',
    '- `postsRepo.list()` and `postsRepo.getBySlug()` read correctly.',
    '- Markdown renders through `react-markdown` on the detail page.',
    '- The `.md` file downloads with the original content intact.',
  ].join('\n'),
  created_at: new Date().toISOString(),
};

const insert = db.prepare(`
  INSERT OR IGNORE INTO posts (slug, locale, type, title, content_md, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const result = insert.run(
  testPost.slug,
  testPost.locale,
  testPost.type,
  testPost.title,
  testPost.content_md,
  testPost.created_at
);

if (result.changes > 0) {
  console.log(`Seeded test post "${testPost.slug}" at ${dbPath}`);
} else {
  console.log(`Post "${testPost.slug}" already exists at ${dbPath}, skipped.`);
}

db.close();
