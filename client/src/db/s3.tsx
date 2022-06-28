// try {
                //     const accessToken = await getAccessTokenSilently({
                //         audience: 'dnd-api',
                //         scope: 'do:all'
                //     })
                //     const response = await fetch(`${ctx.apiUri}/download`, {
                //         headers: {
                //             Authorization: `Bearer ${accessToken}`
                //         }
                //     })
                //     console.log('success')
                // } finally {
                //     setLoading(false)
                // }