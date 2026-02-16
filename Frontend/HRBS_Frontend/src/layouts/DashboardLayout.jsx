import { useState } from "react";
import Sidebar from "../components/Sidebar";
import NavbarTop from "../components/NavbarTop";

function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} />

      <div className="flex-1 flex flex-col">
        <NavbarTop toggleSidebar={() => setIsOpen(!isOpen)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;