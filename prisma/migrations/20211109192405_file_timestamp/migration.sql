-- CreateTable
CREATE TABLE `FileTimestamp` (
    `fileId` VARCHAR(16) NOT NULL,
    `typeId` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FileTimestamp` ADD CONSTRAINT `FileTimestamp_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`fileId`) ON DELETE RESTRICT ON UPDATE CASCADE;
