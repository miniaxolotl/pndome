-- AlterTable
ALTER TABLE `Session` ALTER COLUMN `expires` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Folder` (
    `folderId` VARCHAR(16) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NULL,
    `protected` BOOLEAN NOT NULL DEFAULT true,
    `dCount` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `vCount` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `deleted` DATETIME(3) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`folderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
