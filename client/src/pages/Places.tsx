import { useContext } from 'react'
import { Place } from '../entities/Place'
import { PlaceFilters } from '../forms/PlaceFilters'
import { PlaceForm } from '../forms/PlaceForm'
import { AppPage, ItemFiltersProps } from './AppPage'
import { DbContext } from '../DbWrapper'
import { ItemFormProps } from '../forms/ItemForm'

export const Places = () => {
    const { placesCol } = useContext(DbContext)
    return <AppPage<Place>
        collection={placesCol}
        renderFilters={(props: ItemFiltersProps<Place>) => <PlaceFilters {...props} />}
        renderForm={(props: ItemFormProps<Place>) => <PlaceForm {...props} />}
    />
}