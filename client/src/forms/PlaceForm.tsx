import { HotkeyItem, useForm, useHotkeys } from '@mantine/hooks'
import { Box, Button, Group, Textarea, SegmentedControl, Center, Grid } from '@mantine/core'

import { KeyboardEvent, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { UseForm } from '@mantine/hooks/lib/use-form/use-form'
import { FldOpts, FormGroupCfg } from './FormGroupCfg'
import { ItemForm } from '../pages/AppPage'
import { Place, PlaceTypeKey, PlaceTypes } from '../entities/Place'

const PlaceFormGrpCfg: FormGroupCfg<Place> = {
   name:        { placeholder: 'character name', initFocus: true },
   appearance:  { render: p => <Textarea {...p} /> },
   description: {
      render: p => <Textarea {...p} />,
      label: 'description / notes',
      span: 12,
      placeholder: 'additional relevant detail'
   },
}

const pfCfg = Object.entries(PlaceFormGrpCfg).map(([prop, cfg]) => {
   let { render, placeholder, label, span } = { ...(new FldOpts), label: prop, ...cfg }

   return (form: UseForm<Place>, ref?: MutableRefObject<any>) => <Grid.Col key={`col_${prop}`} span={span}>
           {render!({
               key: prop,
               label,
               placeholder,
               ...form.getInputProps(prop as keyof Place),
               ref: (cfg?.initFocus ? ref : undefined),
           })}
        </Grid.Col>
})

const inputBreakoutKeyCombo = 'ctrl+alt+'
const toBreakoutHotkey = (key: string) => `${inputBreakoutKeyCombo}${key[0].toLowerCase()}`

export const PlaceForm: ItemForm<Place> = ({ item, saveItem, deleteItem, closeForm }) => {
  const [ saving, setSaving ] = useState(false)
  const [ formType ] = useState<'create' | 'update'>(item?.id ? 'update' : 'create')
  const form = useForm<Place>({
      initialValues: {
        ...new Place(),
        ...item,
    }
  })

  const hks = useMemo(() => [
    ...Object.entries(PlaceTypes).map(([key]) => [
      toBreakoutHotkey(key), () => onTypeChange(key as PlaceTypeKey)
    ]),
    ['Escape', closeForm]
  ] as HotkeyItem[], [])

  useHotkeys(hks)

  const onTypeChange = (v: PlaceTypeKey) => {
    form.setFieldValue('type', v)
    form.getInputProps('type').onChange(v)
  }

  const validateItem = (item: Place) => !!item // TODO: validation

  const onSaveItem = async (item: Place) => {
    if (!validateItem(item))
      return
    setSaving(true)
    const result = await saveItem(item)
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
    <form onKeyDown={handleFormHotkeys} onSubmit={form.onSubmit(onSaveItem)}>
      <Center>
        <SegmentedControl
          size='md'
          data={Object.entries(PlaceTypes).map(([key, pt]) => ({
            value: key,
            label: pt.short
          }))}
          {...form.getInputProps('type')}
          onChange={onTypeChange}
        />
      </Center>
      <Grid>
        {pfCfg.map(f => f(form, initFocusRef))}
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