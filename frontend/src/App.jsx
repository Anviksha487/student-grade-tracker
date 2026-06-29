import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AddStudent from './pages/AddStudent'
import StudentDetail from './pages/StudentDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Leaderboard from './pages/Leaderboard'
import Assignments from './pages/Assignments'
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark bg-gray-900 min-h-screen' : 'bg-gray-100 min-h-screen'}>
      <BrowserRouter>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/signup" element={<Signup darkMode={darkMode} />} />
          <Route path="/" element={
            <ProtectedRoute><Home darkMode={darkMode} /></ProtectedRoute>
          } />
          <Route path="/add" element={
            <ProtectedRoute><AddStudent darkMode={darkMode} /></ProtectedRoute>
          } />
          <Route path="/student/:id" element={
            <ProtectedRoute><StudentDetail darkMode={darkMode} /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute><Leaderboard darkMode={darkMode} /></ProtectedRoute>
          } />
          <Route path="/assignments/:studentId" element={
            <ProtectedRoute><Assignments darkMode={darkMode} /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App