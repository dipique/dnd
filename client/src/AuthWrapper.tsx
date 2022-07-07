import { createContext, FC, ReactNode } from 'react'
import { LogoutOptions, RedirectLoginOptions, useAuth0 } from '@auth0/auth0-react'

export interface IAuthContext {
    isAuthenticated: boolean
    logout: (o?: LogoutOptions) => void,
    loginWithRedirect: (o?: RedirectLoginOptions) => void
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export const AuthWrapper: FC<{children: ReactNode}> = props => {
    const { isAuthenticated, logout, loginWithRedirect } = useAuth0()
    
    return <>
        <AuthContext.Provider
            value={{
                isAuthenticated, // makes things load quick during development
                logout,
                loginWithRedirect
            }}
            children={props.children}
        />
    </>
}