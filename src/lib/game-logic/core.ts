export const GAME_CONFIG = {
    degradeInterval: 14400000, // 4 hours in ms
    stats: {
        maxHealth: 100,
        maxHappiness: 100,
        maxHunger: 100
    },
    evolution: {
        baby: { minLevel: 1, maxLevel: 5 },
        teen: { minLevel: 6, maxLevel: 15 },
        adult: { minLevel: 16, maxLevel: 99 }
    },
    expToLevelUp: 100
};

export type PetType = 'base-bull' | 'eth-dragon' | 'meme-dog' | 'crypto-cat' | 'defi-phoenix';
export type PetStage = 'egg' | 'baby' | 'teen' | 'adult' | 'ghost';

export interface PetData {
    petType: PetType | null;
    name: string;
    level: number;
    experience: number;
    health: number;
    happiness: number;
    hunger: number;
    lastFed: number;
    lastPlayed: number;
    wins: number;
    losses: number;
    bornTime: number;
}

export const INITIAL_PET_STATE: PetData = {
    petType: null,
    name: '',
    level: 1,
    experience: 0,
    health: 100,
    happiness: 100,
    hunger: 100,
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    wins: 0,
    losses: 0,
    bornTime: Date.now()
};

export function getPetStage(level: number, health: number): PetStage {
    if (health <= 0) return 'ghost';
    if (level < 1) return 'egg';
    if (level <= GAME_CONFIG.evolution.baby.maxLevel) return 'baby';
    if (level <= GAME_CONFIG.evolution.teen.maxLevel) return 'teen';
    return 'adult';
}

export function calculateDegradation(interactionTime: number, rate: number): number {
    const now = Date.now();
    const diff = now - interactionTime;
    const periods = Math.floor(diff / GAME_CONFIG.degradeInterval);
    return periods * rate;
}
