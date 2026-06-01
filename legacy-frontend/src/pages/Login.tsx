import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

console.log('📝 Login.tsx mounted')

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">Connexion Cité Concorde</h2>
        {error && <p className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">{error}</p>}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="mb-3 w-full rounded border p-3" 
          required 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="mb-4 w-full rounded border p-3" 
          required 
        />
        <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}