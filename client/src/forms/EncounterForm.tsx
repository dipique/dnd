import { FC, useContext } from 'react'
import { Textarea } from '@mantine/core'

import { FormGroupCfg } from './FormGroupCfg'
import { Encounter } from '../entities'
import { ItemForm, ItemFormProps } from './ItemForm'
import { DbContext } from '../DbWrapper'
import { ItemInput } from './ItemInput'

export const EncounterFormGrpCfg: FormGroupCfg<Encounter> = {
   name:        { placeholder: 'location name', initFocus: true, required: true },
   location:    {
      placeholder: 'location of encounter',
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

export const EncounterForm: FC<ItemFormProps<Encounter>> = props => {
  const { encountersCol } = useContext(DbContext)
  return <ItemForm<Encounter>
      {...props}
      col={encountersCol}
  />
}