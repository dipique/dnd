import { useAuth0 } from '@auth0/auth0-react'
import { useContext, useMemo } from 'react'
import { AppContext } from '../app'
import { Person } from '../entities'

export const usePersonDb = () => {
    const { getAccessTokenSilently } = useAuth0()
    const { apiUri } = useContext(AppContext)
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

            const accessToken = await getAccessTokenSilently({
                audience: 'dnd-api',
                scope: 'do:all'
            })
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
    }
}