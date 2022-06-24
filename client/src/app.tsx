import { LogoutOptions, RedirectLoginOptions, useAuth0 } from '@auth0/auth0-react'
import { FC, useState } from 'react'

import { AppShell } from '@mantine/core'

import { createContext } from 'react'
import { AppHeader } from './AppHeader'
import { AppNavbar } from './AppNavbar'
import { People } from './pages/People'
import { Places } from './pages/Places'
import { LoggedOut } from './pages/LoggedOut'
import { UIWrapper } from './UIWrapper'
import { QueryClient, QueryClientProvider } from 'react-query'

export interface IAppContext {
    activePage: string
    setActivePage: (s: string) => void
    dark: boolean
    setDark: (b: boolean) => void
    apiUri: string
    isAuthenticated: boolean
    logout: (o?: LogoutOptions) => void,
    loginWithRedirect: (o?: RedirectLoginOptions) => void
}

const queryClient = new QueryClient()
export const AppContext = createContext<IAppContext>({} as IAppContext)

export const App: FC<{ apiUri: string }> = ({ apiUri }) => {
    const { /* isAuthenticated,*/ logout, loginWithRedirect } = useAuth0()
    const [ dark, setDark ] = useState(true)
    const [ activePage, setActivePage ] = useState('people')
    
    const isAuthenticated = true  // makes things load quick during development

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

    return <>
        <AppContext.Provider
            value={{  activePage, setActivePage,
                      dark, setDark,
                      apiUri, isAuthenticated,
                      logout, loginWithRedirect    }}
        >
            <QueryClientProvider client={queryClient}>
            <UIWrapper>
                <AppShell
                    padding="md"
                    navbar={<AppNavbar />}
                    header={<AppHeader />}
                >
                    <ActivePage />
                </AppShell>
            </UIWrapper>
            </QueryClientProvider>
        </AppContext.Provider>
    </>
}