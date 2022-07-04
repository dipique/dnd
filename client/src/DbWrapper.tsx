import { createContext, useMemo } from 'react'
import { useQuery } from 'react-query'
import { showNotification } from '@mantine/notifications'
import { CalendarEvent, Location, MoodBoy, Swords } from 'tabler-icons-react'
import { DbItem, useItemDb } from './db/Faunadb'
import {
    ItemCollection,

    Person, PersonTypes,
    Place,  PlaceTypes,
    Encounter, EncounterTypes,
    Session, SessionTypes,
} from './entities'
import {
    PlaceForm, PlaceFormGrpCfg,
    PersonForm, PersonFormGrpCfg,
    EncounterForm, EncounterFormGrpCfg,
    SessionForm, SessionFormGrpCfg,
} from './forms'

export interface IFindItemResult<T extends DbItem> {
    item: T
    id: string
    collection: string
}

export const DbContext = createContext<IDbContext>({} as IDbContext)

export interface IDbContext {
    peopleCol: ItemCollection<Person>
    placesCol: ItemCollection<Place>
    encountersCol: ItemCollection<Encounter>
    sessionsCol: ItemCollection<Session>
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
    
    const getQry = <T extends DbItem>(name: string, getNew: () => T) =>
        useQuery(name, getItems(useItemDb<T>(name, getNew).getAll, name))

    const pplQry = getQry('people', () => new Person())
    const peopleCol = useMemo(() => new ItemCollection<Person>({
        name: 'people',
        singular: 'person',
        getNew: () => new Person(),
        icon: <MoodBoy />,
        types: PersonTypes,
        formGrpCfg: PersonFormGrpCfg,
        columns: [ { name: 'race' } ],
        renderForm: PersonForm,
    }, pplQry), [ pplQry ])
    
    const plQry = getQry('places', () => new Place())
    const placesCol = useMemo(() => new ItemCollection<Place> ({
        name: 'places',
        singular: 'place',
        getNew: () => new Place(),
        icon: <Location />,
        types: PlaceTypes,
        formGrpCfg: PlaceFormGrpCfg,
        columns: [ {
            name: 'location',
            value: (p, col, ctx) => p.location ? ctx.placesCol.getTitle(ctx.findItemById<Place>(p.location)?.item!) : '',
        } ],
        renderForm: PlaceForm,
    }, plQry), [plQry])

    const enQry = getQry('encounters', () => new Encounter())
    const encountersCol = useMemo(() => new ItemCollection<Encounter>({
        name: 'encounters',
        singular: 'encounter',
        getNew: () => new Encounter(),
        icon: <Swords />,
        types: EncounterTypes,
        formGrpCfg: EncounterFormGrpCfg,
        columns: [ {
            name: 'location',
            value: (p, col, ctx) => p.location ? ctx.placesCol.getTitle(ctx.findItemById<Place>(p.location)?.item!) : '',
        } ],
        renderForm: EncounterForm,
    }, enQry), [enQry])

    const sesQry = getQry('sessions', () => new Session())
    const sessionsCol = useMemo(() => new ItemCollection<Session>({
        name: 'sessions',
        singular: 'session',
        getNew: () => new Session(),
        icon: <CalendarEvent />,
        types: SessionTypes,
        formGrpCfg: SessionFormGrpCfg,
        columns: [ {
            name: 'location',
            value: (p, col, ctx) => p.startLocation ? ctx.placesCol.getTitle(ctx.findItemById<Place>(p.startLocation)?.item!) : '',
        } ],
        renderForm: SessionForm,
    }, sesQry), [sesQry])

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
    , [peopleCol, placesCol, encountersCol])

    return <DbContext.Provider value={{ peopleCol, placesCol, encountersCol, sessionsCol, findItemById }} children={props.children} />
}