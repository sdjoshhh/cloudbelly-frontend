import './Navbar.css'
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <div className='Navbar'>
      {/* to style later */}
      <NavLink to='/'><button>HOME</button></NavLink>
      <NavLink to='/map'><button>MAP</button></NavLink>
    </div>
  )
}

export default Navbar
