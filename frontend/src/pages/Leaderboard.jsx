import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = 'https://student-grade-tracker-x0xb.onrender.com/api/students'

function Leaderboard({ darkMode }) {
  const [students, setStudents] = useState([])

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const res = await axios.get(API)
    setStudents(res.data)
  }

  const getPercentage = (subjects) => {
    if (!subjects.length) return 0
    const total = subjects.reduce((a, b) => a + Number(b.totalMarks), 0)
    const marks = subjects.reduce((a, b) => a + Number(b.marks), 0)
    return ((marks / total) * 100).toFixed(2)
  }

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B'
    if (percentage >= 60) return 'C'
    if (percentage >= 50) return 'D'
    return 'F'
  }

  const ranked = [...students]
    .sort((a, b) => getPercentage(b.subjects) - getPercentage(a.subjects))

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  return (
    <div className={`max-w-3xl mx-auto p-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <h2 className="text-2xl font-bold mb-2">🏆 Top Performers</h2>
      <p className={`mb-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Students ranked by overall percentage
      </p>

      {ranked.length === 0 && (
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          No students added yet!
        </p>
      )}

      {ranked.map((student, index) => (
        <div key={student._id}
          className={`rounded-xl shadow p-4 mb-4 flex items-center gap-4 
          ${darkMode ? 'bg-gray-800' : 'bg-white'}
          ${index === 0 ? 'border-2 border-yellow-400' : ''}
          ${index === 1 ? 'border-2 border-gray-400' : ''}
          ${index === 2 ? 'border-2 border-orange-400' : ''}
          `}>

          {/* Rank */}
          <div className="text-3xl font-bold w-12 text-center">
            {getMedal(index)}
          </div>

          {/* Student Info */}
          <div className="flex-1">
            <h3 className="font-bold text-lg">{student.name}</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Roll No: {student.rollNumber}
              {student.class && ` | Class ${student.class}`}
              {student.section && ` | Section ${student.section}`}
            </p>
          </div>

          {/* Percentage & Grade */}
          <div className="text-right">
            <p className="text-2xl font-bold text-green-500">
              {getPercentage(student.subjects)}%
            </p>
            <p className="text-blue-500 font-semibold">
              Grade: {getGrade(getPercentage(student.subjects))}
            </p>
          </div>

          {/* View Button */}
          <Link to={`/student/${student._id}`}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
            View
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Leaderboard