import { Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Home from './home/Home';
import Map from './map/Map';
import Navbar from './navBar/NavBar';
import { logout } from './auth/auth';

function App() {
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path = '/' element={<Home />} />
        <Route path = '/map' element={<Map />} />
        <Route path = '/login' element={<Login />} />
        <Route path = '/register' element={<Register />} />
      </Routes>
      <button
        onClick={handleLogout}
        className="fixed bottom-6 left-6 rounded-xl bg-blue-500 px-6 py-3 text-white text-lg shadow-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </>
  )
}

export default App
