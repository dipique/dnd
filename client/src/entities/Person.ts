import { association } from '../meta/TypeAssociation'
import { IItem } from '../db/Faunadb'

export class Person implements IItem  {
    id: string = ''
    name: string = ''
    type: PersonTypeKey = DefaultPersonType
    image?: string = ''
    player?: string = ''
    birthplace?: string = ''
    firstmet?: string = ''
    background?: string = ''
    
    @association('pc', 'npc') class?: string = ''
    @association('pc', 'npc') subclass?: string = ''

    gender?: string = ''
    age?: number
    race?: string = ''
    appearance?: string = ''
    description?: string = ''
    
    notes?: string = ''

    constructor(type?: PersonTypeKey) {
        if (type)
            this.type = type
    }
}

export const PersonTypes = {
    npc:  {
        display: 'Non-Player Character',
        short: 'NPC',
    },
    creature: {
        display: 'Creature',
        short: 'Creature',
    },
    pc:   {
        display: 'Player Character',
        short: 'PC',
    },
    lore: {
        display: 'Lore Character',
        short: 'Lore',
    },
} as const

export type PersonTypeKey = keyof typeof PersonTypes
export const DefaultPersonType: PersonTypeKey = 'pc'