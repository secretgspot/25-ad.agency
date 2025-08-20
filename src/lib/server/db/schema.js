import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';

export const ads = sqliteTable('ads', {
  id: text('id').primaryKey(),
  created_at: text('created_at').notNull(),
  file: text('file').notNull(),
  title: text('title').notNull(),
  href: text('href').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  weight: real('weight').notNull().default(1),
  impressions: integer('impressions').notNull().default(0),
  clicks: integer('clicks').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  imageData: blob('image_data', { mode: 'buffer' }),
  fileType: text('file_type'),
});