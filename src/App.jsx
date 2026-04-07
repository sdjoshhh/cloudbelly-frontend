import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import Map from './map/Map';
import Navbar from './navBar/NavBar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path = '/' element={<Home />} />
        <Route path = '/map' element={<Map />} />
      </Routes>
    </>
  )
}

export default App
