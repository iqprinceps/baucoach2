import React, { useState, useEffect, useRef } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('mangelanzeige')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

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
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message && !file) return

    // Anzeige der Nutzereingabe
    const userText = message || (file ? file.name : '')
    setMessages((prev) => [...prev, { sender: 'user', text: userText }])

    const formData = new FormData()
    let url = 'http://localhost:8000/prompt'

    if (file) {
      formData.append('file', file)
      formData.append('category', category)
      url = 'http://localhost:8000/upload'
    } else {
      formData.append('message', message)
      formData.append('category', category)
    }

    setLoading(true)
    setMessage('')
    setFile(null)

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          sender: 'gpt',
          text: data.generated,
          rawText: data.text,
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'gpt', text: 'Fehler: ' + err.message },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg shadow whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {msg.text}
              {msg.rawText && (
                <pre className="mt-2 p-2 text-xs bg-gray-100 rounded">
                  {msg.rawText}
                </pre>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {preview && (
        <div className="p-4 border-t">
          {file?.type.startsWith('image/') ? (
            <img src={preview} alt="preview" className="max-h-40 mx-auto" />
          ) : file?.type === 'application/pdf' ? (
            <embed src={preview} className="w-full h-40" type="application/pdf" />
          ) : (
            <p className="text-center">{file.name}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 flex space-x-2 border-t">
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
