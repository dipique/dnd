import { useAuth0 } from '@auth0/auth0-react'
import { FC, useEffect, useState } from 'react'

import { LoginButton } from './auth/LoginButton'
import { LogoutButton } from './auth/LogoutButton'

export const App: FC<{ apiUri: string }> = ({ apiUri }) => {
    const { user, isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0()
    const [ isLoading, setLoading ] = useState(false)

    useEffect(() => user && console.log(user), [user])

    return <>
        <h1>Hello React!</h1>
        <LoginButton disabled={authLoading || isAuthenticated} />
        <LogoutButton disabled={authLoading || !isAuthenticated} />
        <button
            disabled={authLoading || isLoading}
            onClick={async () => {
                setLoading(true)

                try {
                    const accessToken = await getAccessTokenSilently({
                        audience: 'dnd-api',
                        scope: 'do:all'
                    })
                    const response = await fetch(`${apiUri}/download`, {
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