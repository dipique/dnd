import { NumberInput, Textarea } from '@mantine/core'

import { Person } from '../entities'
import { FC, useContext } from 'react'
import { FormGroupCfg } from './FormGroupCfg'
import { ItemForm, ItemFormProps } from './ItemForm'
import { DbContext } from '../DbWrapper'

export const PersonFormGrpCfg: FormGroupCfg<Person> = {
   name:        { placeholder: 'character name', initFocus: true, required: true },
   player:      { placeholder: 'player name' },
   race:        { span: 4 },
   gender:      { span: 4 },
   age:         { render: p => <NumberInput {...p} />, span: 4 },
   class:       null,
   subclass:    null,
   firstmet:    { label: 'first met', placeholder: 'context of first meeting' },
   birthplace:  { label: 'birth place', placeholder: 'or country of origin' },
   appearance:  { render: p => <Textarea {...p} />, placeholder: 'eyes, skin, hair, tattoos, etc.' },
   background:  { render: p => <Textarea {...p} />, placeholder: 'who they are, in brief' },
   description: {
      render: p => <Textarea {...p} />,
      label: 'description / notes',
      span: 12,
      placeholder: 'additional relevant detail'
   },
}

export const PersonForm: FC<ItemFormProps<Person>> = props => {
    const { peopleCol } = useContext(DbContext)
    return <ItemForm<Person>
        {...props}
        col={peopleCol}
    />
}