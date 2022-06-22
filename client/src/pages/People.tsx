import { Dialog, Title } from '@mantine/core'
import { useState } from 'react'
import { PersonForm } from '../forms/PersonForm'

export const People = () => {
    const [ showAddPerson, setShowAddPerson ] = useState(false)
    return <>
        <Title>People</Title>
        <button onClick={() => setShowAddPerson(true)}>Add person</button>
        <PersonForm />
        <Dialog
            opened={showAddPerson}
            withCloseButton
            onClose={() => setShowAddPerson(false)}
            size='xl'
            radius='md'
        >
            <PersonForm />
        </Dialog>
    </>
}