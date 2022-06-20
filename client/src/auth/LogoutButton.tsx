import { useAuth0 } from '@auth0/auth0-react'
import { FC } from 'react'
import { Button } from '@mantine/core'

export const LogoutButton: FC<{ disabled?: boolean}> = ({
  disabled = false
}) => {
  const { logout } = useAuth0()

  return (
    <Button disabled={disabled} onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </Button>
  )
}