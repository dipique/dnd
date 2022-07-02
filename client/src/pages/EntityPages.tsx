import { useContext } from 'react'
import { Encounter, Person, Place } from '../entities'
import { AppPage } from './AppPage'
import { DbContext } from '../DbWrapper'

export const People = () =>
    <AppPage<Person> col={useContext(DbContext).peopleCol} />

export const Places = () =>
    <AppPage<Place> col={useContext(DbContext).placesCol} />

export const Encounters = () =>
    <AppPage<Encounter> col={useContext(DbContext).encountersCol} />