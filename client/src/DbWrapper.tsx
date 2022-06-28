import { createContext, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { Person, Place } from './entities'
import { IDbActions, IItem, usePersonDb, usePlaceDb } from './db/Faunadb'
import { PlaceTypes } from './entities/Place'
import { Location, MoodBoy } from 'tabler-icons-react'
import { PersonTypes } from './entities/Person'
import { showNotification } from '@mantine/notifications'

export interface ICollection<T extends IItem> {
    name: string
    singular: string
    getNew: () => T
    useDbHook: () => IDbActions<T>
    spotlightFns: { getId: (item: T) => string, getTitle: (item: T) => string, icon: JSX.Element }
    updateCache: (items: T[]) => void
    items: T[]
}

export interface IDbContext {
    peopleCol: ICollection<Person>
    placesCol: ICollection<Place>
}

export const DbContext = createContext<IDbContext>({} as IDbContext)

const queryClient = new QueryClient()

export const DbWrapper = (props: any) => {
    const [ people, setPeople ] = useState<Person[]>([])
    const [ places, setPlaces ] = useState<Place[]>([])

    const peopleCol: ICollection<Person> = useMemo(() => ({
        name: 'people',
        singular: 'person',
        getNew: () => new Person(),
        useDbHook: usePersonDb,
        spotlightFns: {
            getId: (p: Person) => `${p.type}_${p.name}`,
            getTitle: (p: Person) => `${PersonTypes[p.type].short}: ${p.name}`,
            icon: <MoodBoy />
        },
        updateCache: setPeople,
        items: people,
    }), [people])

    const placesCol: ICollection<Place> = useMemo(() => ({
        name: 'places',
        singular: 'place',
        getNew: () => new Place(),
        useDbHook: usePlaceDb,
        spotlightFns: {
            getId: (p: Place) => `${p.type}_${p.name}`,
            getTitle: (p: Place) => `${PlaceTypes[p.type].short}: ${p.name}`,
            icon: <Location />
        },
        updateCache: setPlaces,
        items: places
    }), [places])

    return <QueryClientProvider client={queryClient}>
        <DbContext.Provider value={{ peopleCol, placesCol }} children={props.children} />
    </QueryClientProvider>
}