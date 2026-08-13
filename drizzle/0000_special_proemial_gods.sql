CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`car` text NOT NULL,
	`service` text NOT NULL,
	`visit_date` text NOT NULL,
	`visit_time` text NOT NULL,
	`comment` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bookings_created_at_idx` ON `bookings` (`created_at`);--> statement-breakpoint
CREATE INDEX `bookings_status_idx` ON `bookings` (`status`);