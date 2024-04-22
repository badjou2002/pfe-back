-- CreateTable
CREATE TABLE `Specialite` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Specialite_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Niveau` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `num` INTEGER NOT NULL,
    `specialiteId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EspaceCours` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `cleAccee` VARCHAR(255) NOT NULL,
    `niveauId` INTEGER UNSIGNED NOT NULL,
    `enseingantId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Theme` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `espaceCoursId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EspaceDepot` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `type` ENUM('image', 'video', 'autre') NOT NULL,
    `themeId` INTEGER UNSIGNED NOT NULL,
    `dateDebut` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateFin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ressource` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `file` VARCHAR(255) NOT NULL,
    `point` INTEGER NOT NULL,
    `type` ENUM('image', 'video', 'autre') NOT NULL,
    `themeId` INTEGER UNSIGNED NOT NULL,
    `dateDepot` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Test` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `point` INTEGER NOT NULL,
    `periode` INTEGER NOT NULL,
    `themeId` INTEGER UNSIGNED NOT NULL,
    `dateDebut` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateFin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BanqueQuestion` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `num` INTEGER NOT NULL,
    `desc` VARCHAR(255) NOT NULL,
    `espaceCoursId` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `BanqueQuestion_num_key`(`num`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reponse` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `num` INTEGER NOT NULL,
    `desc` VARCHAR(255) NOT NULL,
    `isCorrecte` BOOLEAN NOT NULL,
    `banqueQuestionId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commentaire` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `desc` VARCHAR(255) NOT NULL,
    `font` VARCHAR(255) NOT NULL,
    `italic` BOOLEAN NOT NULL,
    `ressourceId` INTEGER UNSIGNED NOT NULL,
    `userId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `prenom` VARCHAR(255) NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telephone` INTEGER NOT NULL,
    `role` ENUM('admin', 'etudiant', 'enseingant') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etudiant` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `matricule` INTEGER NOT NULL,
    `dateNaiss` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Etudiant_userId_key`(`userId`),
    UNIQUE INDEX `Etudiant_matricule_key`(`matricule`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enseingant` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `CIN` INTEGER NOT NULL,

    UNIQUE INDEX `Enseingant_userId_key`(`userId`),
    UNIQUE INDEX `Enseingant_CIN_key`(`CIN`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `CIN` INTEGER NOT NULL,
    `post` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Admin_userId_key`(`userId`),
    UNIQUE INDEX `Admin_CIN_key`(`CIN`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gamification` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `etudiantId` INTEGER UNSIGNED NOT NULL,
    `espaceCoursId` INTEGER UNSIGNED NOT NULL,
    `point` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resultat` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `etudiantId` INTEGER UNSIGNED NOT NULL,
    `testId` INTEGER UNSIGNED NOT NULL,
    `point` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestQuestion` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `point` INTEGER NOT NULL DEFAULT 1,
    `banqueQuestionId` INTEGER UNSIGNED NOT NULL,
    `testId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Depot` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `etudiantId` INTEGER UNSIGNED NOT NULL,
    `espaceDepotId` INTEGER UNSIGNED NOT NULL,
    `file` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Niveau` ADD CONSTRAINT `Niveau_specialiteId_fkey` FOREIGN KEY (`specialiteId`) REFERENCES `Specialite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EspaceCours` ADD CONSTRAINT `EspaceCours_niveauId_fkey` FOREIGN KEY (`niveauId`) REFERENCES `Niveau`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EspaceCours` ADD CONSTRAINT `EspaceCours_enseingantId_fkey` FOREIGN KEY (`enseingantId`) REFERENCES `Enseingant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Theme` ADD CONSTRAINT `Theme_espaceCoursId_fkey` FOREIGN KEY (`espaceCoursId`) REFERENCES `EspaceCours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EspaceDepot` ADD CONSTRAINT `EspaceDepot_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Test` ADD CONSTRAINT `Test_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BanqueQuestion` ADD CONSTRAINT `BanqueQuestion_espaceCoursId_fkey` FOREIGN KEY (`espaceCoursId`) REFERENCES `EspaceCours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reponse` ADD CONSTRAINT `Reponse_banqueQuestionId_fkey` FOREIGN KEY (`banqueQuestionId`) REFERENCES `BanqueQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Etudiant` ADD CONSTRAINT `Etudiant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enseingant` ADD CONSTRAINT `Enseingant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gamification` ADD CONSTRAINT `Gamification_etudiantId_fkey` FOREIGN KEY (`etudiantId`) REFERENCES `Etudiant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gamification` ADD CONSTRAINT `Gamification_espaceCoursId_fkey` FOREIGN KEY (`espaceCoursId`) REFERENCES `EspaceCours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resultat` ADD CONSTRAINT `Resultat_etudiantId_fkey` FOREIGN KEY (`etudiantId`) REFERENCES `Etudiant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resultat` ADD CONSTRAINT `Resultat_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestQuestion` ADD CONSTRAINT `TestQuestion_banqueQuestionId_fkey` FOREIGN KEY (`banqueQuestionId`) REFERENCES `BanqueQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestQuestion` ADD CONSTRAINT `TestQuestion_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Depot` ADD CONSTRAINT `Depot_etudiantId_fkey` FOREIGN KEY (`etudiantId`) REFERENCES `Etudiant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Depot` ADD CONSTRAINT `Depot_espaceDepotId_fkey` FOREIGN KEY (`espaceDepotId`) REFERENCES `EspaceDepot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
