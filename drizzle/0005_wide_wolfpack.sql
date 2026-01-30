ALTER TABLE `users` ADD `passwordResetToken` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordResetExpiry` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_passwordResetToken_unique` UNIQUE(`passwordResetToken`);