import './NavBar.css'
import { NavLink } from 'react-router-dom';
import { IoHomeSharp, IoPersonSharp } from "react-icons/io5";
import { HiMapPin } from "react-icons/hi2";
import { FaChartLine } from "react-icons/fa6";
import houseflyLogo from '../assets/housefly-logo.png'
import houseflyText from '../assets/housefly-text.png'
import { getCurrentUser } from '../auth/auth';

function NavBar({ isLoggedIn, profilePhotoUrl }) {
  const navItems = [
    { to: "/", label: "Home", icon: <IoHomeSharp className="text-lg" /> },
    { to: "/map", label: "Map", icon: <HiMapPin className="text-lg" /> },
    { to: "/analysis", label: "Analytics", icon: <FaChartLine className="text-lg" /> },
  ];

  const user = getCurrentUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-3 shrink-0"
        >
          <img src={houseflyLogo} alt="Logo" className="h-10 w-10" />
          <div className="hidden sm:block">
            <img src={houseflyText} alt="Housefly" className="h-5 w-auto" />
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Housing Events Made Easy
            </p>
          </div>
        </NavLink>

        {/* Nav */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}

          {/* User area */}
          {!user ? (
            <NavLink
              to="/login"
              className="ml-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <IoPersonSharp className="text-lg" />
              <span className="hidden sm:inline">Login</span>
            </NavLink>
          ) : (
            <NavLink
              to="/profile"
              className="ml-2 flex items-center justify-center rounded-full ring-2 ring-transparent transition hover:ring-blue-200"
            >
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  <IoPersonSharp className="text-xl" />
                </div>
              )}
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
