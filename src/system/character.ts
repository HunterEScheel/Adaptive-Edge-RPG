import { ATTRIBUTES, type AttributeName } from './attributes'
import { COMBAT_SKILLS, isCombatSkillId } from './combatSkills'
import { flawRefundTotal, type Flaw } from './flaws'
import type { InventoryItem } from './inventory'
import {
  MAGIC_MEDIUMS,
  MAGIC_SCHOOLS,
  type MagicMedium,
  type MagicSchool,
} from './magicSchools'
import {
  attributesCost,
  epCost,
  hpCost,
  magicMediumCost,
  magicSchoolCost,
  skillCost,
} from './costs'
import {
  tetherObligationWeight,
  tetherRefundTotal,
  type Tether,
} from './tethers'

export interface CharacterSkill {
  id: string
  name: string
  level: number
}

export interface Character {
  name: string
  tierName: string
  bpBudget: number
  bonusBp: number
  hp: number
  ep: number
  currentHp: number
  currentEp: number
  attributes: Record<AttributeName, number>
  magicSchools: Record<MagicSchool, number>
  magicMediums: Record<MagicMedium, number>
  skills: CharacterSkill[]
  tethers: Tether[]
  flaws: Flaw[]
  obligationThreshold: number
  gold: number
  inventory: InventoryItem[]
}

export interface BPBreakdown {
  hp: number
  ep: number
  attributes: number
  magicSchools: number
  magicMediums: number
  skills: number
  total: number
  tetherRefund: number
  flawRefund: number
  obligationWeight: number
  effectiveBudget: number
}

function seededCombatSkills(): CharacterSkill[] {
  return COMBAT_SKILLS.map((c) => ({ id: c.id, name: c.name, level: 0 }))
}

export function emptyCharacter(tierName: string, bpBudget: number): Character {
  return {
    name: '',
    tierName,
    bpBudget,
    bonusBp: 0,
    hp: 0,
    ep: 0,
    currentHp: 0,
    currentEp: 0,
    attributes: Object.fromEntries(ATTRIBUTES.map((a) => [a, 0])) as Record<
      AttributeName,
      number
    >,
    magicSchools: Object.fromEntries(MAGIC_SCHOOLS.map((s) => [s, 0])) as Record<
      MagicSchool,
      number
    >,
    magicMediums: Object.fromEntries(MAGIC_MEDIUMS.map((m) => [m, 0])) as Record<
      MagicMedium,
      number
    >,
    skills: seededCombatSkills(),
    tethers: [],
    flaws: [],
    obligationThreshold: 0,
    gold: 0,
    inventory: [],
  }
}

export function bpBreakdown(c: Character): BPBreakdown {
  const attrTotal = Object.values(c.attributes).reduce((a, b) => a + b, 0)
  const schoolTotal = Object.values(c.magicSchools).reduce((a, b) => a + b, 0)
  const mediumTotal = Object.values(c.magicMediums).reduce((a, b) => a + b, 0)
  const skills = c.skills.reduce((sum, s) => sum + skillCost(s.level), 0)
  const hp = hpCost(c.hp)
  const ep = epCost(c.ep)
  const attributes = attributesCost(attrTotal)
  const magicSchools = magicSchoolCost(schoolTotal)
  const magicMediums = magicMediumCost(mediumTotal)
  const tetherRefund = tetherRefundTotal(c.tethers ?? [])
  const flawRefund = flawRefundTotal(c.flaws ?? [])
  const obligationWeight = tetherObligationWeight(c.tethers ?? [])
  const effectiveBudget =
    c.bpBudget + (c.bonusBp ?? 0) + tetherRefund + flawRefund
  return {
    hp,
    ep,
    attributes,
    magicSchools,
    magicMediums,
    skills,
    total: hp + ep + attributes + magicSchools + magicMediums + skills,
    tetherRefund,
    flawRefund,
    obligationWeight,
    effectiveBudget,
  }
}

export function restoreToMax(c: Character): Character {
  return { ...c, currentHp: c.hp, currentEp: c.ep }
}

export function normalizeCurrentValues(c: Character): Character {
  return {
    ...c,
    currentHp: Math.max(0, Math.min(c.currentHp, c.hp)),
    currentEp: Math.max(0, Math.min(c.currentEp, c.ep)),
  }
}

export function ensureCombatSkills(c: Character): Character {
  const existing = new Map(c.skills.map((s) => [s.id, s]))
  const combatRows: CharacterSkill[] = COMBAT_SKILLS.map((def) => {
    const found = existing.get(def.id)
    return found
      ? { ...found, name: def.name }
      : { id: def.id, name: def.name, level: 0 }
  })
  const custom = c.skills.filter((s) => !isCombatSkillId(s.id))
  return {
    ...c,
    bonusBp: c.bonusBp ?? 0,
    tethers: c.tethers ?? [],
    flaws: c.flaws ?? [],
    obligationThreshold: c.obligationThreshold ?? 0,
    gold: c.gold ?? 0,
    inventory: c.inventory ?? [],
    skills: [...combatRows, ...custom],
  }
}
