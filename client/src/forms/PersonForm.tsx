import { HotkeyItem, useForm, useHotkeys } from '@mantine/hooks'
import { Box, NumberInput, Button, Group, Textarea, SegmentedControl, Center, Grid } from '@mantine/core'

import { Person } from '../entities'
import { DefaultPersonType, PersonTypeKey, PersonTypes } from '../entities/Person'
import { KeyboardEvent, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { getPropAssociations } from '../meta/TypeAssociation'
import { UseForm } from '@mantine/hooks/lib/use-form/use-form'
import { FldOpts, FormGroupCfg } from './FormGroupCfg'
import { ItemForm } from '../pages/AppPage'

const PersonFormGrpCfg: FormGroupCfg<Person> = {
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

const pfCfg = Object.entries(PersonFormGrpCfg).map(([key, cfg]) => {
   const prop = key as keyof Person
   let { render, span, label, placeholder, required } = { ...(new FldOpts), label: prop, ...cfg }
   const blank = new Person()
   const typeAss = getPropAssociations(prop, blank)

   return (form: UseForm<Person>, type: PersonTypeKey, ref?: MutableRefObject<any>) => {
      const shown = !typeAss.length || typeAss.includes(type)
      if (!shown) {
        // reset hidden fields
        if (form.values[prop] !== blank[prop])
          form.setFieldValue(prop, blank[prop])
        return undefined
      }
      return <Grid.Col key={`col_${prop}`} span={span}>
        {render!({
            key: prop,
            ...form.getInputProps(prop),
            label, placeholder, required,
            ref: (cfg?.initFocus ? ref : undefined),
        })}
      </Grid.Col>
   }
})

const inputBreakoutKeyCombo = 'ctrl+alt+'
const toBreakoutHotkey = (key: string) => `${inputBreakoutKeyCombo}${key[0].toLowerCase()}`

export const PersonForm: ItemForm<Person> = ({ item, saveItem, deleteItem, closeForm }) => {
  const [ itemType, setItemType ] = useState(DefaultPersonType)
  const [ saving, setSaving ] = useState(false)
  const [ formType ] = useState<'create' | 'update'>(item?.id ? 'update' : 'create')
  const form = useForm<Person>({
      initialValues: {
        ...new Person('pc'),
        ...item,
    }
  })

  const hks = useMemo(() => [
    ...Object.entries(PersonTypes).map(([key]) => [
      toBreakoutHotkey(key), () => onPersonTypeChange(key as PersonTypeKey)
    ]),
    ['Escape', closeForm]
  ] as HotkeyItem[], [])

  useHotkeys(hks)

  const onPersonTypeChange = (v: PersonTypeKey) => {
    setItemType(v)
    form.setFieldValue('type', v)
    form.getInputProps('type').onChange(v)
  }

  const validatePerson = (person: Person) => !!person // TODO: validation

  const onSavePerson = async (person: Person) => {
    if (!validatePerson(person))
      return
    setSaving(true)
    const result = await saveItem(person)
  }

  const initFocusRef = useRef<any>()

  useEffect(() => {
    if (initFocusRef.current)
      initFocusRef.current.focus()
  }, [])

  const handleFormHotkeys = useMemo(() => (e: KeyboardEvent<HTMLFormElement>) => {
    const tgt = e.target as any
    // do we not need to override in this case?
    if (tgt.nodeName === 'INPUT') {
      if (e.key === 'Escape') {
        closeForm()
        return
      } else if (!(e.ctrlKey && e.altKey && e.key.length === 1))
        return
    }
    
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
            label: pt.short.toLowerCase()
          }))}
          {...form.getInputProps('type')}
          onChange={onPersonTypeChange}
        />
      </Center>
      <Grid>
        {pfCfg.map(f => f(form, itemType, initFocusRef))}
      </Grid>
      <Group position="apart" mt="md">
        <Button
          disabled={formType === 'create'}
          color='red'
          loading={saving}
          type="button"
          onClick={(e: any) => {
            e.preventDefault()
            deleteItem?.(item?.id!)
          }}
        >
          Delete
        </Button>
        <Button loading={saving} type="submit">Submit</Button>
      </Group>
    </form>
  </Box>
}