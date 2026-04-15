import './Home.css'
import useTypewriter from './UseTypewriter.jsx'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <>
      <div className='home-container'>
        <img
          className='bg-img'
          src='intro-bg.png'
        />
        <div className='intro-container'>
          <div className='title'>{useTypewriter('WELCOME TO HOUSEFLY', 45)}</div>
          <div className='body-text'>
            <a>All the property info you need in one place</a>
            <a>Research smarter, plan better, buy with confidence</a>
          </div>
          <div className='button-container'>
            <button onClick={() => navigate('/map')}>map</button>
            <button>analysis</button>
          </div>
          <div className='box'>
            <a className='box-text'>YOUR EYE IN THE SKY</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
