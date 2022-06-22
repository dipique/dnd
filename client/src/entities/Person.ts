import { combatant } from "../meta/Combatant"

export class Person {
    name: string = ''
    type: string = ''
    img?: string = ''
    player?: string = ''
    birthplace?: string = ''
    firstmet?: string = ''
    background?: string = ''
    
    @combatant class?: string = ''
    @combatant subclass?: string = ''

    gender?: string = ''
    age?: number
    race?: string = ''
    appearance?: string = ''
    description?: string = ''
    
    notes?: string = ''
}

export const PersonTypes = {
    npc:  {
        display: 'Non-Player Character',
        short: 'NPC',
        combatant: true,
    },
    creature: {
        display: 'Creature',
        short: 'Creature',
        combatant: false
    },
    pc:   {
        display: 'Player Character',
        short: 'PC',
        combatant: true,
    },
    lore: {
        display: 'Lore Character',
        short: 'Lore',
        combatant: false,
    },
} as const

export type PersonTypeKey = keyof typeof PersonTypes
