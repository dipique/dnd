import { Anchor, Table } from '@mantine/core';
import { FC } from 'react'
import { Person } from '../entities';
import { PersonTypes } from '../entities/Person';

export const PersonTable: FC<{
    people: Person[],
    onPersonClick?: (id: string) => void
}> = ({ people, onPersonClick }) => {
    const ths = <tr>
          <th>Type</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Race</th>
        </tr>

    const trs = people.map(person => (
        <tr key={person.id}>
            <td>{PersonTypes[person.type].short}</td>
            <td><Anchor onClick={(() => onPersonClick?.(person.id || ''))}>{person.name}</Anchor></td>
            <td>{person.gender}</td>
            <td>{person.race}</td>
        </tr>
    ))

    return <Table>
        <thead>{ths}</thead>
        <tbody>{trs}</tbody>
    </Table>
}