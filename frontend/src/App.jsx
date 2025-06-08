import React, { useState, useEffect } from 'react'

function App() {
  const [category, setCategory] = useState('mangelanzeige')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generated, setGenerated] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(''), 5000)
    return () => clearTimeout(t)
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Bitte eine PDF-Datei hochladen.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)

    setLoading(true)
    setError('')
    setGenerated('')
    setText('')

    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Upload fehlgeschlagen')
      }

      const data = await res.json()
      setText(data.text)
      setGenerated(data.generated)
    } catch (err) {
      setError('Fehler: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Baucoach Upload</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="border rounded p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="mangelanzeige">mangelanzeige</option>
          <option value="nachtrag">nachtrag</option>
          <option value="bautagebuch">bautagebuch</option>
          <option value="vob_pruefen">vob_pruefen</option>
          <option value="email_korrektur">email_korrektur</option>
        </select>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Absenden
        </button>
      </form>
      {loading && <p className="mt-4">Verarbeite...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {generated && (
        <div className="mt-4">
          <h2 className="font-semibold">GPT-generierter Text</h2>
          <pre className="whitespace-pre-wrap">{generated}</pre>
        </div>
      )}
      {text && (
        <div className="mt-4">
          <h2 className="font-semibold">Extrahierter Rohtext</h2>
          <pre className="whitespace-pre-wrap">{text}</pre>
        </div>
      )}
    </div>
  )
}

export default App
