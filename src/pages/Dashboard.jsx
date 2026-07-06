import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { XPBar, Card, Label } from '../components/ui'
import { getRank, levelColor, xpForSubLevel, xpForGlobalLevel } from '../lib/rpg'

export default function Dashboard({ stats, profile }) {
  if (!stats.length) return <Empty />

  const totalAvg = Math.round(stats.reduce((a, s) => a + s.level, 0) / stats.length)
  const radarData = stats.slice(0, 8).map((s) => ({ stat: s.name, value: s.level }))
  const globalNext = xpForGlobalLevel(profile.global_level)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'linear-gradient(135deg, #0F0F1A 0%, #1A0F2E 100%)', border: '1px solid #2D1B69', borderRadius: 16, padding: 22 }}>
        <div style={{ color: '#9D8AFF', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Character Profile</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#E2E8F0', fontSize: 26, fontWeight: 700, marginTop: 6 }}>Персонаж</div>

        <div style={{ marginTop: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[['Lv.' + profile.global_level, 'Global Level', '#7C5CFC'], [profile.global_xp, 'Global XP', '#00D4FF'], [totalAvg, 'Avg Stat', levelColor(totalAvg)]].map(([v, l, c]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ color: c, fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700 }}>{v}</div>
              <div style={{ color: '#4B5563', fontSize: 10 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, maxWidth: 280 }}>
          <XPBar current={profile.global_xp} total={globalNext} color="#7C5CFC" height={5} />
          <div style={{ color: '#4B5563', fontSize: 10, marginTop: 4 }}>{profile.global_xp} / {globalNext} → Lv.{profile.global_level + 1}</div>
        </div>

        <div style={{ height: 200, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#2D1B69" />
              <PolarAngleAxis dataKey="stat" tick={{ fill: '#9D8AFF', fontSize: 9 }} />
              <Radar dataKey="value" stroke="#7C5CFC" fill="#7C5CFC" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <Label>Character Stats</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
          {stats.map((s) => (
            <Card key={s.id} style={{ padding: '12px 14px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>{s.icon}</span>
                  <span style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 600 }}>{s.name.toUpperCase()}</span>
                </div>
                <span style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 18 }}>{s.level}</span>
              </div>
              <XPBar current={s.xp} total={xpForSubLevel(s.level)} color={s.color} height={3} />
              <div style={{ color: '#374151', fontSize: 9, marginTop: 4 }}>{getRank(s.level)}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function Empty() {
  return <div style={{ textAlign: 'center', color: '#374151', padding: 60 }}>Завантаження персонажа...</div>
}
