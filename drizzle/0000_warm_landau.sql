CREATE TABLE `movies` (
	`tmdb_id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`poster_path` text,
	`release_date` text,
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`user_id` text NOT NULL,
	`tmdb_id` integer NOT NULL,
	`rating` real NOT NULL,
	`body` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`user_id`, `tmdb_id`)
);
--> statement-breakpoint
CREATE INDEX `reviews_user_idx` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `reviews_movie_idx` ON `reviews` (`tmdb_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `watchlist` (
	`user_id` text NOT NULL,
	`tmdb_id` integer NOT NULL,
	`added_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`user_id`, `tmdb_id`)
);
--> statement-breakpoint
CREATE INDEX `watchlist_user_idx` ON `watchlist` (`user_id`);--> statement-breakpoint
CREATE INDEX `watchlist_movie_idx` ON `watchlist` (`tmdb_id`);