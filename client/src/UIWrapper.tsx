import { useContext, useMemo } from 'react'

import { MantineProvider } from '@mantine/core'
import { SpotlightProvider, SpotlightAction } from '@mantine/spotlight'
import { Search } from 'tabler-icons-react'

import { getActions, slIconSize } from './SpotlightActions'
import { AppContext } from './app'
import { NotificationsProvider } from '@mantine/notifications'

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