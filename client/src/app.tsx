import { useAuth0 } from '@auth0/auth0-react'
import { FC, useEffect, useState } from 'react'

import { MantineProvider, AppShell, Navbar, Header, Title } from '@mantine/core'


import { LoginButton } from './auth/LoginButton'
import { LogoutButton } from './auth/LogoutButton'
import { AppHeader } from './AppHeader'
import { AppNavbar } from './AppNavbar'

export const App: FC<{ apiUri: string }> = ({ apiUri }) => {
    const { user, isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0()
    const [ isLoading, setLoading ] = useState(false)
    const [ dark, setDark ] = useState(true)

    useEffect(() => user && console.log(user), [user])

    return <MantineProvider
        theme={dark ? { colorScheme: 'dark'} : undefined}
        withGlobalStyles
        withNormalizeCSS
    >
        <AppShell
            padding="md"
            navbar={<AppNavbar />}
            header={<AppHeader />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Title>Hello React!</Title>
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
        </AppShell>
    </MantineProvider>
}