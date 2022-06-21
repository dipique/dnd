import { Title } from '@mantine/core'

export const Places = () => {
    return <>
        <Title>Places</Title>
        {/* <button
                disabled={authLoading || isLoading}
                onClick={async () => {
                    setLoading(true)

                    try {
                        const accessToken = await getAccessTokenSilently({
                            audience: 'dnd-api',
                            scope: 'do:all'
                        })
                        const response = await fetch(`${apiUri}/download`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        })
                        console.log('success')
                    } finally {
                        setLoading(false)
                    }
                }}
            >
                Call API
            </button> */}
    </>
}