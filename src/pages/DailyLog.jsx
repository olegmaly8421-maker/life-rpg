import { useState } from 'react'
import { Card, Btn, Label } from '../components/ui'

export default function DailyLog({ actions, logs, submitDayLog }) {
  const [selected, setSelected] = useState([])
  const [note, setNote]         = useState('')
  const [flash, setFlash]       = useState(null)
  const [saving, setSaving]     = useState(false)

  const toggle = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
  const totalXP = actions.filter((a) => selected.includes(a.id)).reduce((s, a) => s + a.global_xp, 0)

  const pos = actions.filter((a) => a.is_positive)
  const neg = actions.filter((a) => !a.is_positive)

  const submit = async () => {
    if (!selected.length || saving) return
    setSaving(true)
    const chosen = actions.filter((a) => selected.includes(a.id))
    const res = await submitDayLog(chosen, note)
    setFlash(res)
    setSelected([])
    setNote('')
    setSaving(false)
    setTimeout(() => setFlash(null), 4000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {flash && (
        <Card style={{ background: '#0D2818', border: '1px solid #22C55E44' }}>
          <div style={{ color: '#22C55E', fontWeight: 700, fontSize: 14 }}>✓ День записано! Global XP: +{flash.globalXP}</div>
        </Card>
      )}

      <Card style={{ padding: 18 }}>
        <Label>✅ Позитивні дії</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {pos.map((a) => {
            const on = selected.includes(a.id)
            return (
              <button key={a.id} onClick={() => toggle(a.id)} style={{
                background: on ? '#1A2E1A' : '#0A0A0F', border: `1px solid ${on ? '#22C55E' : '#1E1E2E'}`,
                borderRadius: 8, padding: '6px 12px', color: on ? '#22C55E' : '#9CA3AF', cursor: 'pointer', fontSize: 12,
              }}>
                {a.label}{on && <span style={{ marginLeft: 5, color: '#7C5CFC', fontSize: 10 }}>+{a.global_xp}</span>}
              </button>
            )
          })}
          {pos.length === 0 && <span style={{ color: '#374151', fontSize: 12 }}>Ще немає дій. Додай у вкладці «Редактор».</span>}
        </div>

        {neg.length > 0 && <>
          <Label>❌ Дебафи / негатив</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {neg.map((a) => {
              const on = selected.includes(a.id)
              return (
                <button key={a.id} onClick={() => toggle(a.id)} style={{
                  background: on ? '#2E1A1A' : '#0A0A0F', border: `1px solid ${on ? '#EF4444' : '#1E1E2E'}`,
                  borderRadius: 8, padding: '6px 12px', color: on ? '#EF4444' : '#9CA3AF', cursor: 'pointer', fontSize: 12,
                }}>{a.label}</button>
              )
            })}
          </div>
        </>}

        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Нотатки про день..."
          style={{ width: '100%', marginTop: 16, background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: 9, padding: 11, color: '#D1D5DB', fontSize: 13, minHeight: 80, resize: 'vertical', outline: 'none' }} />

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ color: '#4B5563', fontSize: 12 }}>{selected.length} обрано · <span style={{ color: '#7C5CFC' }}>+{totalXP} XP</span></span>
          <Btn onClick={submit} disabled={!selected.length || saving} style={{ opacity: selected.length && !saving ? 1 : 0.5 }}>
            {saving ? 'Зберігаю...' : 'Зберегти день →'}
          </Btn>
        </div>
      </Card>

      {logs.length > 0 && (
        <div>
          <Label>Архів ({logs.length})</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {logs.slice(0, 10).map((log) => (
              <Card key={log.id} style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280', fontSize: 11 }}>{new Date(log.created_at).toLocaleString('uk-UA')}</span>
                  <span style={{ color: '#7C5CFC', fontSize: 12, fontWeight: 600 }}>+{log.global_xp} XP</span>
                </div>
                <div style={{ color: '#4B5563', fontSize: 11, marginTop: 3 }}>{(log.actions || []).join(' · ')}</div>
                {log.note && <div style={{ color: '#374151', fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>"{log.note}"</div>}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
