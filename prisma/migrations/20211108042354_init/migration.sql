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
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `File_fileId_key`(`fileId`),
    INDEX `File_fileId_folderId_idx`(`fileId`, `folderId`),
    PRIMARY KEY (`fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Folder` (
    `folderId` VARCHAR(16) NOT NULL,
    `userId` VARCHAR(16) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `protected` BOOLEAN NOT NULL DEFAULT true,
    `dCount` INTEGER UNSIGNED NOT NULL,
    `vCount` INTEGER UNSIGNED NOT NULL,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`folderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `roleId` VARCHAR(16) NOT NULL,
    `authority` TINYINT UNSIGNED NOT NULL,

    UNIQUE INDEX `Role_roleId_key`(`roleId`),
    UNIQUE INDEX `Role_authority_key`(`authority`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userId` VARCHAR(16) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `clientId` VARCHAR(255) NOT NULL,
    `clientSecret` VARCHAR(16) NOT NULL,
    `redirectUri` VARCHAR(255) NOT NULL,
    `scope` VARCHAR(255) NOT NULL,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `disabled` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Client_clientSecret_key`(`clientSecret`),
    INDEX `Client_clientId_clientSecret_idx`(`clientId`, `clientSecret`),
    PRIMARY KEY (`clientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `sessionId` VARCHAR(64) NOT NULL,
    `userId` VARCHAR(16) NOT NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires` TIMESTAMP NOT NULL,

    INDEX `Session_sessionId_userId_idx`(`sessionId`, `userId`),
    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `tokenId` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(16) NOT NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires` TIMESTAMP NOT NULL,

    INDEX `Token_tokenId_userId_idx`(`tokenId`, `userId`),
    PRIMARY KEY (`tokenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` VARCHAR(16) NOT NULL,
    `userId` VARCHAR(16) NOT NULL,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserRole_roleId_userId_key`(`roleId`, `userId`),
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

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
