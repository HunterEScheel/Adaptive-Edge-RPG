import { ATTRIBUTES, type AttributeName } from '../system/attributes'
import { NumberStepper } from './NumberStepper'

interface Props {
  value: Record<AttributeName, number>
  onChange: (next: Record<AttributeName, number>) => void
}

export function AttributesEditor({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {ATTRIBUTES.map((attr) => (
        <NumberStepper
          key={attr}
          label={attr}
          value={value[attr]}
          onChange={(v) => onChange({ ...value, [attr]: v })}
          min={-5}
          max={5}
        />
      ))}
    </div>
  )
}
