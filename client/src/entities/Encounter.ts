import { DbItem } from '../db/Faunadb'

export class Encounter extends DbItem  {
    type: EncounterTypeKey = DefaultEncounterType
    location?: string = ''
    description?: string = ''
    notes?: string = ''
}

export const EncounterTypes = {
    normal:  {
        display: 'normal',
        short: 'normal',
    },
} as const

export type EncounterTypeKey = keyof typeof EncounterTypes
export const DefaultEncounterType: EncounterTypeKey = 'normal'