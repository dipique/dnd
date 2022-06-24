import { useAuth0 } from '@auth0/auth0-react'
import { Dialog, Loader, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useContext, useState } from 'react'
import { useQuery } from 'react-query'
import { AppContext } from '../app'
import { Person } from '../entities'
import { FaunaCollection } from '../entities/Person'
import { PersonForm } from '../forms/PersonForm'
import { PersonTable } from '../forms/PersonTable'

export const People = () => {
    const [ showAddPerson, setShowAddPerson ] = useState(false)
    const { getAccessTokenSilently } = useAuth0()
    const ctx = useContext(AppContext)

    const savePerson = async (person: Person) => {
        try {
            const accessToken = await getAccessTokenSilently({
                audience: 'dnd-api',
                scope: 'do:all'
            })
            const response = await fetch(`${ctx.apiUri}/people`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(person)
            })
            console.log(response.body)
            setShowAddPerson(false)
            showNotification({
                title: 'Success!',
                message: 'Create person succeeded'
            })
            return 'success'
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: 'Create person failed'
            })
            return 'error'
        } finally {
            return 'done'
        }
    }

    const getPeople = async () => {
        try {
            const accessToken = await getAccessTokenSilently({
                audience: 'dnd-api',
                scope: 'do:all'
            })
            const response = await fetch(`${ctx.apiUri}/people`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const result = await response.json() as FaunaCollection<Person>
            return FaunaCollection.getItems(result)
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: 'Failed to fetch people'
            })
        }
    }

    const { data: people, status } = useQuery("people", getPeople)

    return <>
        <Title>People</Title>
        <button onClick={() => setShowAddPerson(true)}>Add person</button>
        <Dialog
            opened={showAddPerson}
            withCloseButton
            onClose={() => setShowAddPerson(false)}
            size='xl'
            radius='md'
        >
            <PersonForm savePerson={savePerson} />
        </Dialog>
        {status == 'success'
            ? <PersonTable people={people || []} />
            : <Loader />}
    </>
}