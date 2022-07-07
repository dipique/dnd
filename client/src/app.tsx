import { createContext, useContext, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { LogoutOptions, RedirectLoginOptions, useAuth0 } from '@auth0/auth0-react'
import { AppShell } from '@mantine/core'
import { AppHeader } from './AppHeader'
import { AppNavbar } from './AppNavbar'
import { LoggedOut } from './pages/LoggedOut'
import { UIWrapper } from './UIWrapper'
import { DbContext, DbWrapper } from './DbWrapper'
import { Encounter, Person, Place, Session } from './entities'
import { AppPage } from './pages/AppPage'
import { AuthContext } from './AuthWrapper'

export interface IAppContext {
    activePage: string
    setActivePage: (s: string) => void
}

export const AppContext = createContext<IAppContext>({} as IAppContext)

export const App = () => {
    const { isAuthenticated } = useContext(AuthContext)
    const [ activePage, setActivePage ] = useState('people')

    const ActivePage = () => {
        if (!isAuthenticated)
            return <LoggedOut />
        switch(activePage)
        {
            case 'people': return <AppPage<Person> col={useContext(DbContext).peopleCol} />
            case 'places': return <AppPage<Place> col={useContext(DbContext).placesCol} />
            case 'encounters': return <AppPage<Encounter> col={useContext(DbContext).encountersCol} />
            case 'sessions': return <AppPage<Session> col={useContext(DbContext).sessionsCol} />
            default: return <div>Invalid page</div>
        }
    }

    return <>
        <AppContext.Provider
            value={{  activePage, setActivePage }}
        >
            <UIWrapper>
                <ActivePage />
            </UIWrapper>
        </AppContext.Provider>
    </>
}