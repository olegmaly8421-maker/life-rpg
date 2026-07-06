import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { SEED_STATS, SEED_ACTIONS, SEED_QUESTS } from '../data/seed'
import { calcStatLevel, applyXP, advanceGlobal } from '../lib/rpg'

export function useGameData(userId) {
  const [stats, setStats]     = useState([])      // [{...stat, substats:[...]}]
  const [actions, setActions] = useState([])
  const [quests, setQuests]   = useState([])
  const [logs, setLogs]       = useState([])
  const [profile, setProfile] = useState({ global_level: 1, global_xp: 0 })
  const [loading, setLoading] = useState(true)

  // ── Load everything ────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const [statsRes, subsRes, actionsRes, questsRes, logsRes, profileRes] = await Promise.all([
      supabase.from('stats').select('*').order('sort_order'),
      supabase.from('substats').select('*').order('sort_order'),
      supabase.from('actions').select('*').order('sort_order'),
      supabase.from('quests').select('*').order('sort_order'),
      supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(60),
      supabase.from('profile').select('*').eq('user_id', userId).single(),
    ])

    // First-time user: seed
    if (!statsRes.data || statsRes.data.length === 0) {
      await seedNewUser(userId)
      return loadAll()
    }

    // Merge substats into stats
    const subsByStat = {}
    ;(subsRes.data || []).forEach((s) => {
      if (!subsByStat[s.stat_id]) subsByStat[s.stat_id] = []
      subsByStat[s.stat_id].push(s)
    })
    const merged = statsRes.data.map((st) => ({
      ...st,
      substats: subsByStat[st.id] || [],
    }))

    setStats(merged)
    setActions(actionsRes.data || [])
    setQuests(questsRes.data || [])
    setLogs(logsRes.data || [])

    if (profileRes.data) setProfile(profileRes.data)
    else {
      await supabase.from('profile').insert({ user_id: userId, global_level: 4, global_xp: 850 })
      setProfile({ global_level: 4, global_xp: 850 })
    }

    setLoading(false)
  }, [userId])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Submit a day log ───────────────────────────────────────────────────────
  const submitDayLog = useCallback(async (selectedActions, note) => {
    let totalGlobal = 0
    const combined = {}

    for (const a of selectedActions) {
      totalGlobal += a.global_xp
      const eff = a.effects || {}
      for (const [statKey, subs] of Object.entries(eff)) {
        if (!combined[statKey]) combined[statKey] = {}
        for (const [subKey, val] of Object.entries(subs)) {
          combined[statKey][subKey] = (combined[statKey][subKey] || 0) + val
        }
      }
    }

    // Apply to substats + stats in DB
    const updatedStats = JSON.parse(JSON.stringify(stats))
    const subUpdates = []

    for (const stat of updatedStats) {
      const statChanges = combined[stat.key]
      if (!statChanges) continue
      for (const sub of stat.substats) {
        const delta = statChanges[sub.key]
        if (delta == null) continue
        const { level, xp } = applyXP(sub.level, sub.xp, delta)
        sub.level = level
        sub.xp = xp
        subUpdates.push({ id: sub.id, level, xp })
      }
      stat.level = calcStatLevel(stat.substats)
    }

    // Persist substat changes
    for (const u of subUpdates) {
      await supabase.from('substats').update({ level: u.level, xp: u.xp }).eq('id', u.id)
    }
    // Persist stat levels
    for (const stat of updatedStats) {
      if (combined[stat.key]) {
        await supabase.from('stats').update({ level: stat.level }).eq('id', stat.id)
      }
    }

    // Global XP
    const g = advanceGlobal(profile.global_level, profile.global_xp, totalGlobal)
    await supabase.from('profile').update({ global_level: g.level, global_xp: g.xp }).eq('user_id', userId)

    // Insert log
    const { data: logRow } = await supabase.from('logs').insert({
      user_id: userId,
      note,
      actions: selectedActions.map((a) => a.label),
      global_xp: totalGlobal,
      effects: combined,
    }).select().single()

    setStats(updatedStats)
    setProfile(g)
    if (logRow) setLogs((prev) => [logRow, ...prev])

    return { globalXP: totalGlobal }
  }, [stats, profile, userId])

  // ── Stat CRUD ──────────────────────────────────────────────────────────────
  const addStat = useCallback(async ({ key, name, icon, color }) => {
    const { data } = await supabase.from('stats')
      .insert({ user_id: userId, key, name, icon, color, level: 1, sort_order: stats.length })
      .select().single()
    if (data) setStats((prev) => [...prev, { ...data, substats: [] }])
    return data
  }, [userId, stats])

  const updateStat = useCallback(async (id, fields) => {
    await supabase.from('stats').update(fields).eq('id', id)
    setStats((prev) => prev.map((s) => s.id === id ? { ...s, ...fields } : s))
  }, [])

  const deleteStat = useCallback(async (id) => {
    await supabase.from('stats').delete().eq('id', id)
    setStats((prev) => prev.filter((s) => s.id !== id))
  }, [])

  // ── Substat CRUD ───────────────────────────────────────────────────────────
  const addSubstat = useCallback(async (statId, { key, name, level }) => {
    const stat = stats.find((s) => s.id === statId)
    const { data } = await supabase.from('substats')
      .insert({ user_id: userId, stat_id: statId, key, name, level: level || 1, sort_order: stat?.substats.length || 0 })
      .select().single()
    if (data) {
      setStats((prev) => prev.map((s) => s.id === statId ? { ...s, substats: [...s.substats, data], level: calcStatLevel([...s.substats, data]) } : s))
    }
  }, [userId, stats])

  const updateSubstat = useCallback(async (statId, subId, fields) => {
    await supabase.from('substats').update(fields).eq('id', subId)
    setStats((prev) => prev.map((s) => {
      if (s.id !== statId) return s
      const substats = s.substats.map((sub) => sub.id === subId ? { ...sub, ...fields } : sub)
      return { ...s, substats, level: calcStatLevel(substats) }
    }))
  }, [])

  const deleteSubstat = useCallback(async (statId, subId) => {
    await supabase.from('substats').delete().eq('id', subId)
    setStats((prev) => prev.map((s) => {
      if (s.id !== statId) return s
      const substats = s.substats.filter((sub) => sub.id !== subId)
      return { ...s, substats, level: substats.length ? calcStatLevel(substats) : s.level }
    }))
  }, [])

  // ── Action CRUD ────────────────────────────────────────────────────────────
  const addAction = useCallback(async (action) => {
    const { data } = await supabase.from('actions')
      .insert({ user_id: userId, ...action, sort_order: actions.length })
      .select().single()
    if (data) setActions((prev) => [...prev, data])
  }, [userId, actions])

  const updateAction = useCallback(async (id, fields) => {
    await supabase.from('actions').update(fields).eq('id', id)
    setActions((prev) => prev.map((a) => a.id === id ? { ...a, ...fields } : a))
  }, [])

  const deleteAction = useCallback(async (id) => {
    await supabase.from('actions').delete().eq('id', id)
    setActions((prev) => prev.filter((a) => a.id !== id))
  }, [])

  // ── Quest CRUD ─────────────────────────────────────────────────────────────
  const updateQuest = useCallback(async (id, fields) => {
    await supabase.from('quests').update(fields).eq('id', id)
    setQuests((prev) => prev.map((q) => q.id === id ? { ...q, ...fields } : q))
  }, [])

  const addQuest = useCallback(async (quest) => {
    const { data } = await supabase.from('quests')
      .insert({ user_id: userId, ...quest, sort_order: quests.length })
      .select().single()
    if (data) setQuests((prev) => [...prev, data])
  }, [userId, quests])

  const deleteQuest = useCallback(async (id) => {
    await supabase.from('quests').delete().eq('id', id)
    setQuests((prev) => prev.filter((q) => q.id !== id))
  }, [])

  return {
    stats, actions, quests, logs, profile, loading,
    submitDayLog,
    addStat, updateStat, deleteStat,
    addSubstat, updateSubstat, deleteSubstat,
    addAction, updateAction, deleteAction,
    addQuest, updateQuest, deleteQuest,
    reload: loadAll,
  }
}

