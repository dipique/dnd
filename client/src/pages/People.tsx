import { useAuth0 } from '@auth0/auth0-react'
import { Dialog, Loader, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useContext, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { AppContext } from '../app'
import { Person } from '../entities'
import { FaunaCollection, FaunaItem } from '../db/Faunadb'
import { PersonForm } from '../forms/PersonForm'
import { PersonTable } from '../forms/PersonTable'

export const People = () => {
    const [ showEditDlg, setShowEditDlg ] = useState(false)
    const { getAccessTokenSilently } = useAuth0()
    const ctx = useContext(AppContext)
    const [ personId, setPersonId ] = useState('')

    const qc = useQueryClient()
    const savePerson = async (person: Person) => {
        try {
            const accessToken = await getAccessTokenSilently({
                audience: 'dnd-api',
                scope: 'do:all'
            })
            const response = await fetch(`${ctx.apiUri}/people`, {
                method: person.id ? 'PATCH' : 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(person)
            })
            const result = await response.json() as FaunaItem<Person>
            setShowEditDlg(false)
            showNotification({
                title: 'Success!',
                message: `${person.id ? 'Update' : 'Create'} person succeeded`
            })
            qc.invalidateQueries('people')
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: 'Create person failed'
            })
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
            return []
        }
    }

    const getPerson = async (id: string) => {
        if (!id)
            return new Person()

        try {
            const accessToken = await getAccessTokenSilently({
                audience: 'dnd-api',
                scope: 'do:all'
            })
            const response = await fetch(`${ctx.apiUri}/people?id=${id}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const result = await response.json() as FaunaItem<Person>
            return FaunaItem.withId(result)
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: 'Failed to fetch person'
            })
            throw err
        }
    }

    const { data: people, status: peopleStatus } = useQuery('people', getPeople)
    // const { data: person, status: personStatus } = useQuery('person', () => getPerson(personId))

    return <>
        <Title>People</Title>
        <button onClick={() => setShowEditDlg(true)}>Add person</button>
        {showEditDlg &&
        <Dialog
            opened={showEditDlg}
            withCloseButton
            onClose={() => setShowEditDlg(false)}
            size='xl'
            radius='md'
        >
            <PersonForm key={personId} savePerson={savePerson} person={people?.find(p => p.id === personId)} />
        </Dialog>}
        {peopleStatus == 'success'
            ? <PersonTable people={people || []} onPersonClick={id => {
                setPersonId(id)
                setShowEditDlg(true)
              }} />
            : <Loader />}
    </>
}