import { ActionIcon, Anchor, Button, Table } from '@mantine/core'
import { FC } from 'react'
import { SquareX } from 'tabler-icons-react'
import { Person } from '../entities'
import { PersonTypes } from '../entities/Person'

export const PersonTable: FC<{
    people: Person[],
    onPersonClick?: (id: string) => void,
    deletePerson?: ((id: string) => Promise<void>),
}> = ({ people, onPersonClick, deletePerson }) => {
    const ths = <tr>
          <th>Type</th>
          <th>Name</th>
          <th>Race</th>
          <th></th>
        </tr>

    const trs = people.map(person => (
        <tr key={person.id}>
            <td>{PersonTypes[person.type].short}</td>
            <td><Anchor onClick={() => onPersonClick?.(person.id)}>{person.name}</Anchor></td>
            <td>{person.race}</td>
            <td width={32}>
                <ActionIcon onClick={() => deletePerson?.(person.id)} color='red'>
                    <SquareX />
                </ActionIcon>
            </td>
        </tr>
    ))

    return <Table>
        <thead>{ths}</thead>
        <tbody>{trs}</tbody>
    </Table>
}