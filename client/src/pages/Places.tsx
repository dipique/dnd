import { useContext } from 'react'
import { Place } from '../entities'
import { AppPage } from './AppPage'
import { DbContext } from '../DbWrapper'

export const Places = () =>
    <AppPage<Place> col={useContext(DbContext).placesCol} />