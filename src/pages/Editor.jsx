import { useState } from 'react'
import { Card, Btn, Input, Label } from '../components/ui'

const EMOJI = ['⚔️','⚡','😴','🧠','📚','🧘','🗣️','🧩','🎭','💰','🗺️','🧹','♂️','🩺','🔥','💪','🎯','🌟','🏆','❤️','🎨','🎸','🌍','⭐','🇬🇧','🇨🇿']
const COLORS = ['#EF4444','#F59E0B','#818CF8','#8B5CF6','#10B981','#EC4899','#06B6D4','#F97316','#EAB308','#84CC16','#0EA5E9','#A78BFA','#F43F5E','#34D399']

const TABS = [
  ['stats',   '📊 Стати'],
  ['actions', '⚡ Дії'],
  ['streaks', '🔥 Серії'],
  ['quests',  '🗺️ Квести'],
]

export default function Editor(g) {
  const [tab, setTab] = useState('stats')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: tab === k ? '#1A1A2E' : '#12121A',
            border: `1px solid ${tab === k ? '#7C5CFC' : '#1E1E2E'}`,
            borderRadius: 8, padding: '7px 13px',
            color: tab === k ? '#7C5CFC' : '#6B7280',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>{l}</button>
        ))}
      </div>
      {tab === 'stats'   && <StatsEditor {...g} />}
      {tab === 'actions' && <ActionsEditor {...g} />}
      {tab === 'streaks' && <StreaksEditor {...g} />}
      {tab === 'quests'  && <QuestsEditor {...g} />}
    </div>
  )
}

