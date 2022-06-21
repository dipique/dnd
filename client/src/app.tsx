import { useAuth0 } from '@auth0/auth0-react'
import { FC, useEffect, useMemo, useState } from 'react'

import { MantineProvider, AppShell, Title } from '@mantine/core'

import { AppHeader } from './AppHeader'
import { AppNavbar } from './AppNavbar'
import { People } from './pages/People'
import { Places } from './pages/Places'
import { LoggedOut } from './pages/LoggedOut'
import { SpotlightProvider, SpotlightAction } from '@mantine/spotlight'
// import { actions, slIconSize } from './SpotlightActions'
import { Search, Login, Logout } from 'tabler-icons-react'
import { slIconSize } from './SpotlightActions'

export const App: FC<{ apiUri: string }> = ({ apiUri }) => {
    const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0()
    const [ dark, setDark ] = useState(true)
    const [ activePage, setActivePage ] = useState('people')

    const actions: SpotlightAction[] = useMemo(() => [
        {
            title: 'Search',
            description: 'Search',
            onTrigger: () => console.log('search'),
            icon: <Search size={slIconSize} />
        },
        // {
        //     title: 'Log out',
        //     description: 'Log out of this application',
        //     onTrigger: () => console.log('log out'),
        //     icon: <Logout size={slIconSize} />
        // },
        // {
        //     title: 'Log in',
        //     description: 'Log into this application',
        //     onTrigger: () => console.log('log in'),
        //     icon: <Login size={slIconSize} />
        // }
    ], [])

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
        <SpotlightProvider
            actions={actions}
            searchIcon={<Search size={slIconSize} />}
            searchPlaceholder='Search...'
            nothingFoundMessage='Action not found'
            highlightQuery
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
        </SpotlightProvider>
    </MantineProvider>
}