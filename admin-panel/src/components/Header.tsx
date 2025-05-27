const Header = () => {
    return (
      <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, Admin</span>
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
            Logout
          </button>
        </div>
      </header>
    )
  }
  
  export default Header
  