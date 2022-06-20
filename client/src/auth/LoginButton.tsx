import { FC } from 'React'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@mantine/core'

export const LoginButton: FC<{ disabled?: boolean}> = ({
    disabled = false
}) => {
  const { loginWithRedirect } = useAuth0()

  return <Button disabled={disabled} onClick={() => loginWithRedirect()}>Log In</Button>
}