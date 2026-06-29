import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api/students'

function Home({ darkMode }) {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterSection, setFilterSection] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const res = await axios.get(API)
    setStudents(res.data)
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`)
    fetchStudents()
  }

  const getPercentage = (subjects) => {
    if (!subjects.length) return 0
    const total = subjects.reduce((a, b) => a + Number(b.totalMarks), 0)
    const marks = subjects.reduce((a, b) => a + Number(b.marks), 0)
    return ((marks / total) * 100).toFixed(2)
  }

  const getStats = () => {
    const total = students.length
    const passed = students.filter(s => getPercentage(s.subjects) >= 50).length
    const failed = total - passed
    const avgPercentage = total === 0 ? 0 :
      (students.reduce((a, s) => a + parseFloat(getPercentage(s.subjects)), 0) / total).toFixed(2)
    return { total, passed, failed, avgPercentage }
  }

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase())
    const matchClass = filterClass ? s.class === filterClass : true
    const matchSection = filterSection ? s.section === filterSection : true
    return matchSearch && matchClass && matchSection
  })

  return (
    <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>

      {/* Dashboard */}
      {students.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500 text-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{getStats().total}</p>
            <p className="text-sm">Total</p>
          </div>
          <div className="bg-green-500 text-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{getStats().passed}</p>
            <p className="text-sm">Passed</p>
          </div>
          <div className="bg-red-500 text-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{getStats().failed}</p>
            <p className="text-sm">Failed</p>
          </div>
          <div className="bg-purple-500 text-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{getStats().avgPercentage}%</p>
            <p className="text-sm">Average</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <input
          className={`border rounded p-2 ${darkMode ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400' : ''}`}
          placeholder="Search by name or roll number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className={`border rounded p-2 ${darkMode ? 'bg-gray-800 text-white border-gray-600' : ''}`}
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}>
          <option value="">All Classes</option>
          {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => (
            <option key={c} value={c}>Class {c}</option>
          ))}
        </select>
        <select
          className={`border rounded p-2 ${darkMode ? 'bg-gray-800 text-white border-gray-600' : ''}`}
          value={filterSection}
          onChange={e => setFilterSection(e.target.value)}>
          <option value="">All Sections</option>
          {['A','B','C','D','E'].map(s => (
            <option key={s} value={s}>Section {s}</option>
          ))}
        </select>
      </div>

      {/* Students List */}
      <h2 className="text-xl font-semibold mb-4">
        Students List
        {(filterClass || filterSection) && (
          <span className="text-sm font-normal text-blue-500 ml-2">
            {filterClass ? `Class ${filterClass}` : ''} {filterSection ? `Section ${filterSection}` : ''}
          </span>
        )}
      </h2>

      {filtered.length === 0 && (
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No students found!</p>
      )}

      {filtered.map(student => (
        <div key={student._id}
          className={`rounded-xl shadow p-4 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{student.name}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Roll No: {student.rollNumber}
                {student.class && ` | Class ${student.class}`}
                {student.section && ` | Section ${student.section}`}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <p className="text-green-500 font-bold">{getPercentage(student.subjects)}%</p>
              <Link to={`/student/${student._id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                View
              </Link>
              <button onClick={() => handleDelete(student._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home