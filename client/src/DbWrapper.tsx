import { createContext, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Person, Place } from './entities'
import { IDbActions, IItem, ItemTypes, usePersonDb, usePlaceDb } from './db/Faunadb'
import { PlaceTypes } from './entities/Place'
import { Location, MoodBoy } from 'tabler-icons-react'
import { PersonTypes } from './entities/Person'
import { FormGroupCfg } from './forms/FormGroupCfg'
import { PersonFormGrpCfg } from './forms/PersonForm'
import { PlaceFormGrpCfg } from './forms/PlaceForm'

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
    updateCache: (items: T[]) => void
    items: T[]
    formGrpCfg: FormGroupCfg<T>
}

export interface IDbContext {
    peopleCol: IItemCollection<Person>
    placesCol: IItemCollection<Place>
}

export const DbContext = createContext<IDbContext>({} as IDbContext)

const queryClient = new QueryClient()

export const DbWrapper = (props: any) => {
    const [ people, setPeople ] = useState<Person[]>([])
    const [ places, setPlaces ] = useState<Place[]>([])

    const peopleCol: IItemCollection<Person> = useMemo(() => ({
        name: 'people',
        singular: 'person',
        getNew: () => new Person(),
        useDbHook: usePersonDb,
        getId: (p: Person) => `${p.type}_${p.name}`,
        getTitle: (p: Person) => `${PersonTypes[p.type].short}: ${p.name}`,
        icon: <MoodBoy />,
        updateCache: setPeople,
        items: people,
        types: PersonTypes,
        formGrpCfg: PersonFormGrpCfg
    }), [people])

    const placesCol: IItemCollection<Place> = useMemo(() => ({
        name: 'places',
        singular: 'place',
        getNew: () => new Place(),
        useDbHook: usePlaceDb,
        getId: (p: Place) => `${p.type}_${p.name}`,
        getTitle: (p: Place) => `${PlaceTypes[p.type].short}: ${p.name}`,
        icon: <Location />,
        updateCache: setPlaces,
        items: places,
        types: PlaceTypes,
        formGrpCfg: PlaceFormGrpCfg
    }), [places])

    return <QueryClientProvider client={queryClient}>
        <DbContext.Provider value={{ peopleCol, placesCol }} children={props.children} />
    </QueryClientProvider>
}