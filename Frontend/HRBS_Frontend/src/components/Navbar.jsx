import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-end items-center">
      
      {user ? (
        <button
          onClick={goToProfile}
          className="focus:outline-none"
        >
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white hover:opacity-80 transition"
            />
          ) : (
            <FaUserCircle className="text-3xl hover:opacity-80 transition" />
          )}
        </button>
      ) : (
        <div className="space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;