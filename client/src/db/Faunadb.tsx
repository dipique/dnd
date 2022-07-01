import { useAuth0 } from '@auth0/auth0-react'
import { useMemo } from 'react'
import { Person, Place } from '../entities'

export const apiUri = 'http://localhost:8000'

export interface ILink {
    id: string
    collection: string
    description: string
 }

export interface IItem {
    id: string
    name: string
    type: string
    image?: string

    links?: ILink[]
}

export interface IItemType {
    short: string
    display: string
}

export type ItemTypes = { [key: string]: IItemType }

export interface IDbActions<T extends IItem> {
    save: (item: T) => Promise<T>
    get: (id: string) => Promise<T>
    getAll: () => Promise<T[]>
    remove: (id: string) => Promise<void>
}

const useItemDb = <T extends IItem>(colName: string, createNew: () => T) => {
    const { getAccessTokenSilently } = useAuth0()
    const getToken = useMemo(() => async () => await getAccessTokenSilently({
        audience: 'dnd-api',
        scope: 'do:all'
    }), [])

    return {
        save: async (item: T) => {
            const idParam = item.id ? `?id=${item.id}` : ''
            const response = await fetch(`${apiUri}/${colName}${idParam}`, {
                method: item.id ? 'PATCH' : 'POST',
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            })
            return await response.json() as T
        },
        getAll: async () => {
            const response = await fetch(`${apiUri}/${colName}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            return (await response.json() || []) as T[]
        },
        get: async (id?: string) => {
            if (!id)
                return createNew()

            const response = await fetch(`${apiUri}/${colName}?id=${id}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            return await response.json() as T
        },
        remove: async (id: string) => {
            await fetch(`${apiUri}/${colName}?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
        }
    } as IDbActions<T>
}

export const usePersonDb = () => useItemDb<Person>('people', () => new Person())
export const usePlaceDb = () => useItemDb<Place>('places', () => new Place())