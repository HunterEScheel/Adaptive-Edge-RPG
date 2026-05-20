export const SKILL_COST_FROM_ZERO: readonly number[] = [
  0, 2, 5, 10, 18, 31, 52, 86, 141, 230, 374, 748, 1266, 2158, 3568, 5870, 9582,
  15596,
] as const

export const MAX_SKILL_LEVEL = SKILL_COST_FROM_ZERO.length - 1

export function skillCost(level: number): number {
  if (level <= 0) return 0
  if (level > MAX_SKILL_LEVEL) return SKILL_COST_FROM_ZERO[MAX_SKILL_LEVEL]
  return SKILL_COST_FROM_ZERO[level]
}

export const ATTRIBUTE_BP_PER_LEVEL = 50
export const MAGIC_SCHOOL_BP_PER_LEVEL = 25
export const MAGIC_MEDIUM_BP_PER_LEVEL = 10
export const BP_PER_3_HP = 2
export const BP_PER_1_EP = 2

export function hpCost(hp: number): number {
  if (hp <= 0) return 0
  return Math.ceil((hp / 3) * BP_PER_3_HP)
}

export function epCost(ep: number): number {
  if (ep <= 0) return 0
  return ep * BP_PER_1_EP
}

export function attributesCost(totalAttributeLevels: number): number {
  return totalAttributeLevels * ATTRIBUTE_BP_PER_LEVEL
}

export function magicSchoolCost(totalSchoolLevels: number): number {
  return Math.max(0, totalSchoolLevels) * MAGIC_SCHOOL_BP_PER_LEVEL
}

export function magicMediumCost(totalMediumLevels: number): number {
  return Math.max(0, totalMediumLevels) * MAGIC_MEDIUM_BP_PER_LEVEL
}
