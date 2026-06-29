import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api/assignments'
const STUDENTS_API = 'http://localhost:5000/api/students'

function Assignments({ darkMode }) {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const [student, setStudent] = useState(null)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchStudent()
    fetchAssignments()
  }, [])

  const fetchStudent = async () => {
    const res = await axios.get(`${STUDENTS_API}/${studentId}`)
    setStudent(res.data)
  }

  const fetchAssignments = async () => {
    const res = await axios.get(`${API}/${studentId}`)
    setAssignments(res.data)
  }

  const handleAdd = async () => {
    if (!title || !subject || !dueDate) return alert('Please fill all fields!')
    await axios.post(API, { studentId, title, subject, dueDate })
    setTitle('')
    setSubject('')
    setDueDate('')
    setShowForm(false)
    fetchAssignments()
  }

  const handleStatusChange = async (id, status) => {
    await axios.put(`${API}/${id}`, { status })
    fetchAssignments()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`)
    fetchAssignments()
  }

  const getStatusColor = (status) => {
    if (status === 'Submitted') return 'bg-blue-100 text-blue-600'
    if (status === 'Graded') return 'bg-green-100 text-green-600'
    return 'bg-yellow-100 text-yellow-600'
  }

  const getDueDateColor = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    if (due < today) return 'text-red-500'
    return 'text-green-500'
  }

  const pending = assignments.filter(a => a.status === 'Pending').length
  const submitted = assignments.filter(a => a.status === 'Submitted').length
  const graded = assignments.filter(a => a.status === 'Graded').length

  return (
    <div className={`max-w-3xl mx-auto p-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => navigate(-1)}
            className="text-blue-500 hover:underline text-sm mb-1 block">
            ← Back
          </button>
          <h2 className="text-2xl font-bold">
            📝 {student ? student.name : 'Loading...'}'s Assignments
          </h2>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-500 text-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{pending}</p>
          <p className="text-sm">Pending</p>
        </div>
        <div className="bg-blue-500 text-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{submitted}</p>
          <p className="text-sm">Submitted</p>
        </div>
        <div className="bg-green-500 text-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{graded}</p>
          <p className="text-sm">Graded</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className={`rounded-xl shadow p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="font-semibold mb-3">New Assignment</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              placeholder="Assignment Title"
              value={title}
              onChange={e => setTitle(e.target.value)} />
            <input
              className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              placeholder="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-sm text-gray-500">Due Date</label>
              <input
                type="date"
                className={`border rounded p-2 w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                value={dueDate}
                onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add Assignment
            </button>
            <button onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Assignments List */}
      {assignments.length === 0 && (
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          No assignments added yet!
        </p>
      )}

      {assignments.map(assignment => (
        <div key={assignment._id}
          className={`rounded-xl shadow p-4 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{assignment.title}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Subject: {assignment.subject}
              </p>
              <p className={`text-sm font-semibold ${getDueDateColor(assignment.dueDate)}`}>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(assignment.status)}`}>
                {assignment.status}
              </span>
              <select
                className={`border rounded p-1 text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                value={assignment.status}
                onChange={e => handleStatusChange(assignment._id, e.target.value)}>
                <option>Pending</option>
                <option>Submitted</option>
                <option>Graded</option>
              </select>
              <button onClick={() => handleDelete(assignment._id)}
                className="text-red-500 text-sm hover:underline">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Assignments