import { ActionIcon, Center, Navbar, Title } from '@mantine/core'
import { FC, useContext, useState } from 'react'
import { Location, MoodBoy } from 'tabler-icons-react'
import { AppContext } from './app'

const hoverHighlight = 'rgba(147, 147, 147, 0.1)'
export const AppNavbar = () => {
    const { activePage, setActivePage } = useContext(AppContext)
    const [ hoverPage, setHoverPage ] = useState('')

    const NavbarOption: FC<{ icon: JSX.Element, label: string }> = ({ icon, label }) =>
        <Center
            style={(hoverPage === label || activePage === label) ? { background: hoverHighlight } : undefined}
            onMouseOver={() => setHoverPage(label)}
            onMouseOut={() => setHoverPage('')}
            onClick={() => setActivePage(label)}
        >
            <ActionIcon size='xl'>{icon}</ActionIcon>
            <Title style={{ marginLeft: '6px'}} order={6}>{label}</Title>
        </Center>

    return <Navbar width={{ base: 150 }} p='md'>
        <NavbarOption icon={<MoodBoy size={50} />} label='people' />
        <NavbarOption icon={<Location size={50} />} label='places' />
    </Navbar>
}