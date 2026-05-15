import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    navigate('/login')
  }

  const isLoggedIn = localStorage.getItem('access')

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold text-blue-400">📝 My Blog</h1>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar