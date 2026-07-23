CREATE TABLE `publication_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_email` text NOT NULL,
	`name` text NOT NULL,
	`data_json` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `publication_projects_owner_id_idx` ON `publication_projects` (`owner_email`,`id`);--> statement-breakpoint
CREATE TABLE `publication_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`owner_email` text NOT NULL,
	`version` integer NOT NULL,
	`data_json` text NOT NULL,
	`created_at` integer NOT NULL
);
