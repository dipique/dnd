import { SegmentedControl } from '@mantine/core'
import { Place, PlaceTypeKey, PlaceTypes } from '../entities/Place'
import { ItemFilters } from '../pages/AppPage'


export const PlaceFilters: ItemFilters<Place> = ({
   filters, setFilters
}) => <SegmentedControl
   size='md'
   data={[
      { value: '', label: 'all' },
      ...Object.entries(PlaceTypes).map(([key, pt]) => ({
         value: key,
         label: key
      }))
   ]}
   defaultValue={filters.type}
   onChange={(v: PlaceTypeKey | '') => setFilters({ type: v })}
/>