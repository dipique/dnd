import { useAuth0 } from '@auth0/auth0-react'
import { FC } from 'react'

export const LogoutButton: FC<{ disabled?: boolean}> = ({
  disabled = false
}) => {
  const { logout } = useAuth0()

  return (
    <button disabled={disabled} onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  )
}