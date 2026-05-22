import { ATTRIBUTES, type AttributeName } from './attributes'
import { COMBAT_SKILLS, isCombatSkillId } from './combatSkills'
import { flawRefundTotal, type Flaw } from './flaws'
import type {
  ArmorReductionDie,
  DamageType,
  InventoryItem,
} from './inventory'
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
import type { SavedSpell } from './spells'

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
  savedSpells: SavedSpell[]
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
    savedSpells: [],
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

// Migration map for the medium rename/consolidation.
const LEGACY_MEDIUM_MIGRATION: Record<string, MagicMedium> = {
  Temperature: 'Elemental',
  Earth: 'Elemental',
  Luminance: 'Elemental',
  Weather: 'Elemental',
  Resonance: 'Magic',
  Poison: 'Toxicity',
  Acid: 'Toxicity',
  Body: 'Material',
  Object: 'Material',
}

// Legacy attribute renames: Lore/Wit → Intelligence, Awareness/Intuition → Sense.
const LEGACY_ATTRIBUTE_RENAMES: Record<string, AttributeName> = {
  Lore: 'Intelligence',
  Wit: 'Intelligence',
  Awareness: 'Sense',
  Intuition: 'Sense',
}

function migrateAttributes(
  raw: Partial<Record<string, number>> | undefined,
): Record<AttributeName, number> {
  const result = Object.fromEntries(
    ATTRIBUTES.map((a) => [a, 0]),
  ) as Record<AttributeName, number>
  if (!raw) return result
  const VALID = new Set<string>(ATTRIBUTES)
  for (const [key, levelRaw] of Object.entries(raw)) {
    const level = levelRaw ?? 0
    if (VALID.has(key)) {
      result[key as AttributeName] = level
      continue
    }
    const renamed = LEGACY_ATTRIBUTE_RENAMES[key]
    if (renamed) {
      result[renamed] = level
    }
  }
  return result
}

function migrateMediums(
  raw: Partial<Record<string, number>> | undefined,
): Record<MagicMedium, number> {
  const result = Object.fromEntries(
    MAGIC_MEDIUMS.map((m) => [m, 0]),
  ) as Record<MagicMedium, number>
  if (!raw) return result
  const VALID = new Set<string>(MAGIC_MEDIUMS)
  for (const [key, levelRaw] of Object.entries(raw)) {
    const level = levelRaw ?? 0
    if (level === 0) continue
    if (VALID.has(key)) {
      const k = key as MagicMedium
      result[k] = Math.max(result[k], level)
      continue
    }
    const mapped = LEGACY_MEDIUM_MIGRATION[key]
    if (mapped) {
      result[mapped] = Math.max(result[mapped], level)
    }
  }
  return result
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
    savedSpells: (c.savedSpells ?? []).map((s) => ({
      ...s,
      medium:
        MAGIC_MEDIUMS.includes(s.medium as MagicMedium)
          ? s.medium
          : (LEGACY_MEDIUM_MIGRATION[s.medium] ?? s.medium),
    })),
    magicMediums: migrateMediums(c.magicMediums),
    attributes: migrateAttributes(c.attributes),
    skills: [...combatRows, ...custom],
  }
}

export function combatSkillLevel(c: Character, id: string): number {
  return c.skills.find((s) => s.id === id)?.level ?? 0
}

export interface MatchingArmor {
  itemId: string
  itemName: string
  die: ArmorReductionDie
  threshold: number
  durability: number
}

// Returns equipped armor pieces that reduce the given damage type — useful
// so the UI can tell the player which physical dice to roll.
export function matchingArmorFor(
  c: Character,
  type: DamageType,
): MatchingArmor[] {
  return (c.inventory ?? [])
    .filter(
      (i) => i.equipped && i.armor && i.armor.reductionTypes.includes(type),
    )
    .map((i) => ({
      itemId: i.id,
      itemName: i.name || 'Unnamed armor',
      die: i.armor!.reductionDie,
      threshold: i.armor!.damageThreshold,
      durability: i.armor!.durability,
    }))
}

export interface DamageOutcome {
  rawDamage: number
  type: DamageType
  reduction: number
  netDamage: number
  hpBefore: number
  hpAfter: number
  durabilityChanges: {
    itemId: string
    itemName: string
    delta: number
    newDurability: number
    broke: boolean
  }[]
}

// Apply typed damage with a player-supplied reduction value (rolled in
// meatspace). Each piece of equipped armor matching the damage type whose
// threshold is exceeded loses floor(damage / threshold) durability. Broken
// armor (durability 0) auto-unequips.
export function applyTypedDamage(
  c: Character,
  amount: number,
  type: DamageType,
  reduction: number,
): { next: Character; outcome: DamageOutcome } {
  const inv = c.inventory ?? []
  const safeReduction = Math.max(0, Math.floor(reduction))
  const netDamage = Math.max(0, amount - safeReduction)
  const hpBefore = c.currentHp
  const hpAfter = Math.max(0, hpBefore - netDamage)

  const durabilityChanges: DamageOutcome['durabilityChanges'] = []
  const nextInventory = inv.map((i) => {
    if (!i.armor || !i.equipped) return i
    if (!i.armor.reductionTypes.includes(type)) return i
    const threshold = i.armor.damageThreshold
    if (threshold <= 0 || amount <= threshold) return i
    const loss = Math.floor(amount / threshold)
    if (loss <= 0) return i
    const newDurability = Math.max(0, i.armor.durability - loss)
    const broke = newDurability === 0
    durabilityChanges.push({
      itemId: i.id,
      itemName: i.name || 'Unnamed armor',
      delta: -loss,
      newDurability,
      broke,
    })
    return {
      ...i,
      armor: { ...i.armor, durability: newDurability },
      equipped: broke ? false : i.equipped,
    }
  })

  return {
    next: { ...c, currentHp: hpAfter, inventory: nextInventory },
    outcome: {
      rawDamage: amount,
      type,
      reduction: safeReduction,
      netDamage,
      hpBefore,
      hpAfter,
      durabilityChanges,
    },
  }
}

// Sum of evasion reduction from equipped armor items.
export function equippedArmorEvasionReduction(c: Character): number {
  return (c.inventory ?? [])
    .filter((i) => i.armor && i.equipped)
    .reduce((sum, i) => sum + (i.armor?.evasionReduction ?? 0), 0)
}

// Evasion = 10 + Agility + Dodge skill level − armor modifier − equipped armor
export function evasion(c: Character): number {
  const agility = c.attributes['Agility'] ?? 0
  const dodge = combatSkillLevel(c, 'combat-dodge')
  return (
    10 +
    agility +
    dodge -
    (c.armorModifier ?? 0) -
    equippedArmorEvasionReduction(c)
  )
}
