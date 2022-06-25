import { HotkeyItem, useForm, useHotkeys } from '@mantine/hooks'
import { Box, NumberInput, Button, Group, Textarea, SegmentedControl, Center, Grid } from '@mantine/core'

import { Person } from '../entities'
import { PersonTypeKey, PersonTypes } from '../entities/Person'
import { FC, KeyboardEvent, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { isPropCombatant } from '../meta/Combatant'
import { UseForm } from '@mantine/hooks/lib/use-form/use-form'
import { FldOpts, FormGroupCfg } from './FormGroupCfg'

const PersonFormGrpCfg: FormGroupCfg<Person> = {
   name:        { placeholder: 'character name', initFocus: true },
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

const pfCfg = Object.entries(PersonFormGrpCfg).map(([prop, cfg]) => {
   let { render, placeholder, label, span } = { ...(new FldOpts), label: prop, ...cfg }
   const cmbProp = isPropCombatant(prop)

   return (form: UseForm<Person>, combatant: boolean, ref?: MutableRefObject<any>) => (!cmbProp || combatant)
      ? <Grid.Col key={`col_${prop}`} span={span}>
           {render!({
               key: prop,
               label,
               placeholder,
               ...form.getInputProps(prop as keyof Person),
               ref: (cfg?.initFocus ? ref : undefined),
           })}
        </Grid.Col>
      : undefined
})

const inputBreakoutKeyCombo = 'ctrl+alt+'
const toBreakoutHotkey = (key: string) => `${inputBreakoutKeyCombo}${key[0].toLowerCase()}`

export const PersonForm: FC<{
   person?: Person,
   savePerson: ((p: Person) => Promise<void>)
   deletePerson?: ((id: string) => Promise<void>)
}> = ({ person, savePerson, deletePerson }) => {
  const [ isCombatant, setIsCombatant ] = useState(true)
  const [ saving, setSaving ] = useState(false)
  const [ formType ] = useState<'create' | 'update'>(person?.id ? 'update' : 'create')
  const form = useForm<Person>({
      initialValues: {
        ...new Person('pc'),
        ...person,
    }
  })

  const hks = useMemo(() => Object.entries(PersonTypes).map(([key]) => [
    toBreakoutHotkey(key), () => onPersonTypeChange(key as PersonTypeKey)
  ] as HotkeyItem), [])

  useHotkeys(hks)

  const onPersonTypeChange = (v: PersonTypeKey) => {
    setIsCombatant(PersonTypes[v].combatant)
    form.setFieldValue('type', v)
    form.getInputProps('type').onChange(v)
  }

  const validatePerson = (person: Person) => !!person // TODO: validation

  const onSavePerson = async (person: Person) => {
    if (!validatePerson(person))
      return
    setSaving(true)
    const result = await savePerson(person)
  }

  const initFocusRef = useRef<any>()

  useEffect(() => {
    if (initFocusRef.current)
      initFocusRef.current.focus()
  }, [])

  const handleFormHotkeys = useMemo(() => (e: KeyboardEvent<HTMLFormElement>) => {
    const tgt = e.target as any
    // do we not need to override in this case?
    if (tgt.nodeName !== 'INPUT' ||
        !e.ctrlKey || !e.altKey || e.key.length !== 1)
        return
    
    // does this match a current hotkey?
    const bohk = toBreakoutHotkey(e.key)
    const hk = hks.find(hk => hk[0] === bohk)
    if (!hk) return

    // run the event
    hk[1](e as any)
  }, [])

  return <Box sx={{ maxWidth: 400 }}>
    <form onKeyDown={handleFormHotkeys} onSubmit={form.onSubmit(onSavePerson)}>
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
        {pfCfg.map(f => f(form, isCombatant, initFocusRef))}
      </Grid>
      <Group position="apart" mt="md">
        <Button
          disabled={formType === 'create'}
          color='red'
          loading={saving}
          type="submit"
          onClick={(e: any) => {
            e.preventDefault()
            deletePerson?.(person?.id!)
          }}
        >
          Delete
        </Button>
        <Button loading={saving} type="submit">Submit</Button>
      </Group>
    </form>
  </Box>
}