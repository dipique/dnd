import { ActionIcon, Anchor, Table } from '@mantine/core'
import { SquareX } from 'tabler-icons-react'
import { Place, PlaceTypes } from '../entities/Place'
import { ItemTable } from '../pages/AppPage'

export const PlaceTable: ItemTable<Place> = ({
    items: places,
    onItemClick,
    deleteItem
}) => {
    const ths = <tr>
          <th>Type</th>
          <th>Name</th>
          <th></th>
        </tr>

    const trs = places.map(item => (
        <tr key={item.id}>
            <td>{PlaceTypes[item.type].short}</td>
            <td><Anchor onClick={() => onItemClick?.(item.id)}>{item.name}</Anchor></td>
            <td width={32}>
                <ActionIcon onClick={() => deleteItem?.(item.id)} color='red'>
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