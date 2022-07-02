import { SpotlightAction } from '@mantine/spotlight'
import { Link, Login, Logout } from 'tabler-icons-react'
import { IAppContext } from './App'

export const slIconSize = 18

export interface ISpotlightAction extends SpotlightAction {
    hidden: boolean
}

export const getActions = (ctx: IAppContext): ISpotlightAction[] => [
    {
        id: 'people',
        title: 'Go to People',
        description: 'Open People page (NPCs, PCs, etc.)',
        onTrigger: () => ctx.setActivePage('people'),
        icon: <Link size={slIconSize} />,
        hidden: !ctx.isAuthenticated || ctx.activePage == 'people'
    },
    {
        id: 'places',
        title: 'Go to Places',
        description: 'Open Places page',
        onTrigger: () => ctx.setActivePage('places'),
        icon: <Link size={slIconSize} />,
        hidden: !ctx.isAuthenticated || ctx.activePage == 'places'
    },
    {
        id: 'logout',
        title: 'Log out',
        description: 'Log out of this application',
        onTrigger: () => ctx.logout(),
        icon: <Logout size={slIconSize} />,
        hidden: !ctx.isAuthenticated
    },
    {
        id: 'login',
        title: 'Log in',
        description: 'Log into this application',
        onTrigger: ctx.loginWithRedirect,
        icon: <Login size={slIconSize} />,
        hidden: ctx.isAuthenticated
    }
].filter(a => !a.hidden)