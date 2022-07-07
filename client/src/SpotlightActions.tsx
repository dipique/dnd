import { SpotlightAction } from '@mantine/spotlight'
import { Link, Login, Logout } from 'tabler-icons-react'
import { IAppContext } from './AppWrapper'
import { IAuthContext } from './AuthWrapper'

export const slIconSize = 18

export interface ISpotlightAction extends SpotlightAction {
    hidden: boolean
}

export const getActions = (appCtx: IAppContext, authCtx: IAuthContext): ISpotlightAction[] => [
    {
        id: 'people',
        title: 'Go to People',
        description: 'Open People page (NPCs, PCs, etc.)',
        onTrigger: () => appCtx.setActivePage('people'),
        icon: <Link size={slIconSize} />,
        hidden: !authCtx.isAuthenticated || appCtx.activePage == 'people'
    },
    {
        id: 'places',
        title: 'Go to Places',
        description: 'Open Places page',
        onTrigger: () => appCtx.setActivePage('places'),
        icon: <Link size={slIconSize} />,
        hidden: !authCtx.isAuthenticated || appCtx.activePage == 'places'
    },
    {
        id: 'logout',
        title: 'Log out',
        description: 'Log out of this application',
        onTrigger: () => authCtx.logout(),
        icon: <Logout size={slIconSize} />,
        hidden: !authCtx.isAuthenticated
    },
    {
        id: 'login',
        title: 'Log in',
        description: 'Log into this application',
        onTrigger: authCtx.loginWithRedirect,
        icon: <Login size={slIconSize} />,
        hidden: authCtx.isAuthenticated
    }
].filter(a => !a.hidden)