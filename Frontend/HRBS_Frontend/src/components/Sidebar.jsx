import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiX } from "react-icons/hi";

function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    if (window.innerWidth < 1024) setIsOpen(false);
    navigate("/login");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        fixed lg:relative z-50 lg:z-auto
        w-72 sidebar-gradient text-white h-screen p-6 flex flex-col shadow-2xl lg:shadow-none 
        transition-all duration-500 ease-in-out overflow-hidden
      `}
    >
      <div className="flex justify-between items-center mb-10 px-2">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold">H</span>
           </div>
           <h1 className="text-3xl font-bold tracking-tight">HRBS</h1>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden text-2xl hover:bg-white/10 p-2 rounded-xl transition-all"
        >
          <HiX />
        </button>
      </div>

      <nav className="space-y-2 flex-grow">
        <Link 
          to="/dashboard" 
          onClick={handleNavClick}
          className={`
            flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group
            ${isActive("/dashboard") ? "bg-blue-600 shadow-lg" : "hover:bg-white/5"}
          `}
        >
          <span className={`text-xl ${isActive("/dashboard") ? "text-white" : "text-slate-400 group-hover:text-white"}`}>Hotels</span>
        </Link>

        <Link 
          to="/bookings" 
          onClick={handleNavClick}
          className={`
            flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group
            ${isActive("/bookings") ? "bg-blue-600 shadow-lg" : "hover:bg-white/5"}
          `}
        >
          <span className={`text-xl ${isActive("/bookings") ? "text-white" : "text-slate-400 group-hover:text-white"}`}>My Bookings</span>
        </Link>

        <Link 
          to="/favorites" 
          onClick={handleNavClick}
          className={`
            flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 group
            ${isActive("/favorites") ? "bg-blue-600 shadow-lg" : "hover:bg-white/5"}
          `}
        >
          <span className={`text-xl ${isActive("/favorites") ? "text-white" : "text-slate-400 group-hover:text-white"}`}>Favorites</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-2xl transition-all duration-300 font-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;