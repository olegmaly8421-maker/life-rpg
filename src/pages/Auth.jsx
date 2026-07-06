import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Card, Btn, Input } from '../components/ui'

export default function Auth() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode]         = useState('signin') // signin | signup
  const [loading, setLoading]   = useState(false)
  const [msg, setMsg]           = useState(null)

  const submit = async () => {
    if (!email || !password) { setMsg('Введи email і пароль'); return }
    setLoading(true)
    setMsg(null)

    const fn = mode === 'signin'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password })

    const { error } = await fn
    if (error) setMsg(error.message)
    else if (mode === 'signup') setMsg('Акаунт створено! Тепер увійди.')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Card style={{ width: '100%', maxWidth: 380, padding: 28 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#7C5CFC', fontSize: 28, fontWeight: 800 }}>⬡ LIFE RPG</div>
          <div style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>
            {mode === 'signin' ? 'Увійди у свій акаунт' : 'Створи новий акаунт'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Пароль (мін. 6 символів)" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()} />

          <Btn onClick={submit} disabled={loading} style={{ marginTop: 6, opacity: loading ? 0.6 : 1 }}>
            {loading ? '...' : mode === 'signin' ? 'Увійти' : 'Зареєструватись'}
          </Btn>
        </div>

        {msg && <div style={{ color: msg.includes('створено') ? '#22C55E' : '#EF4444', fontSize: 12, marginTop: 12, textAlign: 'center' }}>{msg}</div>}

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMsg(null) }}
            style={{ background: 'none', border: 'none', color: '#7C5CFC', fontSize: 12, cursor: 'pointer' }}>
            {mode === 'signin' ? 'Немає акаунту? Створити' : 'Вже є акаунт? Увійти'}
          </button>
        </div>
      </Card>
    </div>
  )
}
