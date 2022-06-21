import { useAuth0 } from '@auth0/auth0-react'

import { Header } from '@mantine/core'
import { registerSpotlightActions, removeSpotlightActions } from '@mantine/spotlight'
import { useEffect } from 'react'
import { Login, Logout } from 'tabler-icons-react'
import { LoginButton } from './auth/LoginButton'
import { LogoutButton } from './auth/LogoutButton'
import { slIconSize } from './SpotlightActions'

export const AppHeader = () => {
    const { isAuthenticated, isLoading, logout, loginWithRedirect } = useAuth0()

    useEffect(() => {
        if (isLoading) return;

        registerSpotlightActions([isAuthenticated
          ? {
                id: 'logout',
                title: 'Log out',
                description: 'Log out of this application',
                onTrigger: () => logout(),
                icon: <Logout size={slIconSize} />
            }
          : {
                id: 'login',
                title: 'Log in',
                description: 'Log into this application',
                onTrigger: loginWithRedirect,
                icon: <Login size={slIconSize} />
            }
        ])
        
        return removeSpotlightActions(['logout', 'login'])
    }, [isAuthenticated, isLoading])

    return <Header height={60} p="xs">
            <LoginButton disabled={isLoading || isAuthenticated} />
            <LogoutButton disabled={isLoading || !isAuthenticated} />
    </Header>
}