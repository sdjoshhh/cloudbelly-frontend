import { Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Home from './home/Home';
import Map from './map/Map';
import NavBar from './navBar/NavBar';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path = '/' element={<Home />} />
        <Route path = '/map' element={<Map />} />
        <Route path = '/login' element={<Login />} />
        <Route path = '/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App
