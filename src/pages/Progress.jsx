import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { Card, Label } from '../components/ui'
import { formatDay } from '../lib/rpg'

export default function Progress({ stats, logs }) {
  const [tab, setTab] = useState('charts')

  const radar = stats.map((s) => ({ stat: s.name, value: s.level }))
  const bars = [...stats].sort((a, b) => b.level - a.level)
  const timeline = [...logs]
    .filter((l) => l.day_date)
    .sort((a, b) => a.day_date.localeCompare(b.day_date))
    .slice(-21)
    .map((l) => ({ day: l.day_date.slice(5), xp: Number(l.global_xp) || 0 }))

  const journal = logs.filter((l) => l.note && l.note.trim())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[['charts', '📈 Графіки'], ['journal', '📔 Щоденник']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: tab === k ? '#1A1A2E' : '#12121A',
            border: `1px solid ${tab === k ? '#7C5CFC' : '#1E1E2E'}`,
            borderRadius: 8, padding: '7px 13px',
            color: tab === k ? '#7C5CFC' : '#6B7280', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>{l}</button>
        ))}
      </div>

      {tab === 'charts' && (
        <>
          <Card style={{ padding: 16 }}>
            <Label>Radar Overview</Label>
            <ResponsiveContainer width="100%" height={270}>
              <RadarChart data={radar}>
                <PolarGrid stroke="#1E1E2E" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: '#6B7280', fontSize: 9 }} />
                <Radar dataKey="value" stroke="#7C5CFC" fill="#7C5CFC" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card style={{ padding: 16 }}>
            <Label>Рейтинг характеристик</Label>
            {bars.map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                <div style={{ color: '#9CA3AF', fontSize: 11, width: 85, flexShrink: 0 }}>{s.name}</div>
                <div style={{ flex: 1, background: '#1E1E2E', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${s.level}%`, height: '100%', background: s.color, borderRadius: 4 }} />
                </div>
                <div style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, width: 24, textAlign: 'right' }}>{s.level}</div>
              </div>
            ))}
          </Card>

          {timeline.length > 1 && (
            <Card style={{ padding: 16 }}>
              <Label>XP по днях</Label>
              <ResponsiveContainer width="100%" height={175}>
                <LineChart data={timeline}>
                  <CartesianGrid stroke="#1E1E2E" strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="xp" stroke="#7C5CFC" strokeWidth={2} dot={{ fill: '#7C5CFC', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}

      {tab === 'journal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {journal.length === 0 && (
            <div style={{ textAlign: 'center', color: '#374151', padding: 40, fontSize: 13 }}>
              Тут з'являться твої нотатки з днів
            </div>
          )}
          {journal.map((l) => (
            <Card key={l.id || l.day_date} style={{ padding: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ color: '#7C5CFC', fontSize: 12, fontWeight: 600 }}>{formatDay(l.day_date)}</span>
                <span style={{ color: (Number(l.global_xp) || 0) >= 0 ? '#22C55E' : '#EF4444', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                  {(Number(l.global_xp) || 0) >= 0 ? '+' : ''}{l.global_xp} XP
                </span>
              </div>
              <div style={{ color: '#D1D5DB', fontSize: 13, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{l.note}</div>
              {l.actions?.length > 0 && (
                <div style={{ color: '#4B5563', fontSize: 10, marginTop: 8, paddingTop: 8, borderTop: '1px solid #1E1E2E' }}>
                  {l.actions.join(' · ')}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
