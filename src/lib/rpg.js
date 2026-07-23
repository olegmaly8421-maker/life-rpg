// ═══ ДАТИ ═══

/** 'YYYY-MM-DD' у локальному часі (не UTC — важливо, щоб день не з'їжджав) */
export function toDayKey(d) {
  const dt = d instanceof Date ? d : new Date(d)
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey() {
  return toDayKey(new Date())
}

export function addDays(dayKey, n) {
  const [y, m, d] = dayKey.split('-').map(Number)
  const dt = new Date(y, m - 1, d + n)
  return toDayKey(dt)
}

export function daysBetween(a, b) {
  const [y1, m1, d1] = a.split('-').map(Number)
  const [y2, m2, d2] = b.split('-').map(Number)
  const t1 = new Date(y1, m1 - 1, d1).getTime()
  const t2 = new Date(y2, m2 - 1, d2).getTime()
  return Math.round((t2 - t1) / 86400000)
}

export function formatDay(dayKey) {
  const [y, m, d] = dayKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function monthGrid(year, month) {
  // month: 0-11. Повертає масив тижнів (пн-нд), кожен = 7 елементів (dayKey або null)
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startOffset = (first.getDay() + 6) % 7 // пн = 0
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= last.getDate(); d++) cells.push(toDayKey(new Date(year, month, d)))
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

// ═══ КРИВІ РІВНІВ ═══

export const DEFAULT_CURVE = {
  mode: 'ranges',
  ranges: [
    { from: 1,  to: 30,  cost: 150 },
    { from: 31, to: 60,  cost: 300 },
    { from: 61, to: 100, cost: 600 },
  ],
  formula: { base: 100, mult: 10, power: 2, coef: 0.8 },
  manual: [],
}

export const DEFAULT_GLOBAL_CURVE = {
  mode: 'formula',
  ranges: [{ from: 1, to: 100, cost: 500 }],
  formula: { base: 200, mult: 150, power: 1, coef: 0 },
  manual: [],
}

/** Скільки XP треба для переходу з level на level+1 */
export function xpForLevel(level, curve) {
  if (!curve) curve = DEFAULT_CURVE
  const mode = curve.mode || 'ranges'

  if (mode === 'manual') {
    const list = curve.manual || []
    const hit = list.find((r) => Number(r.level) === level)
    if (hit) return Math.max(1, Number(hit.cost) || 1)
    return 150
  }

  if (mode === 'formula') {
    const f = curve.formula || {}
    const base = Number(f.base) || 0
    const mult = Number(f.mult) || 0
    const coef = Number(f.coef) || 0
    const power = Number(f.power) || 1
    return Math.max(1, Math.round(base + mult * level + coef * Math.pow(level, power)))
  }

  // ranges
  const ranges = curve.ranges || DEFAULT_CURVE.ranges
  for (const r of ranges) {
    if (level >= Number(r.from) && level <= Number(r.to)) return Math.max(1, Number(r.cost) || 1)
  }
  return Math.max(1, Number(ranges[ranges.length - 1]?.cost) || 150)
}

/** Додає XP і піднімає/опускає рівень за кривою */
export function applyXP(level, xp, delta, curve, maxLevel = 100) {
  let L = level
  let X = xp + delta

  // рівень вгору
  while (X >= xpForLevel(L, curve) && L < maxLevel) {
    X -= xpForLevel(L, curve)
    L++
  }
  // рівень вниз (від'ємний XP)
  while (X < 0 && L > 1) {
    L--
    X += xpForLevel(L, curve)
  }
  if (X < 0) X = 0
  if (L >= maxLevel) { L = maxLevel; if (X > xpForLevel(L, curve)) X = xpForLevel(L, curve) }

  return { level: L, xp: X }
}

// ═══ РАНГИ ТА КОЛЬОРИ ═══

export function getRank(level) {
  if (level <= 10) return 'Dormant'
  if (level <= 20) return 'Struggling'
  if (level <= 30) return 'Awakening'
  if (level <= 40) return 'Functional'
  if (level <= 50) return 'Average'
  if (level <= 60) return 'Capable'
  if (level <= 70) return 'Proficient'
  if (level <= 80) return 'Strong'
  if (level <= 90) return 'Elite'
  return 'Legendary'
}

export function levelColor(level) {
  if (level < 20) return '#EF4444'
  if (level < 35) return '#F97316'
  if (level < 50) return '#F59E0B'
  if (level < 65) return '#22C55E'
  if (level < 80) return '#06B6D4'
  return '#8B5CF6'
}

export function calcStatLevel(substats) {
  const subs = (substats || []).filter((s) => !s.is_potential)
  if (!subs.length) return 1
  return Math.round(subs.reduce((a, s) => a + s.level, 0) / subs.length)
}

// ═══ ТРЕНДИ ═══

/**
 * Рахує зміну характеристики за N днів на основі логів.
 * Повертає { delta, dir } де dir: 'up' | 'down' | 'flat'
 */
export function statTrend(logs, statKey, days) {
  const cutoff = addDays(todayKey(), -days)
  let sum = 0
  for (const log of logs) {
    if (!log.day_date || log.day_date < cutoff) continue
    const eff = log.effects || {}
    const statPart = eff[statKey]
    if (!statPart) continue
    // сумуємо всі підпункти + прямий стат
    for (const v of Object.values(statPart.subs || {})) sum += Number(v) || 0
    sum += Number(statPart.stat) || 0
  }
  const dir = sum > 0 ? 'up' : sum < 0 ? 'down' : 'flat'
  return { delta: sum, dir }
}

export function trendArrow(dir) {
  return dir === 'up' ? '↑' : dir === 'down' ? '↓' : '→'
}

export function trendColor(dir) {
  return dir === 'up' ? '#22C55E' : dir === 'down' ? '#EF4444' : '#6B7280'
}

// ═══ СЕРІЇ ═══

/**
 * Перераховує серію для однієї дії на основі всіх логів.
 * Серія = кількість послідовних днів (від найсвіжішого запису назад),
 * у яких ця дія була відмічена.
 */
export function computeStreak(logs, actionId, freezeOnMissed = false) {
  // мапа день → чи була дія
  const byDay = {}
  for (const log of logs) {
    if (!log.day_date) continue
    const ids = log.action_ids || []
    byDay[log.day_date] = ids.includes(actionId)
  }

  const days = Object.keys(byDay).sort().reverse()
  if (!days.length) return { current: 0, best: 0, last: null }

  // best — найдовша серія за всю історію
  const allDays = Object.keys(byDay).sort()
  let best = 0, run = 0, prev = null
  for (const d of allDays) {
    if (!byDay[d]) { if (!freezeOnMissed) run = 0; continue }
    if (prev && daysBetween(prev, d) > 1 && !freezeOnMissed) run = 0
    run++
    if (run > best) best = run
    prev = d
  }

  // current — від сьогодні/вчора назад
  let cur = 0
  let cursor = todayKey()
  if (byDay[cursor] === undefined) cursor = addDays(cursor, -1) // сьогодні ще не заповнено — рахуємо від вчора

  while (true) {
    if (byDay[cursor] === true) { cur++; cursor = addDays(cursor, -1); continue }
    if (byDay[cursor] === undefined && freezeOnMissed) { cursor = addDays(cursor, -1); 
      if (daysBetween(cursor, todayKey()) > 60) break
      continue }
    break
  }

  const lastDone = allDays.filter((d) => byDay[d]).pop() || null
  return { current: cur, best: Math.max(best, cur), last: lastDone }
}

/** Який поріг щойно досягнуто (для бонусу) */
export function tierHit(tiers, streakValue) {
  return (tiers || []).find((t) => Number(t.days) === streakValue) || null
}

/** Активний множник за поточною серією */
export function activeMultiplier(tiers, streakValue) {
  let m = 1
  for (const t of tiers || []) {
    if (streakValue >= Number(t.days)) m = Math.max(m, Number(t.bonus_multiplier) || 1)
  }
  return m
}

// ═══ ДЕКЕЙ ═══

/**
 * Скільки днів поспіль пропущено (без жодного запису), рахуючи від вчора назад.
 */
export function missedDays(logs) {
  const filled = new Set(logs.map((l) => l.day_date).filter(Boolean))
  let n = 0
  let cursor = addDays(todayKey(), -1)
  while (!filled.has(cursor) && n < 90) {
    n++
    cursor = addDays(cursor, -1)
  }
  return n
}
