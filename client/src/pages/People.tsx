import { ActionIcon, Box, Dialog, Group, Loader, SegmentedControl, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Person } from '../entities'
import { PersonForm } from '../forms/PersonForm'
import { PersonTable } from '../forms/PersonTable'
import { useHotkeys } from '@mantine/hooks'
import { usePersonDb } from '../db/Faunadb'
import { SquarePlus } from 'tabler-icons-react'
import { PersonTypeKey, PersonTypes } from '../entities/Person'

export const People = () => {
    const [ showEditDlg, setShowEditDlg ] = useState(false)
    const [ personId, setPersonId ] = useState('')
    const { save, getAll, remove } = usePersonDb()

    const [ personTypeFilter, setPersonTypeFilter ] = useState<PersonTypeKey | ''>('')

    const closeForm = () => setShowEditDlg(false)
    const showForm = () => setShowEditDlg(true)

    const hk = useHotkeys([
        ['c', () => {
            if (showEditDlg) return
            showForm()
            setPersonId('')
        }],
    ])

    const qc = useQueryClient()
    const savePerson = async (person: Person) => {
        try {
            await save(person)
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
                message: `${person.id ? 'Update' : 'Create'} person failed`
            })
        }
    }

    const getPeople = async () => {
        try {
            return await getAll()
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: 'Failed to fetch people'
            })
            return []
        }
    }

    // const getPerson = async (id: string) => {
    //     try {
    //         return await get(id)
    //     } catch (err) {
    //         console.log(err)
    //         showNotification({
    //             title: 'Error',
    //             message: 'Failed to fetch person'
    //         })
    //         throw err
    //     }
    // }

    const deletePerson = async (id: string) => {
        if (!id) return

        try {
            await remove(id)
            qc.invalidateQueries('people')
            setShowEditDlg(false)
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: 'Failed to delete person'
            })
            throw err
        }
    }

    const { data: people, status: peopleStatus } = useQuery('people', getPeople)
    // const { data: person, status: personStatus } = useQuery('person', () => getPerson(personId))

    return <>
        <Title>People</Title>
        {showEditDlg &&
        <Dialog
            opened={showEditDlg}
            withCloseButton
            onClose={() => setShowEditDlg(false)}
            size='xl'
            radius='md'
        >
            <PersonForm
                key={personId}
                savePerson={savePerson}
                person={people?.find(p => p.id === personId)}
                deletePerson={deletePerson}
                closeForm={closeForm}
            />
        </Dialog>}
        {peopleStatus == 'success'
            ? <Box sx={{ maxWidth: 600 }}>
                <Group position='right'>
                <SegmentedControl
                    size='md'
                    data={[
                        { value: '', label: 'All' },
                        ...Object.entries(PersonTypes).map(([key, pt]) => ({
                            value: key,
                            label: pt.short
                        }))
                    ]}
                    onChange={(v: PersonTypeKey | '') => setPersonTypeFilter(v)}
                />
                    <ActionIcon size='lg' disabled={peopleStatus != 'success'} onClick={() => {
                        setPersonId('')
                        setShowEditDlg(true)
                    }}>
                        <SquarePlus width={32} height={32} color='green' />
                    </ActionIcon>
                </Group>
                <PersonTable
                    people={people?.filter(p => !personTypeFilter || p.type === personTypeFilter) || []}
                    deletePerson={deletePerson}
                    onPersonClick={id => {
                        setPersonId(id)
                        setShowEditDlg(true)
                    }}
                />
              </Box>
            : <Loader />}
    </>
}