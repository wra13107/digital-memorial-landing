ALTER TABLE `users` DROP INDEX `users_emailVerificationToken_unique`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `emailVerificationToken`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `emailVerificationExpiry`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `emailVerified`;