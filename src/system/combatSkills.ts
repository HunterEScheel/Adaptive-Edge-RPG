export interface CombatSkillDef {
  id: string
  name: string
  effect: string
}

export const COMBAT_SKILLS: readonly CombatSkillDef[] = [
  { id: 'combat-dodge', name: 'Dodge', effect: 'evasion +1' },
  { id: 'combat-parry', name: 'Parry', effect: '-1 attack (reaction)' },
  {
    id: 'combat-melee-1h',
    name: '1-handed melee',
    effect: 'Attack (action) +1',
  },
  {
    id: 'combat-fired-1h',
    name: '1-handed fired',
    effect: 'Attack (action) +1',
  },
  {
    id: 'combat-melee-2h',
    name: '2-handed melee',
    effect: 'Attack (action) +1',
  },
  {
    id: 'combat-fired-2h',
    name: '2-handed fired',
    effect: 'Attack (action) +1',
  },
  { id: 'combat-unarmed', name: 'Unarmed', effect: 'Attack (action) +1' },
  { id: 'combat-grapple', name: 'Grapple', effect: 'Attack (action) +1' },
  { id: 'combat-tackle', name: 'Tackle', effect: 'Attack (action) +1' },
] as const

export const COMBAT_SKILL_IDS = new Set(COMBAT_SKILLS.map((s) => s.id))

export function isCombatSkillId(id: string): boolean {
  return COMBAT_SKILL_IDS.has(id)
}
