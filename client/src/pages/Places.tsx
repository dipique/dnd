import { useContext } from 'react'
import { Place } from '../entities/Place'
import { PlaceFilters } from '../forms/PlaceFilters'
import { PlaceForm } from '../forms/PlaceForm'
import { PlaceTable } from '../forms/PlaceTable'
import { AppPage, ItemFiltersProps, ItemTableProps } from './AppPage'
import { DbContext } from '../DbWrapper'
import { ItemFormProps } from '../forms/ItemForm'

export const Places = () => {
    const { placesCol } = useContext(DbContext)
    return <AppPage<Place>
        collection={placesCol}
        renderFilters={(props: ItemFiltersProps<Place>) => <PlaceFilters {...props} />}
        renderTable={(props: ItemTableProps<Place>) => <PlaceTable {...props} />}
        renderForm={(props: ItemFormProps<Place>) => <PlaceForm {...props} />}
        applyFilter={(p: Place, filter: any) => !filter?.type || p.type === filter.type}
    />
}