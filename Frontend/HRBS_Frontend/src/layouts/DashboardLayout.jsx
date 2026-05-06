import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
      
      {/* Sidebar - Permanent on Desktop, Toggleable on Mobile */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Overlay Backdrop - Only on Mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className={!isDashboard ? "lg:hidden" : ""}>
          <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;