// ═══ СТАТИ ═══
function StatsEditor({ stats, addStat, updateStat, deleteStat, addSubstat, updateSubstat, deleteSubstat }) {
  const [open, setOpen] = useState(null)
  const [ns, setNs] = useState({ name: '', icon: '⭐', color: '#7C5CFC' })
  const [nsub, setNsub] = useState({ name: '', level: 20 })

  const create = async () => {
    if (!ns.name.trim()) return
    const key = ns.name.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_А-ЯІЇЄҐ]/gi, '').slice(0, 20) || 'STAT'
    await addStat({ key, name: ns.name, icon: ns.icon, color: ns.color })
    setNs({ name: '', icon: '⭐', color: '#7C5CFC' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Card style={{ padding: 14 }}>
        <Label>Нова характеристика</Label>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
          <Input placeholder="Назва" value={ns.name} onChange={(e) => setNs({ ...ns, name: e.target.value })} style={{ flex: '1 1 140px' }} />
          <select value={ns.icon} onChange={(e) => setNs({ ...ns, icon: e.target.value })} style={sel}>
            {EMOJI.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 3 }}>
            {COLORS.slice(0, 8).map((c) => (
              <button key={c} onClick={() => setNs({ ...ns, color: c })}
                style={{ width: 20, height: 20, borderRadius: 5, background: c, border: ns.color === c ? '2px solid #fff' : 'none', cursor: 'pointer' }} />
            ))}
          </div>
          <Btn onClick={create}>+ Додати</Btn>
        </div>
      </Card>

      {stats.map((s) => (
        <Card key={s.id} style={{ padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <select value={s.icon} onChange={(e) => updateStat(s.id, { icon: e.target.value })} style={{ ...sel, width: 55 }}>
              {EMOJI.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <Input value={s.name} onChange={(e) => updateStat(s.id, { name: e.target.value })} style={{ flex: '1 1 120px' }} />
            <span style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 16 }}>{s.level}</span>
            <Btn variant="ghost" onClick={() => setOpen(open === s.id ? null : s.id)} style={{ fontSize: 11, padding: '6px 10px' }}>
              {open === s.id ? '▲' : '▼'} {s.substats.length}
            </Btn>
            <Btn variant="danger" onClick={() => confirm(`Видалити «${s.name}»?`) && deleteStat(s.id)} style={{ padding: '6px 10px' }}>✕</Btn>
          </div>

          {open === s.id && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1E1E2E', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {s.substats.map((sub) => (
                <div key={sub.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Input value={sub.name} onChange={(e) => updateSubstat(s.id, sub.id, { name: e.target.value })} style={{ flex: 1 }} />
                  <Input type="number" value={sub.level} onChange={(e) => updateSubstat(s.id, sub.id, { level: parseInt(e.target.value) || 0 })} style={{ width: 62 }} />
                  <Btn variant="danger" onClick={() => deleteSubstat(s.id, sub.id)} style={{ padding: '6px 9px' }}>✕</Btn>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6 }}>
                <Input placeholder="Новий підпункт" value={nsub.name} onChange={(e) => setNsub({ ...nsub, name: e.target.value })} style={{ flex: 1 }} />
                <Input type="number" value={nsub.level} onChange={(e) => setNsub({ ...nsub, level: parseInt(e.target.value) || 0 })} style={{ width: 62 }} />
                <Btn onClick={() => {
                  if (!nsub.name.trim()) return
                  const key = nsub.name.toLowerCase().replace(/\s+/g, '_').slice(0, 30)
                  addSubstat(s.id, { key, name: nsub.name, level: nsub.level })
                  setNsub({ name: '', level: 20 })
                }}>+</Btn>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

// ═══ ДІЇ ═══
const EMPTY_ACTION = { label: '', descr: '', category: '', is_positive: true, global_xp: 10, stat_xp: {}, track_streak: false }

function ActionsEditor({ actions, stats, addAction, updateAction, deleteAction }) {
  const [draft, setDraft] = useState(EMPTY_ACTION)
  const [editing, setEditing] = useState(null)

  const create = async () => {
    if (!draft.label.trim()) return
    await addAction(draft)
    setDraft(EMPTY_ACTION)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Card style={{ padding: 14 }}>
        <Label>Нова дія</Label>
        <ActionForm value={draft} onChange={setDraft} stats={stats} />
        <Btn onClick={create} style={{ marginTop: 10 }}>+ Створити</Btn>
      </Card>

      {actions.map((a) => (
        <Card key={a.id} style={{ padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>{a.is_positive ? '✅' : '❌'}</span>
            <Input value={a.label} onChange={(e) => updateAction(a.id, { label: e.target.value })} style={{ flex: '1 1 140px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#6B7280', fontSize: 10 }}>global</span>
              <Input type="number" value={a.global_xp} onChange={(e) => updateAction(a.id, { global_xp: parseInt(e.target.value) || 0 })} style={{ width: 62 }} />
            </div>
            <Btn variant="ghost" onClick={() => setEditing(editing === a.id ? null : a.id)} style={{ fontSize: 11, padding: '6px 10px' }}>
              {editing === a.id ? '▲' : '⚙'}
            </Btn>
            <Btn variant="danger" onClick={() => confirm('Видалити дію?') && deleteAction(a.id)} style={{ padding: '6px 9px' }}>✕</Btn>
          </div>

          <div style={{ color: '#4B5563', fontSize: 10, marginTop: 6 }}>
            {a.track_streak && <span style={{ color: '#F97316', marginRight: 6 }}>🔥 серія</span>}
            {a.category && <span style={{ marginRight: 6 }}>[{a.category}]</span>}
            {summarize(a.stat_xp)}
          </div>

          {editing === a.id && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #1E1E2E' }}>
              <ActionForm value={a} onChange={(f) => updateAction(a.id, f)} stats={stats} inline />
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

function ActionForm({ value, onChange, stats, inline }) {
  const set = (f) => onChange(inline ? f : { ...value, ...f })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {!inline && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          <Input placeholder="Назва (напр. 🎸 Гітара 30 хв)" value={value.label} onChange={(e) => set({ label: e.target.value })} style={{ flex: '1 1 180px' }} />
          <select value={value.is_positive ? 'p' : 'n'} onChange={(e) => set({ is_positive: e.target.value === 'p' })} style={sel}>
            <option value="p">✅ Позитивна</option>
            <option value="n">❌ Негатив</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: '#6B7280', fontSize: 11 }}>Global XP</span>
            <Input type="number" value={value.global_xp} onChange={(e) => set({ global_xp: parseInt(e.target.value) || 0 })} style={{ width: 64 }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        <Input placeholder="Категорія (Тіло, Сон...)" value={value.category || ''} onChange={(e) => set({ category: e.target.value })} style={{ flex: '1 1 130px' }} />
        <Input placeholder="Опис (необов'язково)" value={value.descr || ''} onChange={(e) => set({ descr: e.target.value })} style={{ flex: '2 1 180px' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={!!value.track_streak} onChange={(e) => set({ track_streak: e.target.checked })} />
          🔥 серія
        </label>
      </div>

      <XPMatrix stats={stats} statXp={value.stat_xp || {}} onChange={(stat_xp) => set({ stat_xp })} />
    </div>
  )
}

/** Редактор XP: підпункти + прямий XP у характеристику */
function XPMatrix({ stats, statXp, onChange }) {
  const [pick, setPick] = useState({ stat: '', sub: '', val: 5 })
  const stat = stats.find((s) => s.key === pick.stat)

  const addSub = () => {
    if (!pick.stat || !pick.sub) return
    const n = JSON.parse(JSON.stringify(statXp))
    const b = (n[pick.stat] ||= { subs: {}, stat: 0 })
    b.subs[pick.sub] = Number(pick.val) || 0
    onChange(n)
    setPick({ ...pick, sub: '', val: 5 })
  }

  const setDirect = (statKey, v) => {
    const n = JSON.parse(JSON.stringify(statXp))
    const b = (n[statKey] ||= { subs: {}, stat: 0 })
    b.stat = Number(v) || 0
    if (!b.stat && !Object.keys(b.subs).length) delete n[statKey]
    onChange(n)
  }

  const removeSub = (statKey, subKey) => {
    const n = JSON.parse(JSON.stringify(statXp))
    delete n[statKey].subs[subKey]
    if (!n[statKey].stat && !Object.keys(n[statKey].subs).length) delete n[statKey]
    onChange(n)
  }

  return (
    <div style={{ background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: 8, padding: 10 }}>
      <div style={{ color: '#6B7280', fontSize: 10, marginBottom: 7 }}>
        XP у підпункти та напряму в характеристику (можна від'ємні):
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={pick.stat} onChange={(e) => setPick({ ...pick, stat: e.target.value, sub: '' })} style={sel}>
          <option value="">Стат...</option>
          {stats.map((s) => <option key={s.id} value={s.key}>{s.icon} {s.name}</option>)}
        </select>
        {stat && (
          <>
            <select value={pick.sub} onChange={(e) => setPick({ ...pick, sub: e.target.value })} style={sel}>
              <option value="">Підпункт...</option>
              {stat.substats.map((x) => <option key={x.id} value={x.key}>{x.name}</option>)}
            </select>
            <Input type="number" value={pick.val} onChange={(e) => setPick({ ...pick, val: e.target.value })} style={{ width: 60 }} />
            <Btn variant="ghost" onClick={addSub} style={{ padding: '7px 11px', fontSize: 11 }}>+ підпункт</Btn>
          </>
        )}
      </div>

      {Object.entries(statXp).length > 0 && (
        <div style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {Object.entries(statXp).map(([sk, payload]) => {
            const st = stats.find((s) => s.key === sk)
            return (
              <div key={sk} style={{ background: '#12121A', borderRadius: 7, padding: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{ color: st?.color || '#9CA3AF', fontSize: 12, fontWeight: 600 }}>
                    {st?.icon} {st?.name || sk}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                    <span style={{ color: '#6B7280', fontSize: 10 }}>прямо в стат</span>
                    <Input type="number" value={payload.stat || 0}
                      onChange={(e) => setDirect(sk, e.target.value)} style={{ width: 58 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {Object.entries(payload.subs || {}).map(([subk, v]) => {
                    const subName = st?.substats.find((x) => x.key === subk)?.name || subk
                    return (
                      <span key={subk} onClick={() => removeSub(sk, subk)} style={{
                        background: v >= 0 ? '#0D2818' : '#2E1A1A',
                        color: v >= 0 ? '#22C55E' : '#EF4444',
                        borderRadius: 5, padding: '3px 7px', fontSize: 10, cursor: 'pointer',
                      }}>
                        {subName} {v >= 0 ? '+' : ''}{v} ✕
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function summarize(statXp) {
  const parts = []
  for (const [k, p] of Object.entries(statXp || {})) {
    const subs = Object.entries(p.subs || {}).map(([sk, v]) => `${sk}${v >= 0 ? '+' : ''}${v}`)
    if (p.stat) subs.push(`стат${p.stat >= 0 ? '+' : ''}${p.stat}`)
    if (subs.length) parts.push(`${k}: ${subs.join(', ')}`)
  }
  return parts.join(' · ') || 'без впливу'
}

// ═══ СЕРІЇ ═══
function StreaksEditor({ tiers, addTier, updateTier, deleteTier, settings, saveSettings, streaks, actions }) {
  const [nt, setNt] = useState({ days: 7, bonus_global_xp: 50, bonus_multiplier: 1.1, label: '' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card style={{ padding: 14 }}>
        <Label>Режим бонусу за серію</Label>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {[['tier', 'Разовий бонус на порозі'], ['mult', 'Множник щоденного XP'], ['both', 'Обидва']].map(([k, l]) => (
            <button key={k} onClick={() => saveSettings({ streak_bonus_mode: k })} style={{
              background: settings.streak_bonus_mode === k ? '#1A1A2E' : '#0A0A0F',
              border: `1px solid ${settings.streak_bonus_mode === k ? '#7C5CFC' : '#1E1E2E'}`,
              borderRadius: 7, padding: '7px 12px', cursor: 'pointer', fontSize: 12,
              color: settings.streak_bonus_mode === k ? '#7C5CFC' : '#6B7280',
            }}>{l}</button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#9CA3AF', fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={!!settings.freeze_on_missed}
            onChange={(e) => saveSettings({ freeze_on_missed: e.target.checked })} />
          Пропущений день не ламає серію (заморожує)
        </label>
      </Card>

      <Card style={{ padding: 14 }}>
        <Label>Пороги серій</Label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: '#6B7280', fontSize: 11 }}>днів</span>
          <Input type="number" value={nt.days} onChange={(e) => setNt({ ...nt, days: parseInt(e.target.value) || 0 })} style={{ width: 58 }} />
          <span style={{ color: '#6B7280', fontSize: 11 }}>бонус XP</span>
          <Input type="number" value={nt.bonus_global_xp} onChange={(e) => setNt({ ...nt, bonus_global_xp: parseInt(e.target.value) || 0 })} style={{ width: 66 }} />
          <span style={{ color: '#6B7280', fontSize: 11 }}>множник</span>
          <Input type="number" step="0.1" value={nt.bonus_multiplier} onChange={(e) => setNt({ ...nt, bonus_multiplier: parseFloat(e.target.value) || 1 })} style={{ width: 58 }} />
          <Input placeholder="Назва" value={nt.label} onChange={(e) => setNt({ ...nt, label: e.target.value })} style={{ width: 110 }} />
          <Btn onClick={() => { addTier(nt); setNt({ days: 7, bonus_global_xp: 50, bonus_multiplier: 1.1, label: '' }) }}>+</Btn>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tiers.map((t) => (
            <div key={t.id} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <Input type="number" value={t.days} onChange={(e) => updateTier(t.id, { days: parseInt(e.target.value) || 0 })} style={{ width: 58 }} />
              <span style={{ color: '#4B5563', fontSize: 11 }}>днів →</span>
              <Input type="number" value={t.bonus_global_xp} onChange={(e) => updateTier(t.id, { bonus_global_xp: parseInt(e.target.value) || 0 })} style={{ width: 66 }} />
              <span style={{ color: '#4B5563', fontSize: 11 }}>XP, ×</span>
              <Input type="number" step="0.1" value={t.bonus_multiplier} onChange={(e) => updateTier(t.id, { bonus_multiplier: parseFloat(e.target.value) || 1 })} style={{ width: 58 }} />
              <Input value={t.label || ''} onChange={(e) => updateTier(t.id, { label: e.target.value })} style={{ flex: '1 1 100px' }} />
              <Btn variant="danger" onClick={() => deleteTier(t.id)} style={{ padding: '6px 9px' }}>✕</Btn>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 14 }}>
        <Label>Поточні серії</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {actions.filter((a) => a.track_streak).map((a) => {
            const s = streaks[a.id] || { current: 0, best: 0 }
            return (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#9CA3AF' }}>{a.label}</span>
                <span style={{ color: s.current > 0 ? '#F97316' : '#374151', fontFamily: "'JetBrains Mono', monospace" }}>
                  {s.current} <span style={{ color: '#374151', fontSize: 10 }}>/ {s.best}</span>
                </span>
              </div>
            )
          })}
          {!actions.some((a) => a.track_streak) && (
            <span style={{ color: '#374151', fontSize: 12 }}>Познач «🔥 серія» у потрібних діях</span>
          )}
        </div>
      </Card>
    </div>
  )
}

// ═══ КВЕСТИ ═══
function QuestsEditor({ quests, addQuest, updateQuest, deleteQuest }) {
  const [d, setD] = useState({ type: 'daily', title: '', descr: '', xp: 15, total: null })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Card style={{ padding: 14 }}>
        <Label>Новий квест</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <select value={d.type} onChange={(e) => setD({ ...d, type: e.target.value })} style={sel}>
              <option value="daily">📅 Daily</option>
              <option value="weekly">📆 Weekly</option>
              <option value="longterm">🏆 Long-term</option>
            </select>
            <Input placeholder="Назва" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} style={{ flex: '1 1 130px' }} />
            <Input type="number" placeholder="XP" value={d.xp} onChange={(e) => setD({ ...d, xp: parseInt(e.target.value) || 0 })} style={{ width: 64 }} />
            <Input type="number" placeholder="Ціль" value={d.total || ''} onChange={(e) => setD({ ...d, total: e.target.value ? parseInt(e.target.value) : null })} style={{ width: 70 }} />
          </div>
          <Input placeholder="Опис" value={d.descr} onChange={(e) => setD({ ...d, descr: e.target.value })} />
          <Btn onClick={() => {
            if (!d.title.trim()) return
            addQuest(d.total ? { ...d, progress: 0 } : d)
            setD({ type: 'daily', title: '', descr: '', xp: 15, total: null })
          }} style={{ alignSelf: 'flex-start' }}>+ Створити</Btn>
        </div>
      </Card>

      {quests.map((q) => (
        <Card key={q.id} style={{ padding: 11 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={q.type} onChange={(e) => updateQuest(q.id, { type: e.target.value })} style={{ ...sel, fontSize: 11, padding: '6px 8px' }}>
              <option value="daily">📅</option>
              <option value="weekly">📆</option>
              <option value="longterm">🏆</option>
            </select>
            <Input value={q.title} onChange={(e) => updateQuest(q.id, { title: e.target.value })} style={{ flex: '1 1 110px' }} />
            <Input type="number" value={q.xp} onChange={(e) => updateQuest(q.id, { xp: parseInt(e.target.value) || 0 })} style={{ width: 60 }} />
            <Btn variant="danger" onClick={() => confirm('Видалити?') && deleteQuest(q.id)} style={{ padding: '6px 9px' }}>✕</Btn>
          </div>
        </Card>
      ))}
    </div>
  )
}

const sel = {
  background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: 8,
  padding: '8px 9px', color: '#E2E8F0', fontSize: 12, outline: 'none', cursor: 'pointer',
}
