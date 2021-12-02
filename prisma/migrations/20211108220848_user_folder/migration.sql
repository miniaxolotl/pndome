-- CreateTable
CREATE TABLE `UserFolder` (
    `userId` VARCHAR(16) NOT NULL,
    `folderId` VARCHAR(16) NOT NULL,
    `access` BOOLEAN NOT NULL DEFAULT true,
    `owner` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`userId`, `folderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserFolder` ADD CONSTRAINT `UserFolder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFolder` ADD CONSTRAINT `UserFolder_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`folderId`) ON DELETE RESTRICT ON UPDATE CASCADE;
