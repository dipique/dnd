import { SegmentedControl } from '@mantine/core'
import { DbItem } from '../db/Faunadb'
import { ItemTypes } from '../entities'

export type ItemFiltersProps<T extends DbItem> = {
   filters: any,
   setFilters: (filters: any) => void,
   types: ItemTypes
}

export const ItemFilters = <T extends DbItem>({
   filters, setFilters, types
}: ItemFiltersProps<T>) => <SegmentedControl
   size='md'
   data={[
      { value: '', label: 'all' },
      ...Object.entries(types).map(([key, pt]) => ({
         value: key,
         label: key
      }))
   ]}
   defaultValue={filters.type}
   onChange={v => setFilters({ type: v })}
/>