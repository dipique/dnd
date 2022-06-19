import React from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { App } from './app'
import './index.css'

createRoot(
    document.getElementById('app-root')!
).render(
    <Auth0Provider
        domain='dev-n8eqgexp.us.auth0.com'
        clientId='ZpWM5PKXKsGg48nhMiVGibGjPb56FX4c'
        redirectUri={window.location.origin}
    >
        <App />
    </Auth0Provider>
)

