import { FC } from 'React'
import { useAuth0 } from '@auth0/auth0-react'

export const LoginButton: FC<{ disabled?: boolean}> = ({
    disabled = false
}) => {
  const { loginWithRedirect } = useAuth0()

  return <button disabled={disabled} onClick={() => loginWithRedirect()}>Log In</button>
}