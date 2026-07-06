import { useState } from 'react'
import { XPBar, Card, Label } from '../components/ui'
import { getRank, levelColor, xpForSubLevel } from '../lib/rpg'

export default function Stats({ stats }) {
  const [sel, setSel] = useState(null)
  const stat = stats.find((s) => s.id === sel)

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 200px', minWidth: 180, maxWidth: 240, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label>Характеристики</Label>
        {stats.map((s) => (
          <button key={s.id} onClick={() => setSel(s.id)} style={{
            background: sel === s.id ? '#1A1A2E' : '#12121A', border: `1px solid ${sel === s.id ? s.color : '#1E1E2E'}`,
            borderRadius: 9, padding: '9px 12px', cursor: 'pointer', textAlign: 'left',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: '#D1D5DB', fontSize: 12 }}>{s.icon} {s.name}</span>
            <span style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14 }}>{s.level}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: '2 1 300px' }}>
        {!stat ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#374151' }}>← Обери характеристику</div>
        ) : (
          <Card style={{ border: `1px solid ${stat.color}44`, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #1E1E2E' }}>
              <span style={{ fontSize: 30 }}>{stat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#E2E8F0', fontSize: 20, fontWeight: 700 }}>{stat.name}</div>
                <div style={{ color: stat.color, fontSize: 12 }}>{getRank(stat.level)} · Level {stat.level}</div>
              </div>
              <div style={{ color: stat.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 34, fontWeight: 700 }}>{stat.level}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stat.substats.map((sub) => {
                const col = sub.is_potential ? '#7C5CFC' : levelColor(sub.level)
                return (
                  <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ color: sub.is_potential ? '#7C5CFC' : '#9CA3AF', fontSize: 12, width: 170, flexShrink: 0, fontStyle: sub.is_potential ? 'italic' : 'normal' }}>{sub.name}</div>
                    <div style={{ flex: 1 }}><XPBar current={sub.level} total={100} color={col} height={5} /></div>
                    <div style={{ color: col, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, width: 26, textAlign: 'right' }}>{sub.level}</div>
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
