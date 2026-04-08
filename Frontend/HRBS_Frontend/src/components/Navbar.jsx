import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi"; // Hamburger icons

function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <nav className="bg-blue-600 text-white px-4 md:px-6 py-3 flex justify-between items-center shadow-md">
      
      {/* Sidebar Toggle Button (Mobile & Desktop) */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-blue-700 transition lg:block"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Right Section: User Profile */}
      <div className="flex items-center space-x-4">
        {user ? (
          <button
            onClick={goToProfile}
            className="focus:outline-none flex items-center gap-2 group"
          >
            <span className="hidden sm:inline-block text-sm font-medium group-hover:underline">
              {user.email.split("@")[0]}
            </span>
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-white group-hover:opacity-80 transition"
              />
            ) : (
              <FaUserCircle className="text-3xl group-hover:opacity-80 transition" />
            )}
          </button>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;