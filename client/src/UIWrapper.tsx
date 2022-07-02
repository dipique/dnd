import { useContext, useMemo } from 'react'
import { Search } from 'tabler-icons-react'

import { MantineProvider } from '@mantine/core'
import { SpotlightProvider, SpotlightAction } from '@mantine/spotlight'
import { NotificationsProvider } from '@mantine/notifications'
import { getActions, slIconSize } from './SpotlightActions'

import { AppContext } from './App'

export const UIWrapper = (props: any) => {
    const ctx = useContext(AppContext)

    const actions: SpotlightAction[] = useMemo(() => getActions(ctx), [ctx])

    return <>
        <MantineProvider
            theme={{ colorScheme: 'dark'}}
            withGlobalStyles
            withNormalizeCSS
        >
            <NotificationsProvider>
                <SpotlightProvider
                    actions={actions}
                    searchIcon={<Search size={slIconSize} />}
                    searchPlaceholder='Search...'
                    nothingFoundMessage='Action not found'
                    highlightQuery
                    children={props.children}
                />
            </NotificationsProvider>
        </MantineProvider>
    </>
}