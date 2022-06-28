import { ActionIcon, Box, Dialog, Group, Loader, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { FC, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useHotkeys } from '@mantine/hooks'
import { IDbActions, IItem } from '../db/Faunadb'
import { SquarePlus } from 'tabler-icons-react'
import { useSpotlight } from '@mantine/spotlight'

export type ItemFormProps<T extends IItem> = {
    item: T | undefined
    saveItem: (item: T) => Promise<void>,
    deleteItem: (id: string) => Promise<void>,
    closeForm: () => void,
}

export type ItemForm<T extends IItem> = FC<ItemFormProps<T>>

export type ItemTableProps<T extends IItem> = {
    items: T[],
    deleteItem: (id: string) => Promise<void>,
    onItemClick: (id: string) => void,
}

export type ItemTable<T extends IItem> = FC<ItemTableProps<T>>

export type ItemFiltersProps<T extends IItem> = {
    filters: any,
    setFilters: (filters: any) => void,
}

export type ItemFilters<T extends IItem> = FC<ItemFiltersProps<T>>

interface ItemPageProps<T extends IItem> {
    useDbHook: () => IDbActions<T>
    renderFilters?: ItemFilters<T>
    renderTable: ItemTable<T>
    renderForm: ItemForm<T>
    strings: { pageTitle: string, itemSingular: string, itemPlural: string, collectionName: string }
    spotlightFns: { getId: (item: T) => string, getTitle: (item: T) => string, icon: JSX.Element }
    applyFilter: (item: T, filter: any) => boolean
}

export const AppPage = <T extends IItem>({
    useDbHook, strings,
    renderFilters, renderForm, renderTable,
    spotlightFns, applyFilter
} : ItemPageProps<T>) => {
    const [ showDialog, setShowDialog ] = useState(false)
    const [ itemId, setItemId ] = useState('')
    const { save, getAll, remove } = useDbHook()
    const [ filters, setFilters ] = useState<any>({})

    const closeForm = () => setShowDialog(false)
    const showForm = () => setShowDialog(true)

    const hk = useHotkeys([
        ['c', () => {
            if (showDialog) return
            showForm()
            setItemId('')
        }],
    ])

    const qc = useQueryClient()
    const saveItem = async (item: T) => {
        try {
            await save(item)
            setShowDialog(false)
            showNotification({
                title: 'Success!',
                message: `${item.id ? 'Update' : 'Create'} ${strings.itemSingular} succeeded`
            })
            qc.invalidateQueries(strings.collectionName)
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: `${item.id ? 'Update' : 'Create'} ${strings.itemSingular} failed`
            })
        }
    }

    const getItems = async () => {
        try {
            return await getAll()
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: `Failed to fetch ${strings.itemSingular}`
            })
            return []
        }
    }

    const deleteItem = async (id: string) => {
        if (!id) return

        try {
            await remove(id)
            qc.invalidateQueries(strings.collectionName)
            setShowDialog(false)
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: `Failed to delete ${strings.itemSingular}`
            })
            throw err
        }
    }

    const { data: items, status: itemsStatus, isFetching } = useQuery(strings.collectionName, getItems)

    const { registerActions, removeActions } = useSpotlight()
    useEffect(() => {
        if (!items?.length) return

        const actions = items.map(p => ({
            id: spotlightFns.getId(p),
            title: spotlightFns.getTitle(p),
            description: `View details for this ${strings.itemSingular}`,
            onTrigger: () => {
                setItemId(p.id)
                showForm()
            },
            icon: spotlightFns.icon,
        }))
        registerActions(actions)
        return () => removeActions(actions.map(p => p.id))
    }, [ items ])

    return <>
        <Title>{strings.pageTitle}</Title>
        {showDialog &&
        <Dialog
            opened={showDialog}
            withCloseButton
            onClose={() => setShowDialog(false)}
            size='xl'
            radius='md'
        >
            {renderForm({ saveItem, deleteItem, closeForm, item: items?.find(p => p.id === itemId)})}
        </Dialog>}
        {itemsStatus == 'success' && renderFilters
            ? <Box sx={{ maxWidth: 600 }}>
                <Group position='right'>
                    {renderFilters({ filters, setFilters })}
                    <ActionIcon size='lg' disabled={itemsStatus != 'success' || isFetching} onClick={() => {
                        setItemId('')
                        setShowDialog(true)
                    }}>
                        <SquarePlus width={32} height={32} color='green' />
                    </ActionIcon>
                </Group>
                {renderTable({
                    items: (filters ? items?.filter(i => applyFilter(i, filters)) : items) || [],
                    deleteItem,
                    onItemClick: (id: string) => {
                        setItemId(id)
                        setShowDialog(true)
                    }
                })}
              </Box>
            : <Loader />}
    </>
}