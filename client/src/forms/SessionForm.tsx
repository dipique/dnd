import { FC, useContext } from 'react'
import { Textarea } from '@mantine/core'

import { FormGroupCfg } from './FormGroupCfg'
import { Session } from '../entities'
import { ItemForm, ItemFormProps } from './ItemForm'
import { DbContext } from '../DbWrapper'
import { ItemInput } from './ItemInput'
import { DatePicker } from '@mantine/dates'

export const SessionFormGrpCfg: FormGroupCfg<Session> = {
   name:        { placeholder: 'location name', initFocus: true, required: true },
   date:        {
      placeholder: 'sessiondate',
      required: true,
      render: p => <DatePicker allowFreeInput={true} {...p} />,
   },
   startLocation:    {
      placeholder: 'location of start of session',
      span: 8,
      required: true,
      render: p => <ItemInput collection='places' {...p} />
    },
   summary: {
      render: p => <Textarea {...p} />,
      label: 'description / notes',
      span: 12,
      placeholder: 'additional relevant detail'
   },
}

export const SessionForm: FC<ItemFormProps<Session>> = props => {
  const { sessionsCol } = useContext(DbContext)
  return <ItemForm<Session>
      {...props}
      col={sessionsCol}
  />
}