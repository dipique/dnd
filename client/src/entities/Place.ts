import { DbItem } from '../db/Faunadb'

export class Place extends DbItem {
    type: PlaceTypeKey = DefaultPlaceType
    location?: string
    appearance?: string = ''
    description?: string = ''
    
    notes?: string = ''
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
    shop:   {
        display: 'shop',
        short: 'shop',
    },
    residence:   {
        display: 'residence',
        short: 'residence',
    },
    other: {
        display: 'other',
        short: 'other'
    }
} as const

export type PlaceTypeKey = keyof typeof PlaceTypes
export const DefaultPlaceType: PlaceTypeKey = 'city'