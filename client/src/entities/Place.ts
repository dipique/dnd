import { IItem } from '../db/Faunadb'

export class Place implements IItem {
    id: string = ''
    name: string = ''
    type: PlaceTypeKey = DefaultPlaceType
    location?: string
    image?: string = ''
    appearance?: string = ''
    description?: string = ''
    
    notes?: string = ''

    constructor(type?: PlaceTypeKey) {
        if (type)
            this.type = type
    }
}

export const PlaceTypes = {
    city:  {
        display: 'city',
        short: 'city',
    },
    nation: {
        display: 'nation',
        short: 'nation',
    },
    building:   {
        display: 'building',
        short: 'building',
    },
    encounter: {
        display: 'encounter',
        short: 'encounter',
    },
    other: {
        display: 'other',
        short: 'other'
    }
} as const

export type PlaceTypeKey = keyof typeof PlaceTypes
export const DefaultPlaceType: PlaceTypeKey = 'city'