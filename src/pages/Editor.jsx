import { useState } from 'react'
import { Card, Btn, Input, Label } from '../components/ui'

const EMOJI = ['⚔️','⚡','😴','🧠','📚','🧘','🗣️','🧩','🎭','💰','🗺️','🧹','♂️','🩺','🔥','💪','🎯','🌟','🏆','❤️','🎨','🎸','🌍','⭐']
const COLORS = ['#EF4444','#F59E0B','#818CF8','#8B5CF6','#10B981','#EC4899','#06B6D4','#F97316','#EAB308','#84CC16','#0EA5E9','#A78BFA','#F43F5E','#34D399']

export default function Editor(g) {
  const [tab, setTab] = useState('stats')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[['stats', '📊 Характеристики'], ['actions', '⚡ Дії'], ['quests', '🗺️ Квести']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: tab === k ? '#1A1A2E' : '#12121A', border: `1px solid ${tab === k ? '#7C5CFC' : '#1E1E2E'}`,
            borderRadius: 8, padding: '8px 14px', color: tab === k ? '#7C5CFC' : '#6B7280', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>{l}</button>
        ))}
      </div>
      {tab === 'stats' && <StatsEditor {...g} />}
      {tab === 'actions' && <ActionsEditor {...g} />}
      {tab === 'quests' && <QuestsEditor {...g} />}
    </div>
  )
}

