import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from './supabase'
import { SEED_STATS, SEED_ACTIONS, SEED_QUESTS, SEED_TIERS } from '../data/seed'
import {
  calcStatLevel, applyXP, todayKey, computeStreak,
  DEFAULT_CURVE, DEFAULT_GLOBAL_CURVE, tierHit, activeMultiplier,
} from './rpg'

const DEFAULT_SETTINGS = {
  streak_bonus_mode: 'both',
  freeze_on_missed: false,
  edit_days_back: 0,
  decay_enabled: false,
  decay_after_days: 3,
  decay_rules: {},
}

export function useGameData(userId) {
  const [stats, setStats]       = useState([])
  const [actions, setActions]   = useState([])
  const [quests, setQuests]     = useState([])
  const [logs, setLogs]         = useState([])
  const [rewards, setRewards]   = useState([])
  const [tiers, setTiers]       = useState([])
  const [curves, setCurves]     = useState({ substat: DEFAULT_CURVE, global: DEFAULT_GLOBAL_CURVE })
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [profile, setProfile]   = useState({ global_level: 1, global_xp: 0 })
  const [loading, setLoading]   = useState(true)

  // ── ЗАВАНТАЖЕННЯ ─────────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const [st, sub, act, qs, lg, rw, tr, cv, sg, pf] = await Promise.all([
      supabase.from('stats').select('*').order('sort_order'),
      supabase.from('substats').select('*').order('sort_order'),
      supabase.from('actions').select('*').order('sort_order'),
      supabase.from('quests').select('*').order('sort_order'),
      supabase.from('logs').select('*').order('day_date', { ascending: false }).limit(400),
      supabase.from('rewards').select('*').order('sort_order'),
      supabase.from('streak_tiers').select('*').order('days'),
      supabase.from('level_curves').select('*'),
      supabase.from('settings').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('profile').select('*').eq('user_id', userId).maybeSingle(),
    ])

    if (!st.data || st.data.length === 0) {
      await seedNewUser(userId)
      return loadAll()
    }

    const subsByStat = {}
    for (const s of sub.data || []) {
      ;(subsByStat[s.stat_id] ||= []).push(s)
    }
    setStats(st.data.map((x) => ({ ...x, substats: subsByStat[x.id] || [] })))
    setActions(act.data || [])
    setQuests(qs.data || [])
    setLogs(lg.data || [])
    setRewards(rw.data || [])

    // tiers — засіяти якщо порожньо
    if (!tr.data || tr.data.length === 0) {
      await supabase.from('streak_tiers').insert(SEED_TIERS.map((t, i) => ({ user_id: userId, ...t, sort_order: i })))
      const again = await supabase.from('streak_tiers').select('*').order('days')
      setTiers(again.data || [])
    } else setTiers(tr.data)

    // curves
    const cmap = { substat: DEFAULT_CURVE, global: DEFAULT_GLOBAL_CURVE }
    for (const c of cv.data || []) {
      cmap[c.scope] = { mode: c.mode, ranges: c.ranges, formula: c.formula, manual: c.manual }
    }
    setCurves(cmap)

    setSettings(sg.data ? { ...DEFAULT_SETTINGS, ...sg.data } : DEFAULT_SETTINGS)
    if (!sg.data) await supabase.from('settings').insert({ user_id: userId, ...DEFAULT_SETTINGS })

    if (pf.data) setProfile(pf.data)
    else {
      await supabase.from('profile').insert({ user_id: userId, global_level: 4, global_xp: 850 })
      setProfile({ global_level: 4, global_xp: 850 })
    }

    setLoading(false)
  }, [userId])

  useEffect(() => { loadAll() }, [loadAll])

  // ── СЕРІЇ (обчислюються з логів) ─────────────────────────────────────────────
  const streaks = useMemo(() => {
    const map = {}
    for (const a of actions) {
      if (!a.track_streak) continue
      map[a.id] = computeStreak(logs, a.id, settings.freeze_on_missed)
    }
    return map
  }, [actions, logs, settings.freeze_on_missed])

  // ── ЗБЕРЕЖЕННЯ ДНЯ ───────────────────────────────────────────────────────────
  /**
   * dayKey: 'YYYY-MM-DD'
   * selectedIds: масив id дій
   * note: текст
   */
  const saveDay = useCallback(async (dayKey, selectedIds, note) => {
    const chosen = actions.filter((a) => selectedIds.includes(a.id))

    // 1. Рахуємо ефекти
    let globalDelta = 0
    const effects = {}   // { STAT_KEY: { subs: {subKey: xp}, stat: xp } }

    for (const a of chosen) {
      globalDelta += Number(a.global_xp) || 0
      const sx = a.stat_xp || {}
      for (const [statKey, payload] of Object.entries(sx)) {
        const bucket = (effects[statKey] ||= { subs: {}, stat: 0 })
        for (const [subKey, val] of Object.entries(payload.subs || {})) {
          bucket.subs[subKey] = (bucket.subs[subKey] || 0) + (Number(val) || 0)
        }
        bucket.stat += Number(payload.stat) || 0
      }
    }

    // 2. Бонуси за серії (перевіряємо ПІСЛЯ додавання цього дня)
    const prevLogs = logs.filter((l) => l.day_date !== dayKey)
    const simulated = [...prevLogs, { day_date: dayKey, action_ids: selectedIds }]
    const bonusNotes = []

    for (const a of chosen) {
      if (!a.track_streak) continue
      const s = computeStreak(simulated, a.id, settings.freeze_on_missed)
      const mode = settings.streak_bonus_mode || 'both'

      if (mode === 'tier' || mode === 'both') {
        const hit = tierHit(tiers, s.current)
        if (hit) {
          globalDelta += Number(hit.bonus_global_xp) || 0
          for (const [statKey, payload] of Object.entries(hit.stat_xp || {})) {
            const bucket = (effects[statKey] ||= { subs: {}, stat: 0 })
            for (const [subKey, val] of Object.entries(payload.subs || {})) {
              bucket.subs[subKey] = (bucket.subs[subKey] || 0) + (Number(val) || 0)
            }
            bucket.stat += Number(payload.stat) || 0
          }
          bonusNotes.push(`🔥 ${a.label}: ${s.current} днів поспіль!`)
        }
      }
      if (mode === 'mult' || mode === 'both') {
        const m = activeMultiplier(tiers, s.current)
        if (m > 1) {
          const base = Number(a.global_xp) || 0
          globalDelta += Math.round(base * (m - 1))
        }
      }
    }

    // 3. Якщо день уже існував — відкотити його старі ефекти
    const existing = logs.find((l) => l.day_date === dayKey)
    if (existing) {
      const old = existing.effects || {}
      for (const [statKey, payload] of Object.entries(old)) {
        const bucket = (effects[statKey] ||= { subs: {}, stat: 0 })
        for (const [subKey, val] of Object.entries(payload.subs || {})) {
          bucket.subs[subKey] = (bucket.subs[subKey] || 0) - (Number(val) || 0)
        }
        bucket.stat -= Number(payload.stat) || 0
      }
      globalDelta -= Number(existing.global_xp) || 0
    }

    // 4. Застосовуємо до статів
    const nextStats = JSON.parse(JSON.stringify(stats))
    const subUpdates = []
    const statUpdates = []

    for (const stat of nextStats) {
      const bucket = effects[stat.key]
      if (!bucket) continue

      for (const sub of stat.substats) {
        const d = bucket.subs[sub.key]
        if (!d) continue
        const r = applyXP(sub.level, sub.xp, d, curves.substat)
        sub.level = r.level; sub.xp = r.xp
        subUpdates.push({ id: sub.id, level: r.level, xp: r.xp })
      }

      // прямий XP у характеристику
      if (bucket.stat) {
        const r = applyXP(stat.level, stat.xp || 0, bucket.stat, curves.substat)
        stat.level = r.level; stat.xp = r.xp
      } else {
        stat.level = calcStatLevel(stat.substats)
      }
      statUpdates.push({ id: stat.id, level: stat.level, xp: stat.xp || 0 })
    }

    // 5. Пишемо в базу
    for (const u of subUpdates) {
      await supabase.from('substats').update({ level: u.level, xp: u.xp }).eq('id', u.id)
    }
    for (const u of statUpdates) {
      await supabase.from('stats').update({ level: u.level, xp: u.xp }).eq('id', u.id)
    }

    const g = applyXP(profile.global_level, profile.global_xp, globalDelta, curves.global, 9999)
    await supabase.from('profile').update({ global_level: g.level, global_xp: g.xp }).eq('user_id', userId)

    // 6. Лог (upsert по day_date)
    const totalGlobalForLog = (existing ? Number(existing.global_xp) || 0 : 0) + globalDelta
    const mergedEffects = {}
    for (const [k, v] of Object.entries(effects)) {
      mergedEffects[k] = { subs: { ...v.subs }, stat: v.stat }
    }
    if (existing) {
      for (const [k, v] of Object.entries(existing.effects || {})) {
        const b = (mergedEffects[k] ||= { subs: {}, stat: 0 })
        for (const [sk, sv] of Object.entries(v.subs || {})) b.subs[sk] = (b.subs[sk] || 0) + (Number(sv) || 0)
        b.stat += Number(v.stat) || 0
      }
    }

    const row = {
      user_id: userId,
      day_date: dayKey,
      note: note || '',
      actions: chosen.map((a) => a.label),
      action_ids: selectedIds,
      global_xp: totalGlobalForLog,
      effects: mergedEffects,
      updated_at: new Date().toISOString(),
    }

    const { data: saved } = await supabase.from('logs')
      .upsert(row, { onConflict: 'user_id,day_date' })
      .select().single()

    setStats(nextStats)
    setProfile(g)
    setLogs((prev) => {
      const rest = prev.filter((l) => l.day_date !== dayKey)
      return [saved || row, ...rest].sort((a, b) => (b.day_date || '').localeCompare(a.day_date || ''))
    })

    return { globalDelta, bonusNotes }
  }, [actions, logs, stats, profile, curves, settings, tiers, userId])

  const deleteDay = useCallback(async (dayKey) => {
    const existing = logs.find((l) => l.day_date === dayKey)
    if (!existing) return
    // відкат ефектів
    await saveDay(dayKey, [], '')
    await supabase.from('logs').delete().eq('user_id', userId).eq('day_date', dayKey)
    setLogs((prev) => prev.filter((l) => l.day_date !== dayKey))
  }, [logs, saveDay, userId])

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  const crud = {
    addStat: async (f) => {
      const { data } = await supabase.from('stats').insert({ user_id: userId, level: 1, xp: 0, sort_order: stats.length, ...f }).select().single()
      if (data) setStats((p) => [...p, { ...data, substats: [] }])
    },
    updateStat: async (id, f) => {
      await supabase.from('stats').update(f).eq('id', id)
      setStats((p) => p.map((s) => s.id === id ? { ...s, ...f } : s))
    },
    deleteStat: async (id) => {
      await supabase.from('stats').delete().eq('id', id)
      setStats((p) => p.filter((s) => s.id !== id))
    },
    addSubstat: async (statId, f) => {
      const st = stats.find((s) => s.id === statId)
      const { data } = await supabase.from('substats').insert({ user_id: userId, stat_id: statId, xp: 0, sort_order: st?.substats.length || 0, ...f }).select().single()
      if (data) setStats((p) => p.map((s) => s.id === statId
        ? { ...s, substats: [...s.substats, data], level: calcStatLevel([...s.substats, data]) } : s))
    },
    updateSubstat: async (statId, subId, f) => {
      await supabase.from('substats').update(f).eq('id', subId)
      setStats((p) => p.map((s) => {
        if (s.id !== statId) return s
        const substats = s.substats.map((x) => x.id === subId ? { ...x, ...f } : x)
        return { ...s, substats, level: calcStatLevel(substats) }
      }))
    },
    deleteSubstat: async (statId, subId) => {
      await supabase.from('substats').delete().eq('id', subId)
      setStats((p) => p.map((s) => {
        if (s.id !== statId) return s
        const substats = s.substats.filter((x) => x.id !== subId)
        return { ...s, substats, level: substats.length ? calcStatLevel(substats) : s.level }
      }))
    },
    addAction: async (f) => {
      const { data } = await supabase.from('actions').insert({ user_id: userId, sort_order: actions.length, ...f }).select().single()
      if (data) setActions((p) => [...p, data])
    },
    updateAction: async (id, f) => {
      await supabase.from('actions').update(f).eq('id', id)
      setActions((p) => p.map((a) => a.id === id ? { ...a, ...f } : a))
    },
    deleteAction: async (id) => {
      await supabase.from('actions').delete().eq('id', id)
      setActions((p) => p.filter((a) => a.id !== id))
    },
    addQuest: async (f) => {
      const { data } = await supabase.from('quests').insert({ user_id: userId, sort_order: quests.length, ...f }).select().single()
      if (data) setQuests((p) => [...p, data])
    },
    updateQuest: async (id, f) => {
      await supabase.from('quests').update(f).eq('id', id)
      setQuests((p) => p.map((q) => q.id === id ? { ...q, ...f } : q))
    },
    deleteQuest: async (id) => {
      await supabase.from('quests').delete().eq('id', id)
      setQuests((p) => p.filter((q) => q.id !== id))
    },
    addReward: async (f) => {
      const { data } = await supabase.from('rewards').insert({ user_id: userId, sort_order: rewards.length, ...f }).select().single()
      if (data) setRewards((p) => [...p, data])
    },
    updateReward: async (id, f) => {
      await supabase.from('rewards').update(f).eq('id', id)
      setRewards((p) => p.map((r) => r.id === id ? { ...r, ...f } : r))
    },
    deleteReward: async (id) => {
      await supabase.from('rewards').delete().eq('id', id)
      setRewards((p) => p.filter((r) => r.id !== id))
    },
    addTier: async (f) => {
      const { data } = await supabase.from('streak_tiers').insert({ user_id: userId, sort_order: tiers.length, ...f }).select().single()
      if (data) setTiers((p) => [...p, data].sort((a, b) => a.days - b.days))
    },
    updateTier: async (id, f) => {
      await supabase.from('streak_tiers').update(f).eq('id', id)
      setTiers((p) => p.map((t) => t.id === id ? { ...t, ...f } : t).sort((a, b) => a.days - b.days))
    },
    deleteTier: async (id) => {
      await supabase.from('streak_tiers').delete().eq('id', id)
      setTiers((p) => p.filter((t) => t.id !== id))
    },
    saveCurve: async (scope, curve) => {
      await supabase.from('level_curves').upsert(
        { user_id: userId, scope, mode: curve.mode, ranges: curve.ranges, formula: curve.formula, manual: curve.manual },
        { onConflict: 'user_id,scope' }
      )
      setCurves((p) => ({ ...p, [scope]: curve }))
    },
    saveSettings: async (f) => {
      const next = { ...settings, ...f }
      await supabase.from('settings').upsert({ user_id: userId, ...next, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      setSettings(next)
    },
  }

  return {
    stats, actions, quests, logs, rewards, tiers, curves, settings, profile,
    streaks, loading,
    saveDay, deleteDay, reload: loadAll,
    ...crud,
  }
}

// ── SEED ────────────────────────────────────────────────────────────────────────
async function seedNewUser(userId) {
  for (let i = 0; i < SEED_STATS.length; i++) {
    const s = SEED_STATS[i]
    const lv = s.substats.filter((x) => !x[3]).map((x) => x[2])
    const avg = Math.round(lv.reduce((a, b) => a + b, 0) / lv.length)
    const { data: row } = await supabase.from('stats')
      .insert({ user_id: userId, key: s.key, name: s.name, icon: s.icon, color: s.color, level: avg, xp: 0, sort_order: i })
      .select().single()
    if (row) {
      await supabase.from('substats').insert(s.substats.map((sub, j) => ({
        user_id: userId, stat_id: row.id, key: sub[0], name: sub[1],
        level: sub[2], xp: 0, is_potential: sub[3] || false, sort_order: j,
      })))
    }
  }
  await supabase.from('actions').insert(SEED_ACTIONS.map((a, i) => ({ user_id: userId, ...a, sort_order: i })))
  await supabase.from('quests').insert(SEED_QUESTS.map((q, i) => ({ user_id: userId, ...q, sort_order: i })))
  await supabase.from('streak_tiers').insert(SEED_TIERS.map((t, i) => ({ user_id: userId, ...t, sort_order: i })))
  await supabase.from('profile').insert({ user_id: userId, global_level: 4, global_xp: 850 })
}
