import { useState } from 'react'
import { XPBar, Card, Label } from '../components/ui'
import { getRank, levelColor, xpForLevel, statTrend, trendArrow, trendColor } from '../lib/rpg'

export default function Stats({ stats, curves, logs }) {
  const [sel, setSel] = useState(null)
  const stat = stats.find((s) => s.id === sel)

  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 180px', minWidth: 165, maxWidth: 230, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Label>Характеристики</Label>
        {stats.map((s) => {
          const t = statTrend(logs, s.key, 7)
          return (
            <button key={s.id} onClick={() => setSel(s.id)} style={{
              background: sel === s.id ? '#1A1A2E' : '#12121A',
              border: `1px solid ${sel === s.id ? s.color : '#1E1E2E'}`,
              borderRadius: 9, padding: '8px 11px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6,
            }}>
              <span style={{ color: '#D1D5DB', fontSize: 12 }}>{s.icon} {s.name}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: trendColor(t.dir), fontSize: 10 }}>{trendArrow(t.dir)}</span>
                <span style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14 }}>{s.level}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div style={{ flex: '2 1 280px' }}>
        {!stat ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: '#374151', fontSize: 13 }}>
            ← Обери характеристику
          </div>
        ) : (
          <Card style={{ border: `1px solid ${stat.color}44`, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #1E1E2E' }}>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#E2E8F0', fontSize: 19, fontWeight: 700 }}>{stat.name}</div>
                <div style={{ color: stat.color, fontSize: 12 }}>{getRank(stat.level)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: stat.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{stat.level}</div>
                <div style={{ color: '#4B5563', fontSize: 9, marginTop: 3 }}>
                  {stat.xp || 0} / {xpForLevel(stat.level, curves.substat)}
                </div>
              </div>
            </div>

            <XPBar current={stat.xp || 0} total={xpForLevel(stat.level, curves.substat)} color={stat.color} height={5} />

            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {stat.substats.map((sub) => {
                const col = sub.is_potential ? '#7C5CFC' : levelColor(sub.level)
                return (
                  <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                      color: sub.is_potential ? '#7C5CFC' : '#9CA3AF', fontSize: 11,
                      width: 150, flexShrink: 0, fontStyle: sub.is_potential ? 'italic' : 'normal',
                    }}>{sub.name}</div>
                    <div style={{ flex: 1 }}><XPBar current={sub.level} total={100} color={col} height={5} /></div>
                    <div style={{ color: col, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12, width: 24, textAlign: 'right' }}>{sub.level}</div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
