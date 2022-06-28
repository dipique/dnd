import { ActionIcon, Anchor, Table } from '@mantine/core'
import { SquareX } from 'tabler-icons-react'
import { Person } from '../entities'
import { PersonTypes } from '../entities/Person'
import { ItemTable } from '../pages/AppPage'

export const PersonTable: ItemTable<Person> = ({
    items: people,
    onItemClick:
    onPersonClick,
    deleteItem: deletePerson
}) => {
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