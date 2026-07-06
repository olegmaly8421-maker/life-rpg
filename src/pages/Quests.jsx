import { XPBar, Card, Label } from '../components/ui'

const TYPES = { daily: '📅 Daily', weekly: '📆 Weekly', longterm: '🏆 Long-term' }

export default function Quests({ quests, updateQuest }) {
  const toggleDone = (q) => updateQuest(q.id, { done: !q.done })
  const addProg = (q, d) => {
    const next = Math.min(q.total, Math.max(0, (q.progress || 0) + d))
    updateQuest(q.id, { progress: next, done: next >= q.total })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {Object.entries(TYPES).map(([type, label]) => {
        const items = quests.filter((q) => q.type === type)
        if (!items.length) return null
        return (
          <div key={type}>
            <Label>{label}</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((q) => (
                <Card key={q.id} style={{ background: q.done ? '#0D2818' : '#12121A', border: `1px solid ${q.done ? '#22C55E44' : '#1E1E2E'}`, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: q.done ? '#22C55E' : '#E2E8F0', fontWeight: 600, fontSize: 14 }}>{q.done ? '✓ ' : ''}{q.title}</div>
                      <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>{q.descr}</div>
                      {q.total != null && (
                        <div style={{ marginTop: 8 }}>
                          <XPBar current={q.progress || 0} total={q.total} color="#7C5CFC" height={4} />
                          <div style={{ color: '#4B5563', fontSize: 10, marginTop: 3 }}>{q.progress || 0} / {q.total}</div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ color: '#7C5CFC', fontSize: 12, fontWeight: 600 }}>+{q.xp}</span>
                      {q.total != null ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => addProg(q, -1)} style={btn}>−</button>
                          <button onClick={() => addProg(q, 1)} style={btn}>+</button>
                        </div>
                      ) : (
                        <button onClick={() => toggleDone(q)} style={{ ...btn, padding: '5px 12px', color: q.done ? '#22C55E' : '#9CA3AF', border: `1px solid ${q.done ? '#22C55E' : '#374151'}` }}>
                          {q.done ? 'Done' : 'Mark'}
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const btn = { background: '#1E1E2E', border: 'none', borderRadius: 5, padding: '3px 9px', color: '#9CA3AF', cursor: 'pointer', fontSize: 14 }
