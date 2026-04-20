import './Home.css'
import useTypewriter from './UseTypewriter.jsx'
import { useNavigate } from 'react-router-dom'
import houseflyLogo from '../assets/housefly.png'
import { getCurrentUser } from '../auth/auth.js'

function Home() {
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  }

  const getWelcome = () => {
    const user = getCurrentUser();
    return user ? `Welcome ${user.name}!` : "";
  }
  return (
    <>
      <div className='home-container'>
        <img
          className='bg-img'
          src='intro-bg.png'
        />
        <div className='intro-container'>
          <img className="housefly-logo" src={houseflyLogo} alt="Housefly Logo" />
          <div className='title'>{useTypewriter('WELCOME TO HOUSEFLY', 45)}</div>
          <div className='title'>{getWelcome()}</div>
          <div className='body-text'>
            <a>All the property info you need in one place</a>
            <a>Research smarter, plan better, buy with confidence</a>
          </div>
          <div className='box'>
            <a className='box-text'>YOUR EYE IN THE SKY</a>
          </div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="fixed bottom-6 left-6 rounded-xl bg-blue-500 px-6 py-3 text-white text-lg shadow-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </>
  )
}

export default Home
