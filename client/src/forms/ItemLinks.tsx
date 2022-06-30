import { ActionIcon, InputWrapper, Stack } from '@mantine/core'
import { FC, useContext, useState } from 'react'
import { SquareX } from 'tabler-icons-react'
import { IItem, ILink } from '../db/Faunadb'
import { DbContext } from '../DbWrapper'
import { ItemInput } from './ItemInput'

export const ItemLink: FC<{
    link: ILink,
    onChange?: (v: string) => void
    readOnly: boolean
    deleteLink: (link: ILink) => void
}> = ({ link, onChange, deleteLink, readOnly = false }) => <div style={{ display: 'flex' }}>
        <div style={{ width: '91%' }}>
            <ItemInput
                collection={link.collection}
                value={link.id}
                onChange={onChange}
                readOnly={readOnly}
            />
        </div>
        <div style={{ width: '9%' }}>
            {link.id && <ActionIcon
                    style={{ marginLeft: '5px', borderRight: '0' }}
                    color='red'
                    size={36}
                    onClick={() => deleteLink(link)}
            >
                <SquareX size={36} />
            </ActionIcon>}
        </div>
    </div>

export const ItemLinks: FC<{
    item: IItem,
    updateLinks: (links: ILink[]) => void
}> = ({ item, updateLinks }) => {
    const [ links, setLinks ] = useState(item.links || [])
    const { findItemById } = useContext(DbContext)
    const handleItemChange = (collection: string, idx: number, v: string) => {
        const isNew = idx === (links.length || 0) && !!v
        if (isNew) {
            collection ||= findItemById(v)?.collection || ''
            if (!collection)
                throw new Error('Could not find item in any collection')
            const newLinks = [...links, { collection, id: v, description: 'added' }]
            updateLinks(newLinks)
            setLinks(newLinks)
        }
    }

    const handleItemDelete = (link: ILink) => {
        const newLinks = links.filter(l => l.id !== link.id)
        if (newLinks.length < links.length) {
            updateLinks(newLinks)
            setLinks(newLinks)
        }
    }

    return <InputWrapper label='links'>
        <Stack>{[ ...links, {} as ILink].map((l, idx) =>
            <ItemLink
                key={l.id || idx}
                link={l}
                readOnly={!!l.id} // readonly if this already has a value
                onChange={(v: string) => handleItemChange(l.collection, idx, v)} 
                deleteLink={handleItemDelete}
            />
        )}</Stack>
    </InputWrapper>
}