import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

export const DbWrapper = (props: any) => {

    return <QueryClientProvider client={queryClient} children={props.children} />
}