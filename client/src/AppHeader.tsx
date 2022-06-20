import { useAuth0 } from '@auth0/auth0-react'

import { Header } from '@mantine/core'
import { LoginButton } from './auth/LoginButton'
import { LogoutButton } from './auth/LogoutButton'

export const AppHeader = () => {
    const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0()

    return <Header height={60} p="xs">
            <LoginButton disabled={authLoading || isAuthenticated} />
            <LogoutButton disabled={authLoading || !isAuthenticated} />
    </Header>
}