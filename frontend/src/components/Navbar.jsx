import { Link, useNavigate } from 'react-router-dom'
import '../styles/navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <h2>Recipe Book AI</h2>
      <div className="nav-links">
        <span className="nav-name">Hi, {name}</span>
        <Link to="/dashboard">Home</Link>
        <Link to="/saved">Saved Recipes</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar