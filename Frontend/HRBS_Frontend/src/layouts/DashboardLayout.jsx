import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);

  // Close sidebar on overlay click
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-100 relative overflow-x-hidden">
      
      {/* Overlay Backdrop - only on small screens when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - fixed on small screens, relative on large */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} isSidebarOpen={isOpen} />
        <main className="p-4 md:p-6 flex-grow">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;