import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiX } from "react-icons/hi";

function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (window.innerWidth < 1024) setIsOpen(false);
    navigate("/login");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <div
      className={`${
        isOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-24 w-0"
      } fixed lg:relative z-50 lg:z-auto bg-blue-700 text-white min-h-screen transition-all duration-300 p-6 flex flex-col shadow-2xl lg:shadow-none overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold truncate">{isOpen ? "HRBS" : "H"}</h1>
        <button 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden text-2xl hover:bg-blue-600 p-1 rounded"
        >
          <HiX />
        </button>
      </div>

      <nav className="space-y-6 flex-grow">
        <Link 
          to="/dashboard" 
          onClick={handleNavClick}
          className="block hover:bg-blue-600 p-3 rounded truncate text-xl font-medium transition-all"
        >
          {isOpen ? "Hotels" : "H"}
        </Link>

        <Link 
          to="/bookings" 
          onClick={handleNavClick}
          className="block hover:bg-blue-600 p-3 rounded truncate text-xl font-medium transition-all"
        >
          {isOpen ? "My Bookings" : "B"}
        </Link>
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="block w-full text-center bg-red-600 hover:bg-red-700 p-3 rounded transition-colors truncate text-xl font-bold"
        >
          {isOpen ? "Logout" : "L"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;