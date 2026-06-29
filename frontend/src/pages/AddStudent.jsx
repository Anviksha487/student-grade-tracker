import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000/api/students'

function AddStudent({ darkMode }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [section, setSection] = useState('')
  const [subjects, setSubjects] = useState([{ name: '', marks: '', totalMarks: '' }])

  const addSubject = () => {
    setSubjects([...subjects, { name: '', marks: '', totalMarks: '' }])
  }

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index))
  }

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects]
    updated[index][field] = value
    setSubjects(updated)
  }

  const handleSubmit = async () => {
    if (!name || !rollNumber) return alert('Please enter name and roll number!')
    try {
      await axios.post(API, { name, rollNumber, class: studentClass, section, subjects })
      alert('Student added successfully!')
      navigate('/')
    } catch (err) {
      alert('Roll number already exists!')
    }
  }

  return (
    <div className={`max-w-2xl mx-auto p-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <h2 className="text-2xl font-bold mb-6">Add New Student</h2>

      <div className={`rounded-xl shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
            placeholder="Student Name"
            value={name}
            onChange={e => setName(e.target.value)} />
          <input
            className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
            placeholder="Roll Number"
            value={rollNumber}
            onChange={e => setRollNumber(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <select
            className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
            value={studentClass}
            onChange={e => setStudentClass(e.target.value)}>
            <option value="">Select Class</option>
            {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
          <select
            className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
            value={section}
            onChange={e => setSection(e.target.value)}>
            <option value="">Select Section</option>
            {['A','B','C','D','E'].map(s => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>
        </div>

        <h3 className="font-semibold mb-2">Subjects</h3>
        {subjects.map((sub, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input
              className={`border rounded p-2 flex-1 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              placeholder="Subject"
              value={sub.name}
              onChange={e => handleSubjectChange(i, 'name', e.target.value)} />
            <input
              className={`border rounded p-2 w-20 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              placeholder="Marks"
              value={sub.marks}
              onChange={e => handleSubjectChange(i, 'marks', e.target.value)} />
            <input
              className={`border rounded p-2 w-20 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              placeholder="Total"
              value={sub.totalMarks}
              onChange={e => handleSubjectChange(i, 'totalMarks', e.target.value)} />
            {i > 0 && (
              <button onClick={() => removeSubject(i)}
                className="text-red-500 font-bold text-lg">✕</button>
            )}
          </div>
        ))}

        <button onClick={addSubject}
          className="text-blue-500 text-sm mb-4 hover:underline">
          + Add Subject
        </button>

        <button onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded w-full hover:bg-blue-700">
          Add Student
        </button>
      </div>
    </div>
  )
}

export default AddStudent