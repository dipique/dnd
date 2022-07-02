import { createContext, useMemo } from 'react'
import { useQuery } from 'react-query'
import { showNotification } from '@mantine/notifications'
import { Location, MoodBoy, Swords } from 'tabler-icons-react'
import { DbItem, useItemDb } from './db/Faunadb'
import {
    IItemCollection,
    Person, PersonTypes,
    Place,  PlaceTypes,
    Encounter, EncounterTypes,
} from './entities'
import {
    PlaceForm, PlaceFormGrpCfg,
    PersonForm, PersonFormGrpCfg,
    EncounterForm, EncounterFormGrpCfg,
} from './forms'

export interface IFindItemResult<T extends DbItem> {
    item: T
    id: string
    collection: string
}

export const DbContext = createContext<IDbContext>({} as IDbContext)
export const usePersonDb = () => useItemDb<Person>('people', () => new Person())
export const usePlaceDb = () => useItemDb<Place>('places', () => new Place())
export const useEncounterDb = () => useItemDb<Encounter>('encounters', () => new Encounter())

export interface IDbContext {
    peopleCol: IItemCollection<Person>
    placesCol: IItemCollection<Place>
    encountersCol: IItemCollection<Encounter>
    findItemById: <T extends DbItem>(id: string) => IFindItemResult<T> | undefined
}


export const DbWrapper = (props: any) => {
    const getItems = <T extends DbItem>(getAll: () => Promise<T[]>, colName: string) => async () => {
        try {
            return await getAll()
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: `Failed to fetch ${colName}`
            })
            return []
        }
    }

    const pplDb = usePersonDb()
    const pplQry = useQuery('people', getItems(pplDb.getAll, 'people'))
    const plDb = usePlaceDb()
    const plQry = useQuery('places', getItems(plDb.getAll, 'places'))
    const enDb = useEncounterDb()
    const enQry = useQuery('encounters', getItems(enDb.getAll, 'encounters'))

    const peopleCol: IItemCollection<Person> = useMemo(() => ({
        name: 'people',
        singular: 'person',
        getNew: () => new Person(),
        useDbHook: usePersonDb,
        getId: (p: Person) => `${p.type}_${p.name}`,
        getTitle: (p: Person) => `${PersonTypes[p.type].short}: ${p.name}`,
        icon: <MoodBoy />,
        items: pplQry.data || [],
        dbStatus: pplQry.status,
        dbFetching: pplQry.isFetching,
        types: PersonTypes,
        formGrpCfg: PersonFormGrpCfg,
        getType: (p: Person) => PersonTypes[p.type],
        columns: [ { name: 'race' } ],
        renderForm: PersonForm,
        useDb: usePersonDb,
    }), [ pplQry ])

    const placesCol: IItemCollection<Place> = useMemo(() => ({
        name: 'places',
        singular: 'place',
        getNew: () => new Place(),
        useDbHook: usePlaceDb,
        getId: (p: Place) => `${p.type}_${p.name}`,
        getTitle: (p: Place) => `${PlaceTypes[p.type].short}: ${p.name}`,
        icon: <Location />,
        items: plQry.data || [],
        dbStatus: plQry.status,
        dbFetching: plQry.isFetching,
        types: PlaceTypes,
        formGrpCfg: PlaceFormGrpCfg,
        getType: (p: Place) => PlaceTypes[p.type],
        columns: [ {
            name: 'location',
            value: (p, col, ctx) => p.location ? ctx.placesCol.getTitle(ctx.findItemById<Place>(p.location)?.item!) : '',
        } ],
        renderForm: PlaceForm,
        useDb: usePlaceDb,
    }), [plQry])

    const encountersCol: IItemCollection<Encounter> = useMemo(() => ({
        name: 'encounters',
        singular: 'encounter',
        getNew: () => new Encounter(),
        useDbHook: useEncounterDb,
        getId: (p: Encounter) => `${p.type}_${p.name}`,
        getTitle: (p: Encounter) => `${EncounterTypes[p.type].short}: ${p.name}`,
        icon: <Swords />,
        items: enQry.data || [],
        dbStatus: enQry.status,
        dbFetching: enQry.isFetching,
        types: EncounterTypes,
        formGrpCfg: EncounterFormGrpCfg,
        getType: (p: Encounter) => EncounterTypes[p.type],
        columns: [ {
            name: 'location',
            value: (p, col, ctx) => p.location ? ctx.placesCol.getTitle(ctx.findItemById<Place>(p.location)?.item!) : '',
        } ],
        renderForm: EncounterForm,
        useDb: useEncounterDb,
    }), [enQry])

    const findItemById = useMemo(() =>
        <T extends DbItem>(id: string): IFindItemResult<T> | undefined => {
            if (!id) return undefined
            const person = peopleCol.items.find(p => p.id === id)
            if (person) return { item: person as T, id, collection: 'people' }
            const place = placesCol.items.find(p => p.id === id)
            if (place) return { item: place as T, id, collection: 'places' }
            const encounter = encountersCol.items.find(p => p.id === id)
            if (encounter) return { item: encounter as T, id, collection: 'encounters' }
            return undefined
        }
    , [peopleCol, placesCol])

    return <DbContext.Provider value={{ peopleCol, placesCol, encountersCol, findItemById }} children={props.children} />
}