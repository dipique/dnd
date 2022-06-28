import { LogoutOptions, RedirectLoginOptions, useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'

import { AppShell } from '@mantine/core'

import { createContext } from 'react'
import { AppHeader } from './AppHeader'
import { AppNavbar } from './AppNavbar'
import { People } from './pages/People'
import { Places } from './pages/Places'
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

export const App = () => {
    const { /* isAuthenticated,*/ logout, loginWithRedirect } = useAuth0()
    const [ activePage, setActivePage ] = useState('people')
    
    const isAuthenticated = true  // makes things load quick during development

    const ActivePage = () => {
        if (!isAuthenticated)
            return <LoggedOut />
        switch(activePage)
        {
            case 'people': return <People />
            case 'places': return <Places />
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
                <DbWrapper>
                    <AppShell
                        padding="md"
                        navbar={<AppNavbar />}
                        header={<AppHeader />}
                    >
                        <ActivePage />
                    </AppShell>
                </DbWrapper>
            </UIWrapper>
        </AppContext.Provider>
    </>
}