import { useAuth0 } from '@auth0/auth0-react'
import { FC, useEffect, useMemo, useState } from 'react'

import { MantineProvider, AppShell, Title } from '@mantine/core'

import { createContext } from 'react'
import { AppHeader } from './AppHeader'
import { AppNavbar } from './AppNavbar'
import { People } from './pages/People'
import { Places } from './pages/Places'
import { LoggedOut } from './pages/LoggedOut'
import { SpotlightProvider, SpotlightAction } from '@mantine/spotlight'
// import { actions, slIconSize } from './SpotlightActions'
import { Link, Search } from 'tabler-icons-react'
import { slIconSize } from './SpotlightActions'

export interface IAppContext {
    activePage: string
    setActivePage: (s: string) => void
    dark: boolean
    setDark: (b: boolean) => void
}

export const AppContext = createContext<IAppContext>({} as IAppContext)

export const App: FC<{ apiUri: string }> = ({ apiUri }) => {
    const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0()
    const [ dark, setDark ] = useState(true)
    const [ activePage, setActivePage ] = useState('people')

    const actions: SpotlightAction[] = useMemo(() => [
        {
            id: 'people',
            title: 'Go to People',
            description: 'Open People page (NPCs, PCs, etc.)',
            onTrigger: () => setActivePage('people'),
            icon: <Link size={slIconSize} />
        },
        {
            id: 'places',
            title: 'Go to Places',
            description: 'Open Places page',
            onTrigger: () => setActivePage('places'),
            icon: <Link size={slIconSize} />
        },
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

    return <AppContext.Provider value={{
        activePage, setActivePage,
        dark, setDark
    }}><MantineProvider
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
    </AppContext.Provider>
}