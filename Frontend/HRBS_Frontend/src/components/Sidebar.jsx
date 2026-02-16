import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Sidebar({ isOpen }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-blue-700 text-white transition-all duration-300 p-4`}
    >
      <h1 className="text-xl font-bold mb-6">HRBS</h1>

      <nav className="space-y-4">
        <Link to="/dashboard" className="block hover:bg-blue-600 p-2 rounded">
          Hotels
        </Link>

        <Link to="/bookings" className="block hover:bg-blue-600 p-2 rounded">
          My Bookings
        </Link>

        <button
          onClick={handleLogout}
          className="block w-full text-left hover:bg-red-600 p-2 rounded mt-6"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;