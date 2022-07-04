import { DbItem } from '../db/Faunadb'

export class Mission extends DbItem  {
    type: MissionTypeKey = DefaultMissionType
    location?: string = ''
    description?: string = ''
    notes?: string = ''
}

export const MissionTypes = {
    normal:  {
        display: 'normal',
        short: 'normal',
    },
} as const

export type MissionTypeKey = keyof typeof MissionTypes
export const DefaultMissionType: MissionTypeKey = 'normal'