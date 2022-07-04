import { ActionIcon, Center, Navbar, Title } from '@mantine/core'
import { FC, useContext, useState } from 'react'
import { CalendarEvent, Location, MoodBoy, Swords } from 'tabler-icons-react'
import { AppContext } from './App'

const hoverHighlight = 'rgba(147, 147, 147, 0.1)'
const optionBaseStyle = { padding: '8px' }
export const AppNavbar = () => {
    const { activePage, setActivePage } = useContext(AppContext)
    const [ hoverPage, setHoverPage ] = useState('')

    const NavbarOption: FC<{ icon: JSX.Element, label: string }> = ({ icon, label }) =>
        <tr
            style={(hoverPage === label || activePage === label) ? { ...optionBaseStyle, background: hoverHighlight } : optionBaseStyle}
            onMouseOver={() => setHoverPage(label)}
            onMouseOut={() => setHoverPage('')}
            onClick={() => setActivePage(label)}
        >
            <td><ActionIcon size='xl'>{icon}</ActionIcon></td>
            <td><Title style={{ marginLeft: '6px'}} order={5}>{label}</Title></td>
        </tr>

    return <Navbar width={{ base: 180 }} p='md'><table style={{ borderSpacing: '0' }}><tbody>
        <NavbarOption icon={<MoodBoy size={40} />} label='people' />
        <NavbarOption icon={<Location size={40} />} label='places' />
        <NavbarOption icon={<Swords size={40} />} label='encounters' />
        <NavbarOption icon={<CalendarEvent size={40} />} label='sessions' />
    </tbody></table></Navbar>
}