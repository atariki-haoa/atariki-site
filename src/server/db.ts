import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';

const DEFAULT_DB_PATH = path.join(process.cwd(), 'data', 'blog.db');

function createDatabase(): DatabaseSync {
  const dbPath = process.env.BLOG_DB_PATH ? path.resolve(process.env.BLOG_DB_PATH) : DEFAULT_DB_PATH;

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const database = new DatabaseSync(dbPath);

  database.exec(`
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

  return database;
}

declare global {
  // eslint-disable-next-line no-var
  var __blogDb: DatabaseSync | undefined;
}

const db = global.__blogDb ?? createDatabase();

if (process.env.NODE_ENV !== 'production') {
  global.__blogDb = db;
}

export default db;
