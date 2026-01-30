CREATE TABLE `galleryItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memorialId` int NOT NULL,
	`type` enum('photo','video','audio') NOT NULL,
	`url` text NOT NULL,
	`title` varchar(255),
	`description` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `galleryItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memorials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`patronymic` varchar(100),
	`birthDate` timestamp,
	`deathDate` timestamp,
	`mainPhotoUrl` text,
	`burialPlace` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`description` text,
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memorials_id` PRIMARY KEY(`id`)
);
