/*
  Warnings:

  - You are about to drop the column `type` on the `FileTimestamp` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `FileTimestamp` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE `FileTimestampType` (
    `typeId` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(16) NOT NULL,

    PRIMARY KEY (`typeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FileTimestamp` ADD CONSTRAINT `FileTimestamp_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `FileTimestampType`(`typeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
