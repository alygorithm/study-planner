export type PriorityLevel = 'bassa' | 'media' | 'alta';

// Pesi associati a ogni priorità per il calcolo del carico di studio
export const PRIORITY_WEIGHTS: Record<PriorityLevel, number> = {
    bassa: 1,
    media: 1.5,
    alta: 2
}
