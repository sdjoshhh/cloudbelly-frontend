import './Navbar.css'
import { NavLink } from 'react-router-dom';
import { IoPersonSharp } from "react-icons/io5";
import { IoHomeSharp } from "react-icons/io5";
import { HiMapPin } from "react-icons/hi2";
import { FaChartLine } from "react-icons/fa6";

function Navbar() {
  return (
    <div className='Navbar'>
      <NavLink to='/'><button><IoHomeSharp /></button></NavLink>
      <NavLink to='/map'><button><HiMapPin /></button></NavLink>
      <NavLink to='/analysis'><button><FaChartLine /></button></NavLink>
      <NavLink to='/user'><button><IoPersonSharp /></button></NavLink>
    </div>
  )
}

export default Navbar
