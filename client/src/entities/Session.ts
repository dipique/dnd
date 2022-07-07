import { DbItem } from '../db/Faunadb'

// export interface SessionEvent {
//     location: string
//     people: string[]
//     description: string
//     details: string
// }

export class Session extends DbItem  {
    type: SessionTypeKey = DefaultSessionType
    date?: Date
    startLocation: string = ''
    // events: SessionEvent[] = []
    summary: string = ''
    
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