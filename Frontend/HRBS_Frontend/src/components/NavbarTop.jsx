import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa"; // Profile icon

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile"); // Navigate to profile page
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      {/* Branding */}
      <div to="" className="text-xl font-bold"></div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:underline">
          Hotels
        </Link>

        {user ? (
          <>
            {/* Profile Icon */}
            <button
              onClick={goToProfile}
              className="flex items-center space-x-1 hover:underline"
            >
              <FaUserCircle className="text-2xl" />
              <span className="hidden sm:inline">{user.name || "Profile"}</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;