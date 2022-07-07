import { FC, useContext } from 'react'

import { FormGroupCfg } from './FormGroupCfg'
import { Session } from '../entities'
import { ItemForm, ItemFormProps } from './ItemForm'
import { DbContext } from '../DbWrapper'
import { ItemInput } from './ItemInput'
import { DatePicker } from '@mantine/dates'
import { MentionInput } from './MentionInput'

export const SessionFormGrpCfg: FormGroupCfg<Session> = {
   name:        { placeholder: 'location name', initFocus: true, required: true },
   date:        {
      placeholder: 'session date',
      required: true,
      render: p => <DatePicker allowFreeInput={true} {...p} />,
   },
   startLocation:    {
      label: 'start location',
      placeholder: 'location at start of session',
      span: 8,
      required: true,
      render: p => <ItemInput collection='places' {...p} />
    },
   summary: {
      render: p => <MentionInput {...p} />,
      label: 'summary',
      span: 12,
      placeholder: 'session summary'
   },
}

export const SessionForm: FC<ItemFormProps<Session>> = props => {
  const { sessionsCol } = useContext(DbContext)
  return <ItemForm<Session>
      {...props}
      col={sessionsCol}
  />
}