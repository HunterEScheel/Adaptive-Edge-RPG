// Spell scaling criteria from the Gurps & Dragons sheet.
// Each criterion has 6 tiers (0–5). Per-tier EP is in `epPerTier`.

export interface SpellCriterion {
  key: 'range' | 'aoe' | 'duration' | 'buffDebuff' | 'challenge'
  label: string
  epPerTier: number
  tiers: readonly string[]
}

export const SPELL_CRITERIA: readonly SpellCriterion[] = [
  {
    key: 'range',
    label: 'Range',
    epPerTier: 8,
    tiers: [
      'touch / 30 ft',
      '120 ft',
      '600 ft',
      '1 mile',
      'any distance',
      'cross-planar',
    ],
  },
  {
    key: 'aoe',
    label: 'AOE / Targets',
    epPerTier: 10,
    tiers: [
      'none, self, or single target',
      '20 ft splash · 60 ft line · split damage',
      '60 ft splash · 300 ft line · 3 targets',
      '120 ft splash · 600 ft line · 10 targets',
      '300 ft splash · 1 mile line',
      '100 targets',
    ],
  },
  {
    key: 'duration',
    label: 'Duration',
    epPerTier: 8,
    tiers: [
      'instantaneous',
      '1 minute (1 round concentration)',
      '1 hour (1 minute concentration)',
      '1 day (1 hour concentration)',
      '1 year',
      'permanent',
    ],
  },
  {
    key: 'buffDebuff',
    label: 'Buff / Debuff',
    epPerTier: 10,
    tiers: [
      '—',
      'darkvision · +2 skill · poisoned · deafened · grappled · slowed · 1-sense illusions · reincarnation',
      'tremorsense · +5 skill · prone · frightened · illness · multi-sense illusions · undeath · exhaustion',
      'truesight · total evasion · restrained · blinded · silenced · charmed · disability · resurrection',
      'stunned · paralyzed · incapacitated · banished · dominated · polymorphed · total knowledge · true resurrection',
      'petrification · soul-bound · death · True Resurrection',
    ],
  },
  {
    key: 'challenge',
    label: 'Challenge',
    epPerTier: 15,
    tiers: ['150 BP', '400 BP', '1 000 BP', '2 500 BP', '5 000 BP', '10 000 BP'],
  },
] as const

export type CriterionKey = SpellCriterion['key']

export interface CastingTimeOption {
  key: 'reaction' | 'action' | '2actions' | '1minute' | '1hour'
  label: string
  multiplier: number
}

export const CASTING_TIMES: readonly CastingTimeOption[] = [
  { key: 'reaction', label: 'Reaction', multiplier: 4 },
  { key: 'action', label: 'Action', multiplier: 2 },
  { key: '2actions', label: '2 Actions', multiplier: 1 },
  { key: '1minute', label: '1 Minute', multiplier: 0.5 },
  { key: '1hour', label: '1 Hour', multiplier: 0.25 },
] as const

export const EP_PER_DAMAGE_DIE = 1

export interface SpellDraft {
  tiers: Record<CriterionKey, number>
  damageDice: number
  castingTime: CastingTimeOption['key']
}

export function emptySpellDraft(): SpellDraft {
  return {
    tiers: {
      range: 0,
      aoe: 0,
      duration: 0,
      buffDebuff: 0,
      challenge: 0,
    },
    damageDice: 0,
    castingTime: '2actions',
  }
}

export interface SpellCost {
  baseEp: number
  multiplier: number
  totalEp: number
}

export function spellCost(draft: SpellDraft): SpellCost {
  const criteriaEp = SPELL_CRITERIA.reduce(
    (sum, c) => sum + draft.tiers[c.key] * c.epPerTier,
    0,
  )
  const damageEp = draft.damageDice * EP_PER_DAMAGE_DIE
  const baseEp = criteriaEp + damageEp
  const time =
    CASTING_TIMES.find((t) => t.key === draft.castingTime) ?? CASTING_TIMES[2]
  const totalEp = Math.ceil(baseEp * time.multiplier)
  return { baseEp, multiplier: time.multiplier, totalEp }
}
