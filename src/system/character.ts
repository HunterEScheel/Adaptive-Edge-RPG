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
  attributeCost,
  DEFAULT_SPEED,
  epCost,
  hpCost,
  magicMediumCost,
  magicSchoolCost,
  skillCost,
  speedCost,
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
  speed: number
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
  armorModifier: number
}

export interface BPBreakdown {
  hp: number
  ep: number
  speed: number
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
    speed: DEFAULT_SPEED,
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
    armorModifier: 0,
  }
}

export function bpBreakdown(c: Character): BPBreakdown {
  const skills = c.skills.reduce((sum, s) => sum + skillCost(s.level), 0)
  const hp = hpCost(c.hp)
  const ep = epCost(c.ep)
  const speed = speedCost(c.speed ?? DEFAULT_SPEED)
  const attributes = Object.values(c.attributes).reduce(
    (sum, v) => sum + attributeCost(v),
    0,
  )
  const magicSchools = Object.values(c.magicSchools).reduce(
    (sum, v) => sum + magicSchoolCost(v),
    0,
  )
  const magicMediums = Object.values(c.magicMediums).reduce(
    (sum, v) => sum + magicMediumCost(v),
    0,
  )
  const tetherRefund = tetherRefundTotal(c.tethers ?? [])
  const flawRefund = flawRefundTotal(c.flaws ?? [])
  const obligationWeight = tetherObligationWeight(c.tethers ?? [])
  const effectiveBudget =
    c.bpBudget + (c.bonusBp ?? 0) + tetherRefund + flawRefund
  return {
    hp,
    ep,
    speed,
    attributes,
    magicSchools,
    magicMediums,
    skills,
    total:
      hp + ep + speed + attributes + magicSchools + magicMediums + skills,
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
    speed: c.speed ?? DEFAULT_SPEED,
    tethers: c.tethers ?? [],
    flaws: c.flaws ?? [],
    obligationThreshold: c.obligationThreshold ?? 0,
    gold: c.gold ?? 0,
    inventory: c.inventory ?? [],
    armorModifier: c.armorModifier ?? 0,
    skills: [...combatRows, ...custom],
  }
}

export function combatSkillLevel(c: Character, id: string): number {
  return c.skills.find((s) => s.id === id)?.level ?? 0
}

// Evasion = 10 + Agility + Dodge skill level − armor modifier
export function evasion(c: Character): number {
  const agility = c.attributes['Agility'] ?? 0
  const dodge = combatSkillLevel(c, 'combat-dodge')
  return 10 + agility + dodge - (c.armorModifier ?? 0)
}
