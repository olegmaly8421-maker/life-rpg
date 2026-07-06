export function xpForSubLevel(level) {
  if (level < 30) return 150
  if (level < 60) return 300
  return 600
}

export function xpForGlobalLevel(level) {
  return 200 + (level - 1) * 150
}

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

/** Given substats array, compute main level (avg, excluding potential) */
export function calcStatLevel(substats) {
  const subs = substats.filter((s) => !s.is_potential)
  if (subs.length === 0) return 1
  return Math.round(subs.reduce((a, s) => a + s.level, 0) / subs.length)
}

/** Apply xp delta to a {level, xp} object, returns new {level, xp} */
export function applyXP(level, xp, delta) {
  let newXp = Math.max(0, xp + delta)
  let newLevel = level
  while (newXp >= xpForSubLevel(newLevel) && newLevel < 100) {
    newXp -= xpForSubLevel(newLevel)
    newLevel++
  }
  return { level: newLevel, xp: newXp }
}

export function advanceGlobal(level, xp, gain) {
  let newXp = xp + gain
  let newLevel = level
  while (newXp >= xpForGlobalLevel(newLevel)) {
    newXp -= xpForGlobalLevel(newLevel)
    newLevel++
  }
  return { level: newLevel, xp: newXp }
}
