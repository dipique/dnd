import { useForm } from '@mantine/hooks'
import { Box, TextInput, NumberInput, Button, Group, Textarea, SegmentedControl, Center, Grid } from '@mantine/core';

import { Person } from '../entities'
import { PersonTypeKey, PersonTypes } from '../entities/Person';
import { useState } from 'react';
import { isPropCombatant } from '../meta/Combatant';
import { UseForm } from '@mantine/hooks/lib/use-form/use-form';

class FldOpts {
  render?: (props: any) => JSX.Element = props => <TextInput {...props} />
  placeholder?: string
  label?: string
  span?: number = 6 // out of 12
}
const PersonFormGrpCfg: { [Key in keyof Person]?: FldOpts | null } = {
  name:        { placeholder: 'character name' },
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
  description: { render: p => <Textarea {...p} />, label: 'description / notes', span: 12, placeholder: 'additional relevant detail' },
}

const pfCfg = Object.entries(PersonFormGrpCfg).map(([prop, cfg]) => {
  let { render, placeholder, label, span } = { ...(new FldOpts), label: prop, ...cfg }
  const cmbProp = isPropCombatant(prop)

  return (form: UseForm<Person>, combatant: boolean) => (!cmbProp || combatant)
    ? <Grid.Col key={`col_${prop}`} span={span}>
        {render!({ key: prop, label, placeholder, ...form.getInputProps(prop as keyof Person) })}
      </Grid.Col>
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
      <Grid>
        {pfCfg.map(f => f(form, isCombatant))}
      </Grid>  
      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  </Box>
}