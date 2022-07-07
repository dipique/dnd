import { InputWrapper, Stack } from '@mantine/core'
import { FC, useState } from 'react'
import { DbItem } from '../db/Faunadb'

export interface ItemListProps<TEntity extends DbItem, TListItem> {
    entity: TEntity,
    updateList: (items: TListItem[]) => void,
    itemsMatch: (item1: TListItem, item2: TListItem) => boolean,
    getInitial?: (entity: TEntity) => TListItem[],
    label: string,
    [k: string]: any,
    renderItem: FC<ItemListItemProps<TListItem>>,
}

export interface ItemListItemProps<TListItem> {
    key: string,
    listItem: TListItem,
    onItemChange: (item: TListItem) => void,
    onItemDelete: (item: TListItem) => void,
}

export const ItemList = <TEntity extends DbItem, TListItem>({ entity, updateList, itemsMatch, getInitial, label, renderItem, ...rest }: ItemListProps<TEntity, TListItem>) => {
    const [ items, setItems ] = useState(getInitial?.(entity) || [])
    const onItemChange = (item: TListItem) => {
        const matchIdx = items.findIndex(i => itemsMatch(i, item))
        const isNew = matchIdx < 0
        let newItems: TListItem[] = []
        if (isNew) {
            newItems = [...items, item]
        } else {
            newItems = [...items]
            newItems[matchIdx] = { ...item }
        }

        updateList(newItems)
        setItems(newItems)
    }

    const onItemDelete = (item: TListItem) => {
        const newItems = items.filter(i => !itemsMatch(i, item))
        if (newItems.length < items.length) {
            updateList(newItems)
            setItems(newItems)
        }
    }

    return <InputWrapper label={label} {...rest}>
        <Stack>{[ ...items, {} as TListItem].map((listItem, idx) => renderItem({
            key: idx.toString(),
            listItem,
            onItemChange,
            onItemDelete,
        }))}</Stack>
    </InputWrapper>
}