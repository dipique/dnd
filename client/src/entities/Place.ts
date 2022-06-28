export class Place {
    id: string = ''
    name: string = ''
    type: PlaceTypeKey = DefaultPlaceType
    img?: string = ''
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