import { MAGIC_MEDIUMS, type MagicMedium } from '../system/magicSchools'
import { NumberStepper } from './NumberStepper'

interface Props {
  value: Record<MagicMedium, number>
  onChange: (next: Record<MagicMedium, number>) => void
}

export function MagicMediumsEditor({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {MAGIC_MEDIUMS.map((medium) => (
        <NumberStepper
          key={medium}
          label={medium}
          value={value[medium]}
          onChange={(v) => onChange({ ...value, [medium]: v })}
          min={0}
          max={5}
        />
      ))}
    </div>
  )
}
