import { createContext, FC, useMemo } from 'react'
import { useQuery } from 'react-query'
import { showNotification } from '@mantine/notifications'
import { Location, MoodBoy } from 'tabler-icons-react'
import { IDbActions, DbItem, useItemDb } from './db/Faunadb'
import { Person, Place, PersonTypes, PlaceTypes, IItemType, ItemTypes } from './entities'
import {
    FormGroupCfg,
    ItemTableColumnDef,
    ItemFormProps,

    PlaceForm,
    PlaceFormGrpCfg,
    PersonForm,
    PersonFormGrpCfg
} from './forms'

export interface ICollection {
    name: string
    singular: string
    icon: JSX.Element,
    types: ItemTypes
}

export interface IItemCollection<T extends DbItem> extends ICollection {
    getNew: () => T
    useDbHook: () => IDbActions<T>
    getId: (item: T) => string,
    getTitle: (item: T) => string,
    items: T[]
    dbStatus: string
    dbFetching: boolean
    formGrpCfg: FormGroupCfg<T>
    getType: (item: T) => IItemType
    columns: ItemTableColumnDef<T>[]
    applyFilter?: (item: T, filter: any) => boolean
    renderForm: FC<ItemFormProps<T>>
    useDb: () => IDbActions<T>
    types: ItemTypes
}

export interface IFindItemResult {
    item: DbItem
    id: string
    collection: string
}

export interface IDbContext {
    peopleCol: IItemCollection<Person>
    placesCol: IItemCollection<Place>
    findItemById: (id: string) => IFindItemResult | undefined
}

export const DbContext = createContext<IDbContext>({} as IDbContext)

export const usePersonDb = () => useItemDb<Person>('people', () => new Person())
export const usePlaceDb = () => useItemDb<Place>('places', () => new Place())

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
            value: (p, col) => p.location ? col.getTitle(col.items.find(i => i.id === p.location)!) : ''
        } ],
        renderForm: PlaceForm,
        useDb: usePlaceDb,
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