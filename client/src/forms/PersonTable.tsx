import { Table } from '@mantine/core';
import { FC } from 'react'
import { Person } from '../entities';

export const PersonTable: FC<{ people: Person[] }> = ({ people }) => {
    const ths = <tr>
          <th>Id</th>
          <th>Type</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Race</th>
        </tr>

    const trs = people.map(person => (
        <tr key={person.id}>
        <td>{person.id}</td>
        <td>{person.type}</td>
        <td>{person.name}</td>
        <td>{person.gender}</td>
        <td>{person.race}</td>
        </tr>
    ))

    return <Table>
        <thead>{ths}</thead>
        <tbody>{trs}</tbody>
    </Table>
}