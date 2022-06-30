import { createContext, useMemo } from 'react'
import { useQuery } from 'react-query'
import { Person, Place } from './entities'
import { IDbActions, IItem, ItemTypes, usePersonDb, usePlaceDb } from './db/Faunadb'
import { PlaceTypes } from './entities/Place'
import { Location, MoodBoy } from 'tabler-icons-react'
import { PersonTypes } from './entities/Person'
import { FormGroupCfg } from './forms/FormGroupCfg'
import { PersonFormGrpCfg } from './forms/PersonForm'
import { PlaceFormGrpCfg } from './forms/PlaceForm'
import { showNotification } from '@mantine/notifications'

export interface ICollection {
    name: string
    singular: string
    icon: JSX.Element,
    types: ItemTypes
}

export interface IItemCollection<T extends IItem> extends ICollection {
    getNew: () => T
    useDbHook: () => IDbActions<T>
    getId: (item: T) => string,
    getTitle: (item: T) => string,
    items: T[]
    dbStatus: string
    dbFetching: boolean
    formGrpCfg: FormGroupCfg<T>
}

export interface IFindItemResult {
    item: IItem
    id: string
    collection: string
}

export interface IDbContext {
    peopleCol: IItemCollection<Person>
    placesCol: IItemCollection<Place>
    findItemById: (id: string) => IFindItemResult | undefined
}

export const DbContext = createContext<IDbContext>({} as IDbContext)

export const DbWrapper = (props: any) => {
    const getItems = <T extends IItem>(getAll: () => Promise<T[]>, colName: string) => async () => {
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
        formGrpCfg: PersonFormGrpCfg
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
        formGrpCfg: PlaceFormGrpCfg
    }), [plQry])

    const findItemById = useMemo(() =>
        (id: string) => {
            if (!id) return undefined
            const person = peopleCol.items.find(p => p.id === id)
            if (person) return { item: person, id, collection: 'people' }
            const place = placesCol.items.find(p => p.id === id)
            if (place) return { item: place, id, collection: 'places' }
            return undefined
        }
    , [peopleCol, placesCol])

    return <DbContext.Provider value={{ peopleCol, placesCol, findItemById }} children={props.children} />
}