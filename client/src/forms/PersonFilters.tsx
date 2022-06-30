import { SegmentedControl } from '@mantine/core'
import { Person } from '../entities'
import { PersonTypeKey, PersonTypes } from '../entities/Person'
import { ItemFiltersProps } from '../pages/AppPage'


export const PersonFilters = ({
   filters, setFilters
}: ItemFiltersProps<Person>) => <SegmentedControl
   size='md'
   data={[
      { value: '', label: 'all' },
      ...Object.entries(PersonTypes).map(([key, pt]) => ({
         value: key,
         label: key
      }))
   ]}
   defaultValue={filters.type}
   onChange={(v: PersonTypeKey | '') => setFilters({ type: v })}
/>