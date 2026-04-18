import './Navbar.css'
import { NavLink } from 'react-router-dom';
import { IoPersonSharp } from "react-icons/io5";
import { IoHomeSharp } from "react-icons/io5";
import { HiMapPin } from "react-icons/hi2";
import { FaChartLine } from "react-icons/fa6";

function Navbar() {
  return (
    <div className='Navbar'>
      <NavLink to='/'><button className='nav-btn'><IoHomeSharp /></button></NavLink>
      <NavLink to='/map'><button className='nav-btn'><HiMapPin /></button></NavLink>
      <NavLink to='/analysis'><button className='nav-btn'><FaChartLine /></button></NavLink>
      <NavLink to='/login'><button className='nav-btn'><IoPersonSharp /></button></NavLink>
    </div>
  )
}

export default Navbar
