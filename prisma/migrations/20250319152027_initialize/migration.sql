-- CreateTable
CREATE TABLE `lobbies` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    `room_code` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lobby_logs` (
    `id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `lobby_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(11) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    `role` ENUM('RESISTANCE', 'SPY') NULL,
    `name` TEXT NOT NULL,
    `lobby_id` VARCHAR(191) NULL,
    `room_role` ENUM('MASTER', 'MEMBER') NOT NULL DEFAULT 'MEMBER',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `missions` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'ASSIGNING', 'VOTING', 'IN_PLAY', 'CLOSE') NOT NULL DEFAULT 'OPEN',
    `result` ENUM('SUCCESS', 'FAIL') NULL,
    `name` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    `leader_id` VARCHAR(191) NOT NULL,
    `lobby_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission_logs` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `mission_id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission_players` (
    `id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `mission_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission_votes` (
    `id` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `mission_id` VARCHAR(191) NOT NULL,
    `vote` ENUM('APPROVE', 'REJECT') NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission_vote_logs` (
    `id` VARCHAR(191) NOT NULL,
    `mission_vote_id` VARCHAR(191) NOT NULL,
    `mission_player_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lobby_logs` ADD CONSTRAINT `lobby_logs_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `lobby_logs` ADD CONSTRAINT `lobby_logs_lobby_id_fkey` FOREIGN KEY (`lobby_id`) REFERENCES `lobbies`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `players_lobby_id_fkey` FOREIGN KEY (`lobby_id`) REFERENCES `lobbies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `missions` ADD CONSTRAINT `missions_leader_id_fkey` FOREIGN KEY (`leader_id`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `missions` ADD CONSTRAINT `missions_lobby_id_fkey` FOREIGN KEY (`lobby_id`) REFERENCES `lobbies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission_logs` ADD CONSTRAINT `mission_logs_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission_logs` ADD CONSTRAINT `mission_logs_mission_id_fkey` FOREIGN KEY (`mission_id`) REFERENCES `missions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission_players` ADD CONSTRAINT `mission_players_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission_players` ADD CONSTRAINT `mission_players_mission_id_fkey` FOREIGN KEY (`mission_id`) REFERENCES `missions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission_votes` ADD CONSTRAINT `mission_votes_mission_id_fkey` FOREIGN KEY (`mission_id`) REFERENCES `missions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission_votes` ADD CONSTRAINT `mission_votes_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission_vote_logs` ADD CONSTRAINT `mission_vote_logs_mission_vote_id_fkey` FOREIGN KEY (`mission_vote_id`) REFERENCES `mission_votes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission_vote_logs` ADD CONSTRAINT `mission_vote_logs_mission_player_id_fkey` FOREIGN KEY (`mission_player_id`) REFERENCES `mission_players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
