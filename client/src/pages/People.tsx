import { useContext } from 'react'
import { Person } from '../entities'
import { PersonForm } from '../forms/PersonForm'
import { PersonTable } from '../forms/PersonTable'
import { AppPage, ItemFiltersProps, ItemFormProps, ItemTableProps } from './AppPage'
import { PersonFilters } from '../forms/PersonFilters'
import { DbContext } from '../DbWrapper'

export const People = () =>
    <AppPage<Person>
        collection={useContext(DbContext).peopleCol}
        renderFilters={(props: ItemFiltersProps<Person>) => <PersonFilters {...props} />}
        renderTable={(props: ItemTableProps<Person>) => <PersonTable {...props} />}
        renderForm={(props: ItemFormProps<Person>) => <PersonForm {...props} />}
        applyFilter={(p: Person, filter: any) => !filter?.type || p.type === filter.type}
    />