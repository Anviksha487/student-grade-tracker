import { Link, useNavigate } from 'react-router-dom'

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate()
  const name = localStorage.getItem('name')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">🎓 Grade Tracker</Link>
        <div className="flex gap-6 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl">
            {darkMode ? '☀️' : '🌙'}
          </button>
          {name ? (
            <>
              <span className="text-sm">👋 {name}</span>
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/add" className="hover:underline">Add Student</Link>
              <Link to="/leaderboard" className="hover:underline">🏆 Leaderboard</Link>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 text-sm font-semibold">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar