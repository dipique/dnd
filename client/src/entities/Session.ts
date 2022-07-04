import { DbItem } from '../db/Faunadb'

export interface SessionEvent {
    locations: string[]
    people: string[]
    description: string
    details: string
}

export class Session extends DbItem  {
    type: SessionTypeKey = DefaultSessionType
    startLocation?: string = ''
    events: SessionEvent[] = []   
    description?: string = ''
    
    notes?: string = ''
}

export const SessionTypes = {
    normal:  {
        display: 'normal',
        short: 'normal',
    },
} as const

export type SessionTypeKey = keyof typeof SessionTypes
export const DefaultSessionType: SessionTypeKey = 'normal'