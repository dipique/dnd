import { InputWrapper, Stack } from '@mantine/core'
import { FC, useState } from 'react'
import { IItem, ILink } from '../db/Faunadb'
import { ItemInput } from './ItemInput'

export const ItemLink: FC<{
    link: ILink,
    onChange?: (v: string) => void
    readOnly: boolean
}> = ({ link, onChange, readOnly = false }) => {
    return <ItemInput collection={link.collection} value={link.id} onChange={onChange} readOnly={readOnly} />
}

export const ItemLinks: FC<{ item: IItem, updateLinks: (links: ILink[]) => void }> = ({ item, updateLinks }) => {
    const [ links, setLinks ] = useState(item.links || [])
    const handleItemChange = (collection: string, idx: number, v: string) => {
        const isNew = idx === (links.length || 0) && !!v
        if (isNew) {
            const newLinks = [...links, { collection, id: v, description: 'added' }]
            updateLinks(newLinks)
            setLinks(newLinks)
        }

        // todo: deleted, modified
    }

    return <InputWrapper label='links'>
        <Stack>{[ ...links, {} as ILink].map((l, idx) =>
            <ItemLink
                key={l.id || idx}
                link={l}
                readOnly={!!l.id} // readonly if this already has a value
                onChange={(v: string) => handleItemChange(l.collection, idx, v)} 
            />
        )}</Stack>
    </InputWrapper>
}