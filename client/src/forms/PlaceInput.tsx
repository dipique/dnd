import { useContext } from 'react'
import { Select } from '@mantine/core'
import { DbContext } from '../DbWrapper'
import { PlaceTypes } from '../entities/Place'
import { Location } from 'tabler-icons-react'

export const PlaceInput = (props: any) => {
   const { placesCol } = useContext(DbContext)
   return <Select
      icon={<Location />}
      searchable
      data={placesCol.items.map(p => ({
         label: placesCol.spotlightFns.getTitle(p),
         group: PlaceTypes[p.type].display,
         value: p.id,
      }))}
      {...props}
   />
}