// ── Seed a brand-new user ──────────────────────────────────────────────────────
async function seedNewUser(userId) {
  for (let i = 0; i < SEED_STATS.length; i++) {
    const s = SEED_STATS[i]
    const subLevels = s.substats.filter((x) => !x[3]).map((x) => x[2])
    const avg = Math.round(subLevels.reduce((a, b) => a + b, 0) / subLevels.length)

    const { data: statRow } = await supabase.from('stats')
      .insert({ user_id: userId, key: s.key, name: s.name, icon: s.icon, color: s.color, level: avg, sort_order: i })
      .select().single()

    if (statRow) {
      const subs = s.substats.map((sub, j) => ({
        user_id: userId, stat_id: statRow.id,
        key: sub[0], name: sub[1], level: sub[2], is_potential: sub[3] || false, sort_order: j,
      }))
      await supabase.from('substats').insert(subs)
    }
  }

  await supabase.from('actions').insert(
    SEED_ACTIONS.map((a, i) => ({ user_id: userId, ...a, sort_order: i }))
  )
  await supabase.from('quests').insert(
    SEED_QUESTS.map((q, i) => ({ user_id: userId, ...q, sort_order: i }))
  )
  await supabase.from('profile').insert({ user_id: userId, global_level: 4, global_xp: 850 })
}
