import { NavLink } from 'react-router-dom'
import { IoPersonSharp, IoHomeSharp } from 'react-icons/io5'
import { HiMapPin } from 'react-icons/hi2'
import { FaChartLine } from 'react-icons/fa6'

const links = [
  { to: '/',         icon: <IoHomeSharp /> },
  { to: '/map',      icon: <HiMapPin /> },
  { to: '/analysis', icon: <FaChartLine /> },
  { to: '/login',    icon: <IoPersonSharp /> },
]

function Navbar() {
  return (
    <div className="fixed top-[60vh] left-[94vw] z-[1002] flex flex-col gap-2">
      {links.map(({ to, icon }) => (
        <NavLink key={to} to={to}>
          <button className="w-[8vh] h-[8vh] rounded-full bg-white/80 text-black shadow-md text-base hover:bg-gray-600 hover:text-white hover:cursor-pointer border-none flex items-center justify-center">
            {icon}
          </button>
        </NavLink>
      ))}
    </div>
  )
}

export default Navbar
