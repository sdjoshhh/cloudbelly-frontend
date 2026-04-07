import './Navbar.css'
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <>
      {/* to style later */}
      <NavLink to='/'><button>home</button></NavLink>
      <NavLink to='/map'><button>map</button></NavLink>
    </>
  )
}

export default Navbar
