import { useForm } from '@mantine/hooks'
import { Box, TextInput, NumberInput, Button, Group, SimpleGrid, Textarea, SegmentedControl } from '@mantine/core';

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
  name:       { placeholder: 'Character Name' },
  player:     { placeholder: 'Player Name' },
  birthplace: null,
  firstmet:   { label: 'First Met' },
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
      <SegmentedControl
        data={Object.entries(PersonTypes).map(([key, pt]) => ({
          value: key,
          label: pt.short
        }))}
        {...form.getInputProps('type')}
        onChange={onPersonTypeChange}
      />
      <SimpleGrid cols={2} spacing='sm'>
        {pfCfg.map(f => f(form, isCombatant))}
        {/* <TextInput   label="Name"        {...form.getInputProps('name')} placeholder='Name' />
        <TextInput   label="Player"      {...form.getInputProps('player')} placeholder='Player name' />
        <TextInput   label="Birthplace"  {...form.getInputProps('birthplace')} />
        <TextInput   label="First Met"   {...form.getInputProps('firstmet')} />
        <NumberInput label="Age"         {...form.getInputProps('age')} />
        <TextInput   label="Gender"      {...form.getInputProps('gender')} />
        <TextInput   label="Race"        {...form.getInputProps('race')} />
        <TextInput   label="Subrace"     {...form.getInputProps('subrace')} />
        <TextInput   label="Class"       {...form.getInputProps('class')} />
        <TextInput   label="Subclass"    {...form.getInputProps('subclass')} />
        <TextInput   label="Height"      {...form.getInputProps('height')} />
        <TextInput   label="Weight"      {...form.getInputProps('weight')} />
        <TextInput   label="Hair"        {...form.getInputProps('hair')} />
        <TextInput   label="Eyes"        {...form.getInputProps('eyes')} /> */}
      </SimpleGrid>
      <Textarea   label="Background"  {...form.getInputProps('background')} />
      <Textarea   label="Description" {...form.getInputProps('description')} />
      <Textarea   label="Notes"       {...form.getInputProps('notes')} />
        
      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  </Box>
}