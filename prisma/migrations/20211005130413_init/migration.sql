-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
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
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `File_fileId_key`(`fileId`),
    UNIQUE INDEX `File_folderId_key`(`folderId`),
    INDEX `File_fileId_folderId_idx`(`fileId`, `folderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Folder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `folderId` VARCHAR(16) NOT NULL,
    `userId` VARCHAR(16) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `protected` BOOLEAN NOT NULL DEFAULT true,
    `dCount` INTEGER UNSIGNED NOT NULL,
    `vCount` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `Folder_folderId_key`(`folderId`),
    UNIQUE INDEX `Folder_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(16) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `User_userId_key`(`userId`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(64) NOT NULL,
    `userId` VARCHAR(16) NOT NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires` TIMESTAMP NOT NULL,

    UNIQUE INDEX `Session_sessionId_key`(`sessionId`),
    INDEX `Session_sessionId_userId_idx`(`sessionId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tokenId` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(16) NOT NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires` TIMESTAMP NOT NULL,

    UNIQUE INDEX `Token_tokenId_key`(`tokenId`),
    INDEX `Token_tokenId_userId_idx`(`tokenId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`folderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
