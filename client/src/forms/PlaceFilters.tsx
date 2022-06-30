import { SegmentedControl } from '@mantine/core'
import { Place, PlaceTypeKey, PlaceTypes } from '../entities/Place'
import { ItemFiltersProps } from '../pages/AppPage'


export const PlaceFilters = ({
   filters, setFilters
}: ItemFiltersProps<Place>) => <SegmentedControl
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