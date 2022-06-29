import { FC, useContext } from 'react'
import { Textarea } from '@mantine/core'

import { FormGroupCfg } from './FormGroupCfg'
import { Place } from '../entities/Place'
import { ItemForm, ItemFormProps } from './ItemForm'
import { DbContext } from '../DbWrapper'
import { ItemInput } from './ItemInput'

export const PlaceFormGrpCfg: FormGroupCfg<Place> = {
   name:        { placeholder: 'location name', initFocus: true, required: true },
   appearance:  { render: p => <Textarea {...p} /> },
   location:    {
    placeholder: 'i.e. city where vendor is located',
    span: 8,
    render: p => <ItemInput collection='places' {...p} />
  },
   description: {
      render: p => <Textarea {...p} />,
      label: 'description / notes',
      span: 12,
      placeholder: 'additional relevant detail'
   },
}

export const PlaceForm: FC<ItemFormProps<Place>> = props => {
  const { placesCol } = useContext(DbContext)
  return <ItemForm<Place>
      {...props}
      col={placesCol}
  />
}