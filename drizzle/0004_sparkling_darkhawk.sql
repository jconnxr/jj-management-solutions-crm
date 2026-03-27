CREATE TABLE `ai_classifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`intakeSubmissionId` int NOT NULL,
	`bottleneckType` varchar(128) NOT NULL,
	`bottleneckSummary` text NOT NULL,
	`suggestedInstallType` varchar(128) NOT NULL,
	`suggestedTemplateFamily` varchar(128),
	`priorityScore` int DEFAULT 50,
	`reasoning` text,
	`rawResponse` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_classifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `install_packets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`intakeSubmissionId` int,
	`businessName` varchar(255) NOT NULL,
	`industry` varchar(128),
	`contactName` varchar(255),
	`contactPhone` varchar(32),
	`contactEmail` varchar(320),
	`installType` varchar(128) NOT NULL,
	`templateFamily` varchar(128),
	`stylePreset` varchar(128),
	`selectedSections` text,
	`contentSlots` text,
	`missingSlots` text,
	`ctaRecommendation` varchar(255),
	`operatorNotes` text,
	`packetStatus` enum('draft','in_review','approved','in_progress','delivered','on_hold') NOT NULL DEFAULT 'draft',
	`assignedTo` varchar(128),
	`createdBy` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `install_packets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intake_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerName` varchar(255) NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`industry` varchar(128),
	`phone` varchar(32),
	`email` varchar(320),
	`website` varchar(512),
	`address` text,
	`city` varchar(128),
	`state` varchar(64) DEFAULT 'OK',
	`biggestChallenge` text NOT NULL,
	`currentOnlinePresence` enum('no_website','outdated_website','no_google','few_reviews','no_social','other'),
	`monthlyBudget` varchar(64),
	`urgency` enum('asap','this_month','next_few_months','just_exploring') DEFAULT 'just_exploring',
	`howHeard` varchar(255),
	`submissionStatus` enum('new','classified','converted','archived') NOT NULL DEFAULT 'new',
	`leadId` int,
	`classificationId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `intake_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `packet_activity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`packetId` int NOT NULL,
	`action` varchar(128) NOT NULL,
	`fromStatus` varchar(64),
	`toStatus` varchar(64),
	`performedBy` varchar(128) NOT NULL,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `packet_activity_id` PRIMARY KEY(`id`)
);
