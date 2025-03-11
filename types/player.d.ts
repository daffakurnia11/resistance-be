import { Player, PlayerRoleEnum } from '@prisma/client';

export type PlayerWithRoleType = Player & { role: PlayerRoleEnum };
