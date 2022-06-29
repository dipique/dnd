import { ActionIcon, Anchor, Table } from '@mantine/core'
import { useContext } from 'react'
import { SquareX } from 'tabler-icons-react'
import { DbContext } from '../DbWrapper'
import { Place, PlaceTypes } from '../entities/Place'
import { ItemTable } from '../pages/AppPage'

export const PlaceTable: ItemTable<Place> = ({
    items: places,
    onItemClick,
    deleteItem
}) => {
    const { placesCol: { items, getTitle, getNew } } = useContext(DbContext)
    const ths = <tr>
          <th>type</th>
          <th>name</th>
          <th>location</th>
          <th></th>
        </tr>

    const trs = places.map(item => (
        <tr key={item.id}>
            <td>{PlaceTypes[item.type].short}</td>
            <td><Anchor onClick={() => onItemClick?.(item.id)}>{item.name}</Anchor></td>
            <td>{item.location ? getTitle(items.find(i => i.id === item.location)!) : ''}</td>
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