// ── STATS EDITOR ────────────────────────────────────────────────────────────────
function StatsEditor({ stats, addStat, updateStat, deleteStat, addSubstat, updateSubstat, deleteSubstat }) {
  const [open, setOpen] = useState(null)
  const [newStat, setNewStat] = useState({ name: '', icon: '⭐', color: '#7C5CFC' })
  const [newSub, setNewSub] = useState({ name: '', level: 20 })

  const create = async () => {
    if (!newStat.name.trim()) return
    const key = newStat.name.toUpperCase().replace(/\s+/g, '_').slice(0, 20)
    await addStat({ key, name: newStat.name, icon: newStat.icon, color: newStat.color })
    setNewStat({ name: '', icon: '⭐', color: '#7C5CFC' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card style={{ padding: 16 }}>
        <Label>Нова характеристика</Label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Input placeholder="Назва (напр. Творчість)" value={newStat.name} onChange={(e) => setNewStat({ ...newStat, name: e.target.value })} style={{ flex: '1 1 160px' }} />
          <select value={newStat.icon} onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })} style={sel}>
            {EMOJI.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 4 }}>
            {COLORS.slice(0, 7).map((c) => (
              <button key={c} onClick={() => setNewStat({ ...newStat, color: c })} style={{ width: 22, height: 22, borderRadius: 5, background: c, border: newStat.color === c ? '2px solid #fff' : 'none', cursor: 'pointer' }} />
            ))}
          </div>
          <Btn onClick={create}>+ Додати</Btn>
        </div>
      </Card>

      {stats.map((s) => (
        <Card key={s.id} style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <Input value={s.name} onChange={(e) => updateStat(s.id, { name: e.target.value })} style={{ flex: 1, maxWidth: 200 }} />
            <span style={{ color: s.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{s.level}</span>
            <Btn variant="ghost" onClick={() => setOpen(open === s.id ? null : s.id)}>{open === s.id ? '▲' : '▼'} підпункти ({s.substats.length})</Btn>
            <Btn variant="danger" onClick={() => { if (confirm(`Видалити «${s.name}»?`)) deleteStat(s.id) }}>✕</Btn>
          </div>

          {open === s.id && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1E1E2E', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.substats.map((sub) => (
                <div key={sub.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Input value={sub.name} onChange={(e) => updateSubstat(s.id, sub.id, { name: e.target.value })} style={{ flex: 1 }} />
                  <Input type="number" value={sub.level} onChange={(e) => updateSubstat(s.id, sub.id, { level: parseInt(e.target.value) || 0 })} style={{ width: 70 }} />
                  <Btn variant="danger" onClick={() => deleteSubstat(s.id, sub.id)} style={{ padding: '6px 10px' }}>✕</Btn>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Input placeholder="Новий підпункт" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} style={{ flex: 1 }} />
                <Input type="number" value={newSub.level} onChange={(e) => setNewSub({ ...newSub, level: parseInt(e.target.value) || 0 })} style={{ width: 70 }} />
                <Btn onClick={() => { if (newSub.name.trim()) { addSubstat(s.id, { key: newSub.name.toLowerCase().replace(/\s+/g, '_'), name: newSub.name, level: newSub.level }); setNewSub({ name: '', level: 20 }) } }}>+</Btn>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

// ── ACTIONS EDITOR ──────────────────────────────────────────────────────────────
function ActionsEditor({ actions, stats, addAction, updateAction, deleteAction }) {
  const [draft, setDraft] = useState({ label: '', is_positive: true, global_xp: 10, effects: {} })

  const create = async () => {
    if (!draft.label.trim()) return
    await addAction(draft)
    setDraft({ label: '', is_positive: true, global_xp: 10, effects: {} })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card style={{ padding: 16 }}>
        <Label>Нова дія</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input placeholder="Назва дії (напр. 🎸 Гра на гітарі 30 хв)" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} style={{ flex: '1 1 200px' }} />
            <select value={draft.is_positive ? 'pos' : 'neg'} onChange={(e) => setDraft({ ...draft, is_positive: e.target.value === 'pos' })} style={sel}>
              <option value="pos">✅ Позитивна</option>
              <option value="neg">❌ Негатив</option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#6B7280', fontSize: 12 }}>Global XP</span>
              <Input type="number" value={draft.global_xp} onChange={(e) => setDraft({ ...draft, global_xp: parseInt(e.target.value) || 0 })} style={{ width: 70 }} />
            </div>
          </div>

          <div style={{ color: '#6B7280', fontSize: 11 }}>Вплив на підпункти (скільки XP додає/віднімає):</div>
          <EffectsEditor stats={stats} effects={draft.effects} onChange={(effects) => setDraft({ ...draft, effects })} />

          <Btn onClick={create} style={{ alignSelf: 'flex-start' }}>+ Створити дію</Btn>
        </div>
      </Card>

      {actions.map((a) => (
        <Card key={a.id} style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16 }}>{a.is_positive ? '✅' : '❌'}</span>
            <Input value={a.label} onChange={(e) => updateAction(a.id, { label: e.target.value })} style={{ flex: 1, minWidth: 150 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#6B7280', fontSize: 11 }}>XP</span>
              <Input type="number" value={a.global_xp} onChange={(e) => updateAction(a.id, { global_xp: parseInt(e.target.value) || 0 })} style={{ width: 60 }} />
            </div>
            <Btn variant="danger" onClick={() => { if (confirm('Видалити дію?')) deleteAction(a.id) }}>✕</Btn>
          </div>
          <div style={{ color: '#4B5563', fontSize: 10, marginTop: 6 }}>
            {Object.entries(a.effects || {}).map(([k, subs]) => `${k}: ${Object.entries(subs).map(([sk, v]) => `${sk} ${v > 0 ? '+' : ''}${v}`).join(', ')}`).join(' · ') || 'без впливу на підпункти'}
          </div>
        </Card>
      ))}
    </div>
  )
}

function EffectsEditor({ stats, effects, onChange }) {
  const [statKey, setStatKey] = useState('')
  const [subKey, setSubKey]   = useState('')
  const [val, setVal]         = useState(5)

  const stat = stats.find((s) => s.key === statKey)

  const add = () => {
    if (!statKey || !subKey) return
    const next = JSON.parse(JSON.stringify(effects))
    if (!next[statKey]) next[statKey] = {}
    next[statKey][subKey] = val
    onChange(next)
    setVal(5)
  }
  const remove = (sk, subk) => {
    const next = JSON.parse(JSON.stringify(effects))
    delete next[sk][subk]
    if (Object.keys(next[sk]).length === 0) delete next[sk]
    onChange(next)
  }

  return (
    <div style={{ background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: 8, padding: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={statKey} onChange={(e) => { setStatKey(e.target.value); setSubKey('') }} style={sel}>
          <option value="">Стат...</option>
          {stats.map((s) => <option key={s.id} value={s.key}>{s.icon} {s.name}</option>)}
        </select>
        {stat && (
          <select value={subKey} onChange={(e) => setSubKey(e.target.value)} style={sel}>
            <option value="">Підпункт...</option>
            {stat.substats.map((sub) => <option key={sub.id} value={sub.key}>{sub.name}</option>)}
          </select>
        )}
        <Input type="number" value={val} onChange={(e) => setVal(parseInt(e.target.value) || 0)} style={{ width: 60 }} />
        <Btn variant="ghost" onClick={add}>+ вплив</Btn>
      </div>
      {Object.entries(effects).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
          {Object.entries(effects).map(([sk, subs]) => Object.entries(subs).map(([subk, v]) => (
            <span key={sk + subk} onClick={() => remove(sk, subk)} style={{ background: v > 0 ? '#0D2818' : '#2E1A1A', color: v > 0 ? '#22C55E' : '#EF4444', borderRadius: 5, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>
              {sk}.{subk} {v > 0 ? '+' : ''}{v} ✕
            </span>
          )))}
        </div>
      )}
    </div>
  )
}

// ── QUESTS EDITOR ───────────────────────────────────────────────────────────────
function QuestsEditor({ quests, addQuest, updateQuest, deleteQuest }) {
  const [draft, setDraft] = useState({ type: 'daily', title: '', descr: '', xp: 15, total: null })

  const create = async () => {
    if (!draft.title.trim()) return
    const q = { ...draft }
    if (q.total) q.progress = 0
    await addQuest(q)
    setDraft({ type: 'daily', title: '', descr: '', xp: 15, total: null })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card style={{ padding: 16 }}>
        <Label>Новий квест</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} style={sel}>
              <option value="daily">📅 Daily</option>
              <option value="weekly">📆 Weekly</option>
              <option value="longterm">🏆 Long-term</option>
            </select>
            <Input placeholder="Назва" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} style={{ flex: '1 1 150px' }} />
            <Input type="number" placeholder="XP" value={draft.xp} onChange={(e) => setDraft({ ...draft, xp: parseInt(e.target.value) || 0 })} style={{ width: 70 }} />
            <Input type="number" placeholder="Ціль (напр. 3)" value={draft.total || ''} onChange={(e) => setDraft({ ...draft, total: e.target.value ? parseInt(e.target.value) : null })} style={{ width: 100 }} />
          </div>
          <Input placeholder="Опис" value={draft.descr} onChange={(e) => setDraft({ ...draft, descr: e.target.value })} />
          <Btn onClick={create} style={{ alignSelf: 'flex-start' }}>+ Створити квест</Btn>
        </div>
      </Card>

      {quests.map((q) => (
        <Card key={q.id} style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#6B7280', fontSize: 11 }}>{q.type}</span>
            <Input value={q.title} onChange={(e) => updateQuest(q.id, { title: e.target.value })} style={{ flex: 1, minWidth: 120 }} />
            <Input type="number" value={q.xp} onChange={(e) => updateQuest(q.id, { xp: parseInt(e.target.value) || 0 })} style={{ width: 60 }} />
            <Btn variant="danger" onClick={() => { if (confirm('Видалити квест?')) deleteQuest(q.id) }}>✕</Btn>
          </div>
        </Card>
      ))}
    </div>
  )
}

const sel = { background: '#0A0A0F', border: '1px solid #1E1E2E', borderRadius: 8, padding: '9px 10px', color: '#E2E8F0', fontSize: 13, outline: 'none', cursor: 'pointer' }
