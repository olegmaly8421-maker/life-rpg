import { useState, useMemo } from 'react'
import { Card, Btn, Label } from '../components/ui'
import { monthGrid, todayKey, formatDay, toDayKey } from '../lib/rpg'

const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
const MONTHS = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень']

export default function Calendar({ logs, actions, streaks, saveDay, deleteDay }) {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [openDay, setOpenDay] = useState(null)

  const logByDay = useMemo(() => {
    const m = {}
    for (const l of logs) if (l.day_date) m[l.day_date] = l
    return m
  }, [logs])

  const weeks = monthGrid(year, month)
  const today = todayKey()

  const prev = () => { if (month === 0) { setMonth(11); setYear(year - 1) } else setMonth(month - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(year + 1) } else setMonth(month + 1) }

  const monthLogged = weeks.flat().filter((d) => d && logByDay[d]).length
  const monthXP = weeks.flat().reduce((s, d) => s + (d && logByDay[d] ? Number(logByDay[d].global_xp) || 0 : 0), 0)

  if (openDay) {
    return <DayEditor
      dayKey={openDay}
      log={logByDay[openDay]}
      actions={actions}
      onBack={() => setOpenDay(null)}
      saveDay={saveDay}
      deleteDay={deleteDay}
    />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card style={{ padding: 16 }}>
        {/* Навігація по місяцях */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={prev} style={navBtn}>‹</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#E2E8F0', fontSize: 17, fontWeight: 700 }}>
              {MONTHS[month]} {year}
            </div>
            <div style={{ color: '#4B5563', fontSize: 11, marginTop: 2 }}>
              {monthLogged} днів записано · {monthXP} XP
            </div>
          </div>
          <button onClick={next} style={navBtn}>›</button>
        </div>

        {/* Дні тижня */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
          {WD.map((w) => (
            <div key={w} style={{ textAlign: 'center', color: '#4B5563', fontSize: 10, fontWeight: 600 }}>{w}</div>
          ))}
        </div>

        {/* Сітка */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {week.map((d, di) => {
                if (!d) return <div key={di} />
                const log = logByDay[d]
                const isToday = d === today
                const isFuture = d > today
                const dayNum = Number(d.split('-')[2])
                const xp = log ? Number(log.global_xp) || 0 : 0

                let bg = '#0F0F16', border = '1px solid #16161F', color = '#4B5563'
                if (log) {
                  bg = xp >= 0 ? '#0D2818' : '#2A1414'
                  border = `1px solid ${xp >= 0 ? '#22C55E55' : '#EF444455'}`
                  color = xp >= 0 ? '#22C55E' : '#EF4444'
                } else if (!isFuture && d < today) {
                  bg = '#14141C'; border = '1px solid #1E1E2E'; color = '#374151'
                }
                if (isToday) border = '2px solid #7C5CFC'

                return (
                  <button key={di} onClick={() => !isFuture && setOpenDay(d)} disabled={isFuture}
                    style={{
                      aspectRatio: '1', background: bg, border, borderRadius: 8,
                      cursor: isFuture ? 'default' : 'pointer', opacity: isFuture ? 0.25 : 1,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 1, padding: 2, transition: 'transform 0.1s',
                    }}>
                    <span style={{ color: isToday ? '#7C5CFC' : color, fontSize: 13, fontWeight: isToday ? 700 : 500 }}>
                      {dayNum}
                    </span>
                    {log && (
                      <span style={{ color, fontSize: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                        {xp > 0 ? '+' : ''}{xp}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Легенда */}
        <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap', fontSize: 10, color: '#4B5563' }}>
          <span>🟩 записано</span>
          <span>⬛ пропущено</span>
          <span style={{ color: '#7C5CFC' }}>▢ сьогодні</span>
        </div>
      </Card>

      {/* Активні серії */}
      {Object.keys(streaks).length > 0 && (
        <div>
          <Label>🔥 Серії</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {actions.filter((a) => a.track_streak).map((a) => {
              const s = streaks[a.id] || { current: 0, best: 0 }
              const on = s.current > 0
              return (
                <div key={a.id} style={{
                  background: on ? '#1A1A2E' : '#0F0F16',
                  border: `1px solid ${on ? '#7C5CFC55' : '#1E1E2E'}`,
                  borderRadius: 8, padding: '7px 11px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 12, color: on ? '#E2E8F0' : '#4B5563' }}>{a.label}</span>
                  <span style={{
                    color: on ? '#F97316' : '#374151',
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14,
                  }}>
                    {s.current}
                  </span>
                  {s.best > s.current && (
                    <span style={{ color: '#374151', fontSize: 9 }}>рекорд {s.best}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── РЕДАКТОР ДНЯ ────────────────────────────────────────────────────────────────
function DayEditor({ dayKey, log, actions, onBack, saveDay, deleteDay }) {
  const [selected, setSelected] = useState(log?.action_ids || [])
  const [note, setNote] = useState(log?.note || '')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)

  const toggle = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])

  const chosen = actions.filter((a) => selected.includes(a.id))
  const previewXP = chosen.reduce((s, a) => s + (Number(a.global_xp) || 0), 0)

  const cats = {}
  for (const a of actions) {
    const c = a.category || (a.is_positive ? 'Інше' : 'Дебаф')
    ;(cats[c] ||= []).push(a)
  }

  const save = async () => {
    setSaving(true)
    const r = await saveDay(dayKey, selected, note)
    setResult(r)
    setSaving(false)
  }

  const remove = async () => {
    if (!confirm('Видалити запис за цей день?')) return
    setSaving(true)
    await deleteDay(dayKey)
    setSaving(false)
    onBack()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Btn variant="ghost" onClick={onBack}>← Календар</Btn>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#E2E8F0', fontSize: 15, fontWeight: 600 }}>{formatDay(dayKey)}</div>
          {dayKey === todayKey() && <div style={{ color: '#7C5CFC', fontSize: 11 }}>сьогодні</div>}
        </div>
        {log && <Btn variant="danger" onClick={remove}>Видалити</Btn>}
      </div>

      {result && (
        <Card style={{ background: '#0D2818', border: '1px solid #22C55E44' }}>
          <div style={{ color: '#22C55E', fontWeight: 700, fontSize: 14 }}>
            ✓ Збережено · Global XP {result.globalDelta >= 0 ? '+' : ''}{result.globalDelta}
          </div>
          {result.bonusNotes?.map((b, i) => (
            <div key={i} style={{ color: '#F97316', fontSize: 12, marginTop: 4 }}>{b}</div>
          ))}
        </Card>
      )}

      {Object.entries(cats).map(([cat, list]) => (
        <Card key={cat} style={{ padding: 14 }}>
          <Label>{cat}</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {list.map((a) => {
              const on = selected.includes(a.id)
              const neg = !a.is_positive
              return (
                <button key={a.id} onClick={() => toggle(a.id)} title={a.descr || ''}
                  style={{
                    background: on ? (neg ? '#2E1A1A' : '#1A2E1A') : '#0A0A0F',
                    border: `1px solid ${on ? (neg ? '#EF4444' : '#22C55E') : '#1E1E2E'}`,
                    borderRadius: 8, padding: '6px 11px',
                    color: on ? (neg ? '#EF4444' : '#22C55E') : '#9CA3AF',
                    cursor: 'pointer', fontSize: 12,
                  }}>
                  {a.label}
                  {a.track_streak && <span style={{ marginLeft: 4, fontSize: 9 }}>🔥</span>}
                  {on && <span style={{ marginLeft: 5, color: '#7C5CFC', fontSize: 10 }}>
                    {a.global_xp >= 0 ? '+' : ''}{a.global_xp}
                  </span>}
                </button>
              )
            })}
          </div>
        </Card>
      ))}

      <Card style={{ padding: 14 }}>
        <Label>Щоденник</Label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Як пройшов день? Що відчував, що помітив..."
          style={{
            width: '100%', background: '#0A0A0F', border: '1px solid #1E1E2E',
            borderRadius: 9, padding: 12, color: '#D1D5DB', fontSize: 13,
            minHeight: 110, resize: 'vertical', outline: 'none', lineHeight: 1.6,
          }} />
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ color: '#4B5563', fontSize: 12 }}>
          {selected.length} дій · <span style={{ color: previewXP >= 0 ? '#7C5CFC' : '#EF4444' }}>
            {previewXP >= 0 ? '+' : ''}{previewXP} XP
          </span>
        </span>
        <Btn onClick={save} disabled={saving}>{saving ? 'Зберігаю...' : 'Зберегти день'}</Btn>
      </div>
    </div>
  )
}

const navBtn = {
  background: '#1E1E2E', border: 'none', borderRadius: 8,
  width: 34, height: 34, color: '#9CA3AF', cursor: 'pointer', fontSize: 20, lineHeight: 1,
}
