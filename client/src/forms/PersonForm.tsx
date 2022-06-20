import { useForm } from '@mantine/hooks'
import { Box, TextInput, NumberInput, Button, Group } from '@mantine/core';

import { Person } from '../entities'

export const PersonForm = () => {
    const form = useForm<Person>({
        initialValues: {
          name: 'Uszu',
          type: 'pc'
      }
    })

    return <Box sx={{ maxWidth: 340 }} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} />
        <NumberInput mt="sm" label="Age" placeholder="Your age" {...form.getInputProps('age')} />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
}