import React, { useState, useEffect, useRef } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('mangelanzeige')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message && !file) return

    const userText = message || (file ? file.name : '')
    setHistory((prev) => [...prev, { sender: 'user', text: userText }])

    setLoading(true)
    try {
      let res
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', category)
        res = await fetch(`${apiBase}/upload`, {
          method: 'POST',
          body: formData,
        })
      } else {
        const params = new URLSearchParams()
        params.append('message', message)
        params.append('category', category)
        res = await fetch(`${apiBase}/prompt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        })
      }

      const data = await res.json()
      setHistory((prev) => [
        ...prev,
        { sender: 'gpt', text: data.generated, rawText: data.text },
      ])
    } catch (err) {
      setHistory((prev) => [...prev, { sender: 'gpt', text: 'Fehler: ' + err.message }])
    } finally {
      setLoading(false)
      setMessage('')
      setFile(null)
    }
  }

  return (
    <div
      className="flex flex-col h-screen bg-gray-100"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg shadow whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.text}
              {msg.rawText && (
                <pre className="mt-2 p-2 text-xs bg-gray-50 rounded">{msg.rawText}</pre>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-100 text-gray-900 p-3 rounded-lg">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>Antwort wird generiert...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {file && (
        <div className="p-2 border-t bg-white text-sm text-gray-700">Datei ausgewählt: {file.name}</div>
      )}

      <form onSubmit={handleSubmit} className="p-4 flex gap-2 items-end border-t bg-white">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2"
        >
          <option value="mangelanzeige">mangelanzeige</option>
          <option value="nachtrag">nachtrag</option>
          <option value="bautagebuch">bautagebuch</option>
          <option value="vob_pruefen">vob_pruefen</option>
          <option value="email_korrektur">email_korrektur</option>
          <option value="sige">sige</option>
        </select>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded p-2"
          rows={2}
          placeholder="Nachricht"
        />
        <label className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded cursor-pointer">
          <span className="text-xl">+</span>
          <input
            type="file"
            accept=".pdf,.docx,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Senden
        </button>
      </form>
    </div>
  )
}

export default App
