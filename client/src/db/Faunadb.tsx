import { useAuth0 } from '@auth0/auth0-react'
import { useMemo } from 'react'
import { Person } from '../entities'

export const apiUri = 'http://localhost:8000'

export interface IDbActions<T> {
    save: (person: T) => Promise<T>
    get: (id: string) => Promise<T>
    getAll: () => Promise<T[]>
    remove: (id: string) => Promise<void>
}

export const usePersonDb = () => {
    const { getAccessTokenSilently } = useAuth0()
    const getToken = useMemo(() => async () => await getAccessTokenSilently({
        audience: 'dnd-api',
        scope: 'do:all'
    }), [])

    return {
        save: async (person: Person) => {
            const idParam = person.id ? `?id=${person.id}` : ''
            const response = await fetch(`${apiUri}/people${idParam}`, {
                method: person.id ? 'PATCH' : 'POST',
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(person)
            })
            return await response.json() as Person
        },
        getAll: async () => {
            const response = await fetch(`${apiUri}/people`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            return await response.json() as Person[]
        },
        get: async (id?: string) => {
            if (!id)
                return new Person()

            const response = await fetch(`${apiUri}/people?id=${id}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            return await response.json() as Person
        },
        remove: async (id: string) => {
            await fetch(`${apiUri}/people?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
        }
    } as IDbActions<Person>
}