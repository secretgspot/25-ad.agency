CREATE TABLE `ads` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`file` text NOT NULL,
	`title` text NOT NULL,
	`href` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`weight` real DEFAULT 1 NOT NULL,
	`impressions` integer DEFAULT 0 NOT NULL,
	`clicks` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
