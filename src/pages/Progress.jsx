import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Card, Label } from '../components/ui'

export default function Progress({ stats, logs }) {
  const radarData = stats.map((s) => ({ stat: s.name, value: s.level }))
  const barData = [...stats].sort((a, b) => b.level - a.level)
  const timeline = [...logs].reverse().slice(-14).map((l, i) => ({ day: `${i + 1}`, xp: l.global_xp }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card style={{ padding: 18 }}>
        <Label>Radar Overview</Label>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1E1E2E" />
            <PolarAngleAxis dataKey="stat" tick={{ fill: '#6B7280', fontSize: 10 }} />
            <Radar dataKey="value" stroke="#7C5CFC" fill="#7C5CFC" fillOpacity={0.15} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <Card style={{ padding: 18 }}>
        <Label>Рейтинг характеристик</Label>
        {barData.map((s) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ color: '#9CA3AF', fontSize: 11, width: 90, flexShrink: 0 }}>{s.name}</div>
            <div style={{ flex: 1, background: '#1E1E2E', borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${s.level}%`, height: '100%', background: s.color, borderRadius: 4 }} />
            </div>
            <div style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, width: 26, textAlign: 'right' }}>{s.level}</div>
          </div>
        ))}
      </Card>

      {timeline.length > 1 && (
        <Card style={{ padding: 18 }}>
          <Label>XP Per Day</Label>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={timeline}>
              <CartesianGrid stroke="#1E1E2E" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#12121A', border: '1px solid #1E1E2E', borderRadius: 8 }} />
              <Line type="monotone" dataKey="xp" stroke="#7C5CFC" strokeWidth={2} dot={{ fill: '#7C5CFC', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
