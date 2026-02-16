function NavbarTop({ toggleSidebar }) {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <button
        onClick={toggleSidebar}
        className="bg-gray-200 px-3 py-1 rounded"
      >
        ☰
      </button>

      <h2 className="text-lg font-semibold">Dashboard</h2>
    </div>
  );
}

export default NavbarTop;