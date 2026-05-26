import { useState } from 'react'
import {
  applyTypedDamage,
  matchingArmorFor,
  type Character,
  type DamageOutcome,
} from '../system/character'
import { DAMAGE_TYPES, type DamageType } from '../system/inventory'
interface Props {
  character: Character
  onApply: (next: Character) => void
}

export function TakeDamagePanel({ character, onApply }: Props) {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<DamageType>('Physical')
  const [reduction, setReduction] = useState('')
  const [last, setLast] = useState<DamageOutcome | null>(null)

  const matching = matchingArmorFor(character, type)

  const apply = () => {
    const n = Math.max(0, Math.floor(Number(amount) || 0))
    if (n === 0) return
    const r = Math.max(0, Math.floor(Number(reduction) || 0))
    const { next, outcome } = applyTypedDamage(character, n, type, r)
    onApply(next)
    setLast(outcome)
    setAmount('')
    setReduction('')
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs text-zinc-400">
          Damage
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 text-right font-mono"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-400">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DamageType)}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100"
          >
            {DAMAGE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-400">
          Reduction
          <input
            type="number"
            min={0}
            value={reduction}
            onChange={(e) => setReduction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') apply()
            }}
            placeholder="0"
            className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 text-right font-mono"
          />
        </label>
        <button
          type="button"
          onClick={apply}
          disabled={!amount || Number(amount) <= 0}
          className="rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 text-sm font-medium text-zinc-50"
        >
          Take damage
        </button>
      </div>

      {matching.length > 0 ? (
        <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-1">
          <span className="text-zinc-500">Roll:</span>
          {matching.map((m) => (
            <span
              key={m.itemId}
              title={`Threshold ${m.threshold} · Durability ${m.durability}`}
              className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5"
            >
              {m.itemName}{' '}
              <span className="font-mono text-emerald-300">1{m.die}</span>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-zinc-500 italic">
          No equipped armor reduces {type} damage.
        </div>
      )}

      {last && (
        <div className="rounded border border-zinc-800 bg-zinc-950 p-2 space-y-1 text-xs text-zinc-300">
          <div>
            <span className="font-mono text-rose-300">{last.rawDamage}</span>{' '}
            <span className="text-zinc-500">{last.type}</span>
            {last.reduction > 0 && (
              <>
                {' '}− armor{' '}
                <span className="font-mono text-emerald-300">
                  {last.reduction}
                </span>
              </>
            )}{' '}
            ={' '}
            <span className="font-mono text-rose-300">{last.netDamage}</span> to
            HP
          </div>
          {last.tempHpAbsorbed > 0 && (
            <div className="text-sky-300 font-mono">
              Temp HP {last.tempHpBefore} → {last.tempHpAfter}{' '}
              <span className="text-zinc-500">
                (absorbed {last.tempHpAbsorbed})
              </span>
            </div>
          )}
          <div className="text-zinc-500 font-mono">
            HP {last.hpBefore} → {last.hpAfter}
          </div>
          {last.durabilityChanges.length > 0 && (
            <ul className="text-[11px] text-amber-200 space-y-0.5">
              {last.durabilityChanges.map((d) => (
                <li key={d.itemId} className="font-mono">
                  {d.itemName}: {d.delta} durability → {d.newDurability}
                  {d.broke && (
                    <span className="text-rose-300"> · BROKEN, unequipped</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => setLast(null)}
            className="text-[11px] text-zinc-500 hover:text-zinc-300"
          >
            dismiss
          </button>
        </div>
      )}
    </div>
  )
}
