import { useContext } from 'react'
import { Person } from '../entities'
import { PersonForm } from '../forms/PersonForm'
import { AppPage, ItemFiltersProps } from './AppPage'
import { PersonFilters } from '../forms/PersonFilters'
import { DbContext } from '../DbWrapper'
import { ItemFormProps } from '../forms/ItemForm'

export const People = () =>
    <AppPage<Person>
        collection={useContext(DbContext).peopleCol}
        renderFilters={(props: ItemFiltersProps<Person>) => <PersonFilters {...props} />}
        renderForm={(props: ItemFormProps<Person>) => <PersonForm {...props} />}
    />