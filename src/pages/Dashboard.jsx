import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { XPBar, Card, Label, Btn } from '../components/ui'
import { getRank, levelColor, xpForLevel, statTrend, trendArrow, trendColor, missedDays, todayKey } from '../lib/rpg'

export default function Dashboard({ stats, profile, logs, curves, streaks, actions, onGoCalendar }) {
  if (!stats.length) return <div style={{ textAlign: 'center', color: '#374151', padding: 60 }}>Завантаження...</div>

  const avg = Math.round(stats.reduce((a, s) => a + s.level, 0) / stats.length)
  const radar = stats.slice(0, 8).map((s) => ({ stat: s.name, value: s.level }))
  const globalNext = xpForLevel(profile.global_level, curves.global)
  const missed = missedDays(logs)
  const todayLogged = logs.some((l) => l.day_date === todayKey())

  const topStreaks = actions
    .filter((a) => a.track_streak && (streaks[a.id]?.current || 0) > 0)
    .map((a) => ({ label: a.label, n: streaks[a.id].current }))
    .sort((x, y) => y.n - x.n)
    .slice(0, 4)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Банер пропущених днів */}
      {missed > 0 && (
        <Card style={{ background: '#2A1A0D', border: '1px solid #F9731644', padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 22 }}>📭</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#F97316', fontWeight: 700, fontSize: 14 }}>
                {missed === 1 ? 'Вчорашній день не записаний' : `${missed} днів поспіль без запису`}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>
                Можна заповнити заднім числом у календарі
              </div>
            </div>
            <Btn onClick={onGoCalendar} style={{ fontSize: 12 }}>Заповнити</Btn>
          </div>
        </Card>
      )}

      {!todayLogged && missed === 0 && (
        <Card style={{ background: '#0F1A2E', border: '1px solid #7C5CFC44', padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📝</span>
            <span style={{ color: '#9CA3AF', fontSize: 13, flex: 1 }}>Сьогоднішній день ще не записаний</span>
            <Btn onClick={onGoCalendar} style={{ fontSize: 12 }}>Записати</Btn>
          </div>
        </Card>
      )}

      {/* Профіль */}
      <div style={{ background: 'linear-gradient(135deg, #0F0F1A 0%, #1A0F2E 100%)', border: '1px solid #2D1B69', borderRadius: 16, padding: 20 }}>
        <div style={{ color: '#9D8AFF', fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>Character</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#E2E8F0', fontSize: 24, fontWeight: 700, marginTop: 4 }}>Персонаж</div>

        <div style={{ marginTop: 14, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {[
            ['Lv.' + profile.global_level, 'Global', '#7C5CFC'],
            [profile.global_xp, 'XP', '#00D4FF'],
            [avg, 'Avg', levelColor(avg)],
          ].map(([v, l, c]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ color: c, fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700 }}>{v}</div>
              <div style={{ color: '#4B5563', fontSize: 9 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, maxWidth: 280 }}>
          <XPBar current={profile.global_xp} total={globalNext} color="#7C5CFC" height={5} />
          <div style={{ color: '#4B5563', fontSize: 10, marginTop: 3 }}>{profile.global_xp} / {globalNext}</div>
        </div>

        {topStreaks.length > 0 && (
          <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {topStreaks.map((s) => (
              <span key={s.label} style={{ background: '#2A1A0D', border: '1px solid #F9731644', borderRadius: 6, padding: '4px 9px', fontSize: 11, color: '#F97316' }}>
                🔥 {s.n} · {s.label.replace(/^\S+\s/, '')}
              </span>
            ))}
          </div>
        )}

        <div style={{ height: 190, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radar}>
              <PolarGrid stroke="#2D1B69" />
              <PolarAngleAxis dataKey="stat" tick={{ fill: '#9D8AFF', fontSize: 9 }} />
              <Radar dataKey="value" stroke="#7C5CFC" fill="#7C5CFC" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Стати з трендами */}
      <div>
        <Label>Характеристики · тренд за 7 / 30 днів</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 9 }}>
          {stats.map((s) => {
            const t7 = statTrend(logs, s.key, 7)
            const t30 = statTrend(logs, s.key, 30)
            return (
              <Card key={s.id} style={{ padding: '11px 13px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.color }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 600 }}>{s.icon} {s.name.toUpperCase()}</span>
                  <span style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 17 }}>{s.level}</span>
                </div>
                <XPBar current={s.xp || 0} total={xpForLevel(s.level, curves.substat)} color={s.color} height={3} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, alignItems: 'center' }}>
                  <span style={{ color: '#374151', fontSize: 9 }}>{getRank(s.level)}</span>
                  <span style={{ display: 'flex', gap: 6, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ color: trendColor(t7.dir) }} title="7 днів">
                      {trendArrow(t7.dir)}{t7.delta !== 0 ? Math.abs(t7.delta) : ''}
                    </span>
                    <span style={{ color: trendColor(t30.dir), opacity: 0.6 }} title="30 днів">
                      {trendArrow(t30.dir)}
                    </span>
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
