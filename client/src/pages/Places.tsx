import { Location } from 'tabler-icons-react'
import { usePlaceDb } from '../db/Faunadb'
import { Place, PlaceTypes } from '../entities/Place'
import { PlaceFilters } from '../forms/PlaceFilters'
import { PlaceForm } from '../forms/PlaceForm'
import { PlaceTable } from '../forms/PlaceTable'
import { AppPage, ItemFiltersProps, ItemFormProps, ItemTableProps } from './AppPage'

export const Places = () =>
    <AppPage<Place>
        useDbHook={usePlaceDb}
        renderFilters={(props: ItemFiltersProps<Place>) => <PlaceFilters {...props} />}
        renderTable={(props: ItemTableProps<Place>) => <PlaceTable {...props} />}
        renderForm={(props: ItemFormProps<Place>) => <PlaceForm {...props} />}
        strings={{
            pageTitle: 'Places',
            itemSingular: 'place',
            itemPlural: 'places',
            collectionName: 'places',
        }}
        spotlightFns={{
            getId: (p: Place) => `${p.type}_${p.name}`,
            getTitle: (p: Place) => `${PlaceTypes[p.type].short}: ${p.name}`,
            icon: <Location />
        }}
        applyFilter={(p: Place, filter: any) => !filter?.type || p.type === filter.type}
    />