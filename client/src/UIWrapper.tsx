import { useContext, useMemo } from 'react'

import { MantineProvider } from '@mantine/core'
import { SpotlightProvider, SpotlightAction } from '@mantine/spotlight'
import { Search } from 'tabler-icons-react'

import { getActions, slIconSize } from './SpotlightActions'
import { AppContext } from './app'

export const UIWrapper = (props: any) => {
    const ctx = useContext(AppContext)

    const actions: SpotlightAction[] = useMemo(() => getActions(ctx), [ctx])

    return <>
        <MantineProvider
            theme={ctx.dark ? { colorScheme: 'dark'} : undefined}
            withGlobalStyles
            withNormalizeCSS
        >
            <SpotlightProvider
                actions={actions}
                searchIcon={<Search size={slIconSize} />}
                searchPlaceholder='Search...'
                nothingFoundMessage='Action not found'
                highlightQuery
                children={props.children}
            />
        </MantineProvider>
    </>
}