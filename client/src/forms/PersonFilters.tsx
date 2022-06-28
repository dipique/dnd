import { SegmentedControl } from '@mantine/core'
import { Person } from '../entities'
import { PersonTypeKey, PersonTypes } from '../entities/Person'
import { ItemFilters } from '../pages/AppPage'


export const PersonFilters: ItemFilters<Person> = ({
   filters, setFilters
}) => <SegmentedControl
   size='md'
   data={[
      { value: '', label: 'All' },
      ...Object.entries(PersonTypes).map(([key, pt]) => ({
         value: key,
         label: pt.short
      }))
   ]}
   defaultValue={filters.type}
   onChange={(v: PersonTypeKey | '') => setFilters({ type: v })}
/>