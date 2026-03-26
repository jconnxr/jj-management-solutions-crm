CREATE TABLE `generated_websites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`serviceType` varchar(128),
	`services` text,
	`location` varchar(255),
	`phone` varchar(32),
	`aboutInfo` text,
	`htmlUrl` varchar(1024) NOT NULL,
	`previewToken` varchar(64) NOT NULL,
	`websiteStatus` enum('generating','ready','sent','approved','rejected') NOT NULL DEFAULT 'generating',
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generated_websites_id` PRIMARY KEY(`id`),
	CONSTRAINT `generated_websites_previewToken_unique` UNIQUE(`previewToken`)
);
