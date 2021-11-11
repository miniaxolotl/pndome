-- AlterTable
ALTER TABLE `Session` ALTER COLUMN `expires` DROP DEFAULT;

-- CreateTable
CREATE TABLE `File` (
    `fileId` VARCHAR(16) NOT NULL,
    `folderId` VARCHAR(16) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(32) NOT NULL,
    `ext` VARCHAR(32) NOT NULL,
    `bytes` INTEGER UNSIGNED NOT NULL,
    `sha256` VARCHAR(64) NOT NULL,
    `md5` VARCHAR(32) NOT NULL,
    `dCount` INTEGER UNSIGNED NOT NULL,
    `vCount` INTEGER UNSIGNED NOT NULL,
    `deleted` DATETIME(3) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `File_fileId_key`(`fileId`),
    UNIQUE INDEX `File_folderId_key`(`folderId`),
    PRIMARY KEY (`fileId`, `folderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`folderId`) ON DELETE RESTRICT ON UPDATE CASCADE;
