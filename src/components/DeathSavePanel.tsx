import { useState } from 'react'
import {
  expendEpToRevive,
  rollDeathSave,
  type Character,
} from '../system/character'

interface Props {
  character: Character
  onApply: (next: Character) => void
}

interface LastRoll {
  d20: number
  message: string
}

export function DeathSavePanel({ character, onApply }: Props) {
  const [last, setLast] = useState<LastRoll | null>(null)
  const { successes, failures } = character.deathSaves
  const stable = successes >= 3
  const dead = failures >= 3
  const finished = stable || dead

  const roll = () => {
    const d20 = Math.floor(Math.random() * 20) + 1
    const next = rollDeathSave(character, d20)
    onApply(next)
    let message: string
    if (d20 === 20) message = 'Critical — revived at 1 HP'
    else if (d20 === 1) message = '+2 failures'
    else if (d20 >= 10) message = 'Success'
    else message = 'Failure'
    setLast({ d20, message })
  }

  const burnEp = () => {
    onApply(expendEpToRevive(character))
    setLast(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-emerald-300">
            Successes
          </span>
          <Pips count={successes} color="emerald" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-rose-300">
            Failures
          </span>
          <Pips count={failures} color="rose" />
        </div>
      </div>

      {stable && (
        <div className="rounded border border-emerald-700/50 bg-emerald-900/30 px-3 py-2 text-sm text-emerald-200">
          Stable — unconscious but no longer dying.
        </div>
      )}
      {dead && (
        <div className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
          Dead.
        </div>
      )}

      {!finished && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={roll}
            className="rounded bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-sm font-medium text-zinc-50"
          >
            Roll death save (d20)
          </button>
          <button
            type="button"
            onClick={burnEp}
            disabled={character.currentEp <= 0}
            title={
              character.currentEp <= 0
                ? 'No EP to spend'
                : `Spend ${character.currentEp} EP to stand at 1 HP`
            }
            className="rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 text-sm font-medium text-zinc-950"
          >
            Spend all EP ({character.currentEp}) → 1 HP
          </button>
        </div>
      )}

      {last && (
        <div className="rounded border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-300 flex items-center justify-between gap-2">
          <span>
            Rolled <span className="font-mono text-amber-300">{last.d20}</span>{' '}
            — {last.message}
          </span>
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

function Pips({ count, color }: { count: number; color: 'emerald' | 'rose' }) {
  const filled =
    color === 'emerald'
      ? 'bg-emerald-500 border-emerald-400'
      : 'bg-rose-500 border-rose-400'
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={
            'h-4 w-4 rounded-full border ' +
            (i < count ? filled : 'border-zinc-700 bg-zinc-900')
          }
        />
      ))}
    </div>
  )
}
