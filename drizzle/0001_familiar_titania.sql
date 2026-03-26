CREATE TABLE `call_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`calledBy` varchar(128) NOT NULL,
	`outcome` enum('no_answer','voicemail','callback_scheduled','interested','not_interested','wrong_number','follow_up') NOT NULL,
	`duration` int,
	`summary` text,
	`callDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `call_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_intake` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`contactName` varchar(255) NOT NULL,
	`contactEmail` varchar(320),
	`contactPhone` varchar(32),
	`businessName` varchar(255) NOT NULL,
	`businessType` varchar(128),
	`currentWebsite` varchar(512),
	`desiredFeatures` text,
	`targetAudience` text,
	`competitors` text,
	`budget` varchar(64),
	`timeline` varchar(128),
	`additionalNotes` text,
	`intakeStatus` enum('pending','reviewed','approved','archived') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_intake_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`industry` varchar(128),
	`address` text,
	`city` varchar(128),
	`state` varchar(64),
	`zipCode` varchar(20),
	`phone` varchar(32),
	`email` varchar(320),
	`website` varchar(512),
	`googlePlaceId` varchar(255),
	`googleRating` float,
	`googleReviewCount` int,
	`latitude` float,
	`longitude` float,
	`hasNoWebsite` boolean DEFAULT false,
	`hasLowReviews` boolean DEFAULT false,
	`hasPoorBooking` boolean DEFAULT false,
	`hasWeakCta` boolean DEFAULT false,
	`leadScore` int DEFAULT 0,
	`disposition` enum('new','contacted','qualified','proposal','won','lost') NOT NULL DEFAULT 'new',
	`assignedTo` varchar(128),
	`source` enum('google_maps','facebook','referral','manual','cold_call') NOT NULL DEFAULT 'manual',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`authorName` varchar(128) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`intakeId` int,
	`projectName` varchar(255) NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`description` text,
	`projectStatus` enum('planning','design','development','review','revision','completed','on_hold') NOT NULL DEFAULT 'planning',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`startDate` timestamp,
	`dueDate` timestamp,
	`completedDate` timestamp,
	`quotedPrice` float,
	`previewUrl` varchar(512),
	`liveUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scrape_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`query` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`radius` int DEFAULT 5000,
	`scrapeStatus` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
	`totalFound` int DEFAULT 0,
	`leadsCreated` int DEFAULT 0,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `scrape_jobs_id` PRIMARY KEY(`id`)
);
