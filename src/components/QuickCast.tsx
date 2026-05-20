import { useMemo, useState } from 'react'
import {
  CASTING_TIMES,
  EP_PER_DAMAGE_DIE,
  SPELL_CRITERIA,
  emptySpellDraft,
  spellCost,
  type CriterionKey,
} from '../system/spells'
import {
  MAGIC_MEDIUMS,
  MAGIC_SCHOOLS,
  type MagicMedium,
  type MagicSchool,
} from '../system/magicSchools'

interface Props {
  schools: Record<MagicSchool, number>
  mediums: Record<MagicMedium, number>
  currentEp: number
  onCast: (epCost: number) => void
}

export function QuickCast({ schools, mediums, currentEp, onCast }: Props) {
  const [draft, setDraft] = useState(emptySpellDraft)
  const [school, setSchool] = useState<MagicSchool | ''>('')
  const [medium, setMedium] = useState<MagicMedium | ''>('')

  const trainedSchools = useMemo(
    () => MAGIC_SCHOOLS.filter((s) => schools[s] > 0),
    [schools],
  )
  const trainedMediums = useMemo(
    () => MAGIC_MEDIUMS.filter((m) => mediums[m] > 0),
    [mediums],
  )

  const cost = useMemo(() => spellCost(draft), [draft])

  const setTier = (key: CriterionKey, tier: number) =>
    setDraft((d) => ({ ...d, tiers: { ...d.tiers, [key]: tier } }))
  const setDamage = (n: number) =>
    setDraft((d) => ({ ...d, damageDice: Math.max(0, n) }))
  const setTime = (k: typeof draft.castingTime) =>
    setDraft((d) => ({ ...d, castingTime: k }))

  const reset = () => setDraft(emptySpellDraft())

  const canCast =
    school !== '' &&
    medium !== '' &&
    cost.totalEp > 0 &&
    cost.totalEp <= currentEp

  const handleCast = () => {
    if (!canCast) return
    onCast(cost.totalEp)
    reset()
  }

  if (trainedSchools.length === 0 || trainedMediums.length === 0) {
    return (
      <p className="text-sm text-zinc-500 italic">
        Train at least one school and one medium to cast.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <PickerSelect
          label="School"
          value={school}
          options={trainedSchools.map((s) => ({
            value: s,
            label: `${s} (Lv ${schools[s]})`,
          }))}
          onChange={(v) => setSchool(v as MagicSchool)}
        />
        <PickerSelect
          label="Medium"
          value={medium}
          options={trainedMediums.map((m) => ({
            value: m,
            label: `${m} (Lv ${mediums[m]})`,
          }))}
          onChange={(v) => setMedium(v as MagicMedium)}
        />
      </div>

      {SPELL_CRITERIA.map((c) => (
        <TierRow
          key={c.key}
          label={c.label}
          epPerTier={c.epPerTier}
          tiers={c.tiers}
          value={draft.tiers[c.key]}
          onChange={(t) => setTier(c.key, t)}
        />
      ))}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs uppercase tracking-wide text-zinc-400">
              Damage dice (d6)
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {EP_PER_DAMAGE_DIE} EP per die
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDamage(draft.damageDice - 1)}
              className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30"
              disabled={draft.damageDice <= 0}
            >
              −
            </button>
            <input
              type="number"
              min={0}
              max={50}
              value={draft.damageDice}
              onChange={(e) => setDamage(Number(e.target.value) || 0)}
              className="w-16 text-center bg-zinc-900 border border-zinc-700 rounded px-1 py-1 text-zinc-100"
            />
            <button
              type="button"
              onClick={() => setDamage(draft.damageDice + 1)}
              className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wide text-zinc-400 block mb-1">
            Casting time
          </span>
          <select
            value={draft.castingTime}
            onChange={(e) => setTime(e.target.value as typeof draft.castingTime)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100"
          >
            {CASTING_TIMES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label} (×{t.multiplier})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded border border-zinc-800 bg-zinc-950 p-3 flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-500 font-mono">
          {cost.baseEp} base × {cost.multiplier} = {cost.totalEp} EP
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs text-zinc-300"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleCast}
            disabled={!canCast}
            title={
              cost.totalEp === 0
                ? 'Set at least one criterion or damage die'
                : cost.totalEp > currentEp
                  ? `Not enough EP (need ${cost.totalEp}, have ${currentEp})`
                  : school === ''
                    ? 'Pick a school'
                    : medium === ''
                      ? 'Pick a medium'
                      : undefined
            }
            className="rounded bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 text-sm font-medium text-zinc-950"
          >
            Cast (−{cost.totalEp} EP)
          </button>
        </div>
      </div>
    </div>
  )
}

interface PickerSelectProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}

function PickerSelect({ label, value, options, onChange }: PickerSelectProps) {
  return (
    <div>
      <span className="text-xs uppercase tracking-wide text-zinc-400 block mb-1">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100"
      >
        <option value="">— pick —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface TierRowProps {
  label: string
  epPerTier: number
  tiers: readonly string[]
  value: number
  onChange: (tier: number) => void
}

function TierRow({ label, epPerTier, tiers, value, onChange }: TierRowProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs uppercase tracking-wide text-zinc-400">
          {label}
        </span>
        <span className="text-xs text-zinc-500 font-mono">
          {epPerTier} EP / tier · {value * epPerTier} EP
        </span>
      </div>
      <div className="flex gap-1 mb-1">
        {tiers.map((_, tier) => {
          const active = tier === value
          return (
            <button
              key={tier}
              type="button"
              onClick={() => onChange(tier)}
              className={
                'flex-1 rounded px-2 py-1 text-xs border ' +
                (active
                  ? 'border-violet-500 bg-violet-900/30 text-violet-200'
                  : 'border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-500')
              }
            >
              {tier}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-zinc-500 italic min-h-[1lh]">{tiers[value]}</p>
    </div>
  )
}
