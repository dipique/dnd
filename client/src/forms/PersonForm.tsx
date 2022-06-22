import { useForm } from '@mantine/hooks'
import { Box, TextInput, NumberInput, Button, Group, SimpleGrid, Textarea, SegmentedControl, Center } from '@mantine/core';

import { Person } from '../entities'
import { PersonTypeKey, PersonTypes } from '../entities/Person';
import { useState } from 'react';
import { isPropCombatant } from '../meta/Combatant';
import { UseForm } from '@mantine/hooks/lib/use-form/use-form';

class FldOpts {
  render?: (props: any) => JSX.Element = props => <TextInput {...props} />
  placeholder?: string
  label?: string
}
const PersonFormGrpCfg: { [Key in keyof Person]?: FldOpts | null } = {
  name:       { placeholder: 'character Name' },
  player:     { placeholder: 'player Name' },
  birthplace: null,
  firstmet:   { label: 'first met', placeholder: 'context of first meeting' },
  age:        { render: props => <NumberInput {...props} /> },
  gender:     null,
  race:       null,
  subrace:    null,
  class:      null,
  subclass:   null,
  height:     null,
  weight:     null,
  hair:       null,
  eyes:       null,
  description: { render: props => <Textarea {...props} />},
  background: { render: props => <Textarea {...props} />},
}

const pfCfg = Object.entries(PersonFormGrpCfg).map(([prop, cfg]) => {
  let { render, placeholder, label } = { ...(new FldOpts), label: prop, ...cfg }
  const cmbProp = isPropCombatant(prop)

  return (form: UseForm<Person>, combatant: boolean) => (!cmbProp || !combatant)
    ? render!({ key: prop, label, placeholder, ...form.getInputProps(prop as keyof Person) })
    : undefined
})

export const PersonForm = () => {
  const [ isCombatant, setIsCombatant ] = useState(true)
  const form = useForm<Person>({
      initialValues: {
        ...new Person(),
        name: 'Uszu',
        type: 'pc'
    }
  })

  const onPersonTypeChange = (v: PersonTypeKey) => {
    setIsCombatant(PersonTypes[v].combatant)
    form.getInputProps('type').onChange(v)
  }

  return <Box sx={{ maxWidth: 400 }}>
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Center>
        <SegmentedControl
          size='md'
          data={Object.entries(PersonTypes).map(([key, pt]) => ({
            value: key,
            label: pt.short
          }))}
          {...form.getInputProps('type')}
          onChange={onPersonTypeChange}
        />
      </Center>
      <SimpleGrid cols={2} spacing='sm'>
        {pfCfg.map(f => f(form, isCombatant))}
      </SimpleGrid>
      <Textarea   label="notes"       {...form.getInputProps('notes')} />
        
      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  </Box>
}