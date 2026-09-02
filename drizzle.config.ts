import type { Config } from 'drizzle-kit';

export default {
  dialect: 'sqlite',
  schema: './shared/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_PATH ?? './data/app.db',
  },
} satisfies Config;
