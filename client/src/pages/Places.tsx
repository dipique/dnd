import { useAuth0 } from '@auth0/auth0-react'
import { Title } from '@mantine/core'
import { useContext, useState } from 'react'
import { AppContext } from '../app'

export const Places = () => {
    const { getAccessTokenSilently } = useAuth0()
    const [ loading, setLoading ] = useState(false)
    const ctx = useContext(AppContext)
    return <>
        <Title>Places</Title>
        <button
                disabled={!ctx.isAuthenticated || loading}
                onClick={async () => {
                    setLoading(true)

                    try {
                        const accessToken = await getAccessTokenSilently({
                            audience: 'dnd-api',
                            scope: 'do:all'
                        })
                        const response = await fetch(`${ctx.apiUri}/download`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        })
                        console.log('success')
                    } finally {
                        setLoading(false)
                    }
                }}
            >
                Call API
            </button>
    </>
}