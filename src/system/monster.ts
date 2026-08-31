import { ATTRIBUTES, type AttributeName } from './attributes'
import { COMBAT_SKILLS } from './combatSkills'
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
import type { DamageType } from './inventory'
import {
  MAGIC_MEDIUMS,
  MAGIC_SCHOOLS,
  type MagicMedium,
  type MagicSchool,
} from './magicSchools'
import {
  CASTING_TIMES,
  SPELL_CRITERIA,
  selectedOption,
  type SpellDraft,
} from './spells'

export interface MonsterAttack {
  id: string
  name: string
  hitBonus: number
  damage: string
  damageType: DamageType
  note: string
}

export interface MonsterSpell {
  id: string
  name: string
  school: MagicSchool
  medium: MagicMedium
  draft: SpellDraft
}

export interface Monster {
  name: string
  tierName: string
  bpBudget: number
  hp: number
  ep: number
  speed: number
  attributes: Record<AttributeName, number>
  magicSchools: Record<MagicSchool, number>
  magicMediums: Record<MagicMedium, number>
  combatSkills: Record<string, number>
  attacks: MonsterAttack[]
  spells: MonsterSpell[]
}

export function emptyMonster(tierName: string, bpBudget: number): Monster {
  return {
    name: '',
    tierName,
    bpBudget,
    hp: 0,
    ep: 0,
    speed: DEFAULT_SPEED,
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
    combatSkills: Object.fromEntries(COMBAT_SKILLS.map((c) => [c.id, 0])),
    attacks: [],
    spells: [],
  }
}

export interface MonsterBPBreakdown {
  hp: number
  ep: number
  speed: number
  attributes: number
  magic: number
  skills: number
  total: number
  remaining: number
}

export function monsterBpBreakdown(m: Monster): MonsterBPBreakdown {
  const hp = hpCost(m.hp)
  const ep = epCost(m.ep)
  const speed = speedCost(m.speed)
  const attributes = ATTRIBUTES.reduce(
    (sum, a) => sum + attributeCost(m.attributes[a]),
    0,
  )
  const magic =
    MAGIC_SCHOOLS.reduce((sum, s) => sum + magicSchoolCost(m.magicSchools[s]), 0) +
    MAGIC_MEDIUMS.reduce((sum, x) => sum + magicMediumCost(m.magicMediums[x]), 0)
  const skills = Object.values(m.combatSkills).reduce(
    (sum, lv) => sum + skillCost(lv),
    0,
  )
  const total = hp + ep + speed + attributes + magic + skills
  return {
    hp,
    ep,
    speed,
    attributes,
    magic,
    skills,
    total,
    remaining: m.bpBudget - total,
  }
}

export function monsterEvasion(m: Monster): number {
  return 10 + m.attributes.Agility + (m.combatSkills['combat-dodge'] ?? 0)
}

export function spellTargetingLabel(
  s: MonsterSpell,
  schools: Record<MagicSchool, number>,
  mediums: Record<MagicMedium, number>,
): string {
  const hit = (schools[s.school] ?? 0) + (mediums[s.medium] ?? 0)
  const targeting = s.draft.targeting ?? 'hit'
  if (targeting === 'hit') return `hit ${hit >= 0 ? '+' : ''}${hit}`
  const save =
    targeting === 'dodge' ? 'Dodge' : targeting === 'grit' ? 'Grit' : 'Resolve'
  return `${save} DC ${10 + hit}`
}

export function spellFactors(s: MonsterSpell): string[] {
  const factors: string[] = []
  for (const c of SPELL_CRITERIA) {
    const opt = selectedOption(c, s.draft.selections[c.key])
    if (opt) factors.push(opt.label)
  }
  if (s.draft.damageDice > 0) factors.push(`${s.draft.damageDice}d6`)
  const time = CASTING_TIMES.find((t) => t.key === s.draft.castingTime)
  if (time) factors.push(time.label)
  return factors
}
