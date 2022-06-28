import { SegmentedControl } from '@mantine/core'
import { Place, PlaceTypeKey, PlaceTypes } from '../entities/Place'
import { ItemFilters } from '../pages/AppPage'


export const PlaceFilters: ItemFilters<Place> = ({
   filters, setFilters
}) => <SegmentedControl
   size='md'
   data={[
      { value: '', label: 'All' },
      ...Object.entries(PlaceTypes).map(([key, pt]) => ({
         value: key,
         label: pt.short
      }))
   ]}
   defaultValue={filters.type}
   onChange={(v: PlaceTypeKey | '') => setFilters({ type: v })}
/>