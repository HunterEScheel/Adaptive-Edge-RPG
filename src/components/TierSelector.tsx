import { POWER_TIERS } from '../system/powerTiers'

interface TierSelectorProps {
  value: string
  onChange: (name: string, bp: number) => void
}

export function TierSelector({ value, onChange }: TierSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {POWER_TIERS.map((tier) => {
        const active = tier.name === value
        return (
          <button
            key={tier.name}
            type="button"
            onClick={() => onChange(tier.name, tier.playerBP)}
            className={
              'rounded border px-3 py-2 text-left transition ' +
              (active
                ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500')
            }
          >
            <div className="text-sm font-medium">{tier.name}</div>
            <div className="text-xs text-zinc-500 font-mono">
              {tier.playerBP} BP
            </div>
          </button>
        )
      })}
    </div>
  )
}
