import { Person } from '../entities'
import { PersonForm } from '../forms/PersonForm'
import { PersonTable } from '../forms/PersonTable'
import { usePersonDb } from '../db/Faunadb'
import { MoodBoy } from 'tabler-icons-react'
import { PersonTypes } from '../entities/Person'
import { AppPage, ItemFiltersProps, ItemFormProps, ItemTableProps } from './AppPage'
import { PersonFilters } from '../forms/PersonFilters'

export const People = () =>
    <AppPage<Person>
        useDbHook={usePersonDb}
        renderFilters={(props: ItemFiltersProps<Person>) => <PersonFilters {...props} />}
        renderTable={(props: ItemTableProps<Person>) => <PersonTable {...props} />}
        renderForm={(props: ItemFormProps<Person>) => <PersonForm {...props} />}
        strings={{
            pageTitle: 'People',
            itemSingular: 'people',
            itemPlural: 'people',
            collectionName: 'people',
        }}
        spotlightFns={{
            getId: (p: Person) => `${p.type}_${p.name}`,
            getTitle: (p: Person) => `${PersonTypes[p.type].short}: ${p.name}`,
            icon: <MoodBoy />
        }}
        applyFilter={(p: Person, filter: any) => !filter?.type || p.type === filter.type}
    />