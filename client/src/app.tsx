import { createContext, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { LogoutOptions, RedirectLoginOptions, useAuth0 } from '@auth0/auth0-react'
import { AppShell } from '@mantine/core'
import { AppHeader } from './AppHeader'
import { AppNavbar } from './AppNavbar'
import { Encounters, People, Places } from './pages/EntityPages'
import { LoggedOut } from './pages/LoggedOut'
import { UIWrapper } from './UIWrapper'
import { DbWrapper } from './DbWrapper'

export interface IAppContext {
    activePage: string
    setActivePage: (s: string) => void
    isAuthenticated: boolean
    logout: (o?: LogoutOptions) => void,
    loginWithRedirect: (o?: RedirectLoginOptions) => void
}

export const AppContext = createContext<IAppContext>({} as IAppContext)
const queryClient = new QueryClient()

export const App = () => {
    const { isAuthenticated, logout, loginWithRedirect } = useAuth0()
    const [ activePage, setActivePage ] = useState('people')
    
    // const isAuthenticated = true  // makes things load quick during development

    const ActivePage = () => {
        if (!isAuthenticated)
            return <LoggedOut />
        switch(activePage)
        {
            case 'people': return <People />
            case 'places': return <Places />
            case 'encounters': return <Encounters />
            default: return <div>Invalid page</div>
        }
    }

    return <>
        <AppContext.Provider
            value={{  activePage, setActivePage,
                      isAuthenticated,
                      logout, loginWithRedirect    }}
        >
            <UIWrapper>
                <QueryClientProvider client={queryClient}>
                    <DbWrapper>
                        <AppShell
                            padding="md"
                            navbar={<AppNavbar />}
                            header={<AppHeader />}
                        >
                            <ActivePage />
                        </AppShell>
                    </DbWrapper>
                </QueryClientProvider>
            </UIWrapper>
        </AppContext.Provider>
    </>
}