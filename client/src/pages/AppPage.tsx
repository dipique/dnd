import { ActionIcon, Box, Dialog, Group, Loader, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { FC, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useHotkeys } from '@mantine/hooks'
import { IItem } from '../db/Faunadb'
import { SquarePlus } from 'tabler-icons-react'
import { useSpotlight } from '@mantine/spotlight'
import { IItemCollection } from '../DbWrapper'
import { ItemFormProps } from '../forms/ItemForm'

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
    collection: IItemCollection<T>
    renderFilters?: ItemFilters<T>
    renderTable: ItemTable<T>
    renderForm: FC<ItemFormProps<T>>
    applyFilter: (item: T, filter: any) => boolean
}

export const AppPage = <T extends IItem>({
    collection,
    renderFilters, applyFilter, renderForm, renderTable
} : ItemPageProps<T>) => {
    const { name, singular, useDbHook, getTitle, getId, icon, items, updateCache } = collection
    const [ showDialog, setShowDialog ] = useState(false)
    const [ itemId, setItemId ] = useState('')
    const { save, getAll, remove } = useDbHook()
    const [ filters, setFilters ] = useState<any>({ type: '' })

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
                message: `${item.id ? 'Update' : 'Create'} ${singular} succeeded`
            })
            qc.invalidateQueries(name)
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: `${item.id ? 'Update' : 'Create'} ${singular} failed`
            })
        }
    }

    const getItems = async () => {
        try {
            const items = await getAll()
            updateCache(items)
            return items
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: `Failed to fetch ${singular}`
            })
            return []
        }
    }

    const deleteItem = async (id: string) => {
        if (!id) return

        try {
            await remove(id)
            qc.invalidateQueries(name)
            setShowDialog(false)
        } catch (err) {
            console.log(err)
            showNotification({
                title: 'Error',
                message: `Failed to delete ${singular}`
            })
            throw err
        }
    }

    const { data, status, isFetching } = useQuery(name, getItems)

    const { registerActions, removeActions } = useSpotlight()
    useEffect(() => {
        if (!items?.length) return

        const actions = items.map(p => ({
            id: getId(p),
            title: getTitle(p),
            description: `View details for this ${singular}`,
            onTrigger: () => {
                setItemId(p.id)
                showForm()
            },
            icon: icon,
        }))
        registerActions(actions)
        return () => removeActions(actions.map(p => p.id))
    }, [ items ])

    return <>
        <Title>{name}</Title>
        {showDialog &&
        <Dialog
            opened={showDialog}
            withCloseButton
            onClose={() => setShowDialog(false)}
            size='xl'
            radius='md'
        >
            {renderForm({ col: collection, saveItem, deleteItem, closeForm, item: data?.find(p => p.id === itemId) || collection.getNew()})}
        </Dialog>}
        {status == 'success' && renderFilters
            ? <Box sx={{ maxWidth: 600 }}>
                <Group position='right'>
                    {renderFilters({ filters, setFilters })}
                    <ActionIcon size='lg' disabled={status != 'success' || isFetching} onClick={() => {
                        setItemId('')
                        setShowDialog(true)
                    }}>
                        <SquarePlus width={32} height={32} color='green' />
                    </ActionIcon>
                </Group>
                {renderTable({
                    items: (filters ? data?.filter(i => applyFilter(i, filters)) : data) || [],
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