import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useGameData } from './lib/useGameData'
import { xpForLevel } from './lib/rpg'
import { XPBar } from './components/ui'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CalendarPage from './pages/Calendar'
import Stats from './pages/Stats'
import Progress from './pages/Progress'
import Quests from './pages/Quests'
import Editor from './pages/Editor'

const NAV = [
  ['dashboard', 'Дім',      '⊞'],
  ['calendar',  'Календар', '📅'],
  ['stats',     'Стати',    '📊'],
  ['progress',  'Прогрес',  '📈'],
  ['quests',    'Квести',   '🗺️'],
  ['editor',    'Редактор', '⚙️'],
]

export default function App() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!ready) return <Splash />
  if (!session) return <Auth />
  return <Game userId={session.user.id} />
}

function Game({ userId }) {
  const g = useGameData(userId)
  const [page, setPage] = useState('dashboard')

  if (g.loading) return <Splash text="Синхронізація з хмарою..." />

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 72 }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 40, background: '#080810',
        borderBottom: '1px solid #0F0F1E', padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#7C5CFC', fontWeight: 800, fontSize: 15 }}>⬡ LIFE RPG</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#7C5CFC', fontSize: 12, fontWeight: 700 }}>Lv.{g.profile.global_level}</span>
          <div style={{ width: 48 }}>
            <XPBar current={g.profile.global_xp} total={xpForLevel(g.profile.global_level, g.curves.global)} color="#7C5CFC" height={3} />
          </div>
          <button onClick={() => supabase.auth.signOut()} style={{
            background: 'none', border: '1px solid #1E1E2E', borderRadius: 6,
            padding: '4px 9px', color: '#4B5563', fontSize: 11, cursor: 'pointer',
          }}>Вихід</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '18px 14px' }}>
        {page === 'dashboard' && <Dashboard {...g} onGoCalendar={() => setPage('calendar')} />}
        {page === 'calendar'  && <CalendarPage logs={g.logs} actions={g.actions} streaks={g.streaks} saveDay={g.saveDay} deleteDay={g.deleteDay} />}
        {page === 'stats'     && <Stats stats={g.stats} curves={g.curves} logs={g.logs} />}
        {page === 'progress'  && <Progress stats={g.stats} logs={g.logs} />}
        {page === 'quests'    && <Quests quests={g.quests} updateQuest={g.updateQuest} />}
        {page === 'editor'    && <Editor {...g} />}
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: '#0A0A12', borderTop: '1px solid #1E1E2E',
        display: 'flex', justifyContent: 'space-around',
        padding: '7px 2px', paddingBottom: 'max(7px, env(safe-area-inset-bottom))',
      }}>
        {NAV.map(([id, label, icon]) => (
          <button key={id} onClick={() => setPage(id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '4px 6px', color: page === id ? '#7C5CFC' : '#4B5563', flex: 1,
          }}>
            <span style={{ fontSize: 17 }}>{icon}</span>
            <span style={{ fontSize: 9, fontWeight: page === id ? 600 : 400 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Splash({ text = 'Завантаження...' }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#7C5CFC', fontSize: 26, fontWeight: 800 }}>⬡ LIFE RPG</div>
      <div style={{ color: '#4B5563', fontSize: 13 }}>{text}</div>
    </div>
  )
}
