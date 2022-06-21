import { useAuth0 } from '@auth0/auth0-react'
import { FC, useEffect, useState } from 'react'

import { MantineProvider, AppShell, Title } from '@mantine/core'

import { AppHeader } from './AppHeader'
import { AppNavbar } from './AppNavbar'
import { PersonForm } from './forms/PersonForm'
import { People } from './pages/People'
import { Places } from './pages/Places'
import { LoggedOut } from './pages/LoggedOut'

export const App: FC<{ apiUri: string }> = ({ apiUri }) => {
    const { user, isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0()
    const [ isLoading, setLoading ] = useState(false)
    const [ dark, setDark ] = useState(true)
    const [ activePage, setActivePage ] = useState('people')

    const ActivePage = () => {
        if (!isAuthenticated)
            return <LoggedOut />
        switch(activePage)
        {
            case 'people': return <People />
            case 'places': return <Places />
            default: return <div></div>
        }
    }

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
            <ActivePage />
            {/* <button
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
            </button> */}
        </AppShell>
    </MantineProvider>
}