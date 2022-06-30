import { useContext } from 'react'
import { Person } from '../entities'
import { AppPage } from './AppPage'
import { DbContext } from '../DbWrapper'

export const People = () =>
    <AppPage<Person> col={useContext(DbContext).peopleCol} />