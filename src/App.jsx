import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useGameData } from './lib/useGameData'
import { xpForGlobalLevel } from './lib/rpg'
import { XPBar } from './components/ui'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import DailyLog from './pages/DailyLog'
import Progress from './pages/Progress'
import Quests from './pages/Quests'
import Editor from './pages/Editor'

const NAV = [
  ['dashboard', 'Дім', '⊞'],
  ['stats', 'Стати', '📊'],
  ['daily', 'Лог', '📝'],
  ['progress', 'Прогрес', '📈'],
  ['quests', 'Квести', '🗺️'],
  ['editor', 'Редактор', '⚙️'],
]

export default function App() {
  const [session, setSession] = useState(null)
  const [ready, setReady]     = useState(false)
  const [page, setPage]       = useState('dashboard')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!ready) return <Splash />
  if (!session) return <Auth />
  return <Game userId={session.user.id} email={session.user.email} page={page} setPage={setPage} />
}

function Game({ userId, email, page, setPage }) {
  const g = useGameData(userId)

  if (g.loading) return <Splash text="Синхронізація з хмарою..." />

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 70 }}>
      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: '#080810', borderBottom: '1px solid #0F0F1E', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#7C5CFC', fontWeight: 800, fontSize: 15 }}>⬡ LIFE RPG</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#7C5CFC', fontSize: 12, fontWeight: 700 }}>Lv.{g.profile.global_level}</span>
            <div style={{ width: 50 }}><XPBar current={g.profile.global_xp} total={xpForGlobalLevel(g.profile.global_level)} color="#7C5CFC" height={3} /></div>
          </div>
          <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: '1px solid #1E1E2E', borderRadius: 6, padding: '4px 10px', color: '#4B5563', fontSize: 11, cursor: 'pointer' }}>Вихід</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px' }}>
        {page === 'dashboard' && <Dashboard stats={g.stats} profile={g.profile} />}
        {page === 'stats'     && <Stats stats={g.stats} />}
        {page === 'daily'     && <DailyLog actions={g.actions} logs={g.logs} submitDayLog={g.submitDayLog} />}
        {page === 'progress'  && <Progress stats={g.stats} logs={g.logs} />}
        {page === 'quests'    && <Quests quests={g.quests} updateQuest={g.updateQuest} />}
        {page === 'editor'    && <Editor {...g} />}
      </div>

      {/* Bottom nav (mobile-first) */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: '#0A0A12', borderTop: '1px solid #1E1E2E', display: 'flex', justifyContent: 'space-around', padding: '8px 4px', paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {NAV.map(([id, label, icon]) => (
          <button key={id} onClick={() => setPage(id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 8px',
            color: page === id ? '#7C5CFC' : '#4B5563', flex: 1,
          }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 9, fontWeight: page === id ? 600 : 400 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Splash({ text = 'Завантаження...' }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#7C5CFC', fontSize: 28, fontWeight: 800 }}>⬡ LIFE RPG</div>
      <div style={{ color: '#4B5563', fontSize: 13 }}>{text}</div>
    </div>
  )
}
