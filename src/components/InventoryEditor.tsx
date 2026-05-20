import {
  newInventoryItem,
  type InventoryItem,
} from '../system/inventory'

interface Props {
  value: InventoryItem[]
  onChange: (next: InventoryItem[]) => void
}

export function InventoryEditor({ value, onChange }: Props) {
  const add = () => onChange([...value, newInventoryItem()])
  const update = (id: string, patch: Partial<InventoryItem>) =>
    onChange(value.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  const remove = (id: string) => onChange(value.filter((i) => i.id !== id))

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <p className="text-sm text-zinc-500 italic">Empty.</p>
      ) : (
        <ul className="space-y-2">
          {value.map((item) => (
            <li
              key={item.id}
              className="rounded border border-zinc-800 bg-zinc-900 p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <input
                  value={item.name}
                  onChange={(e) => update(item.id, { name: e.target.value })}
                  placeholder="Item name"
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100"
                />
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) =>
                    update(item.id, {
                      quantity: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-20 bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 text-right font-mono"
                />
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label="Remove item"
                  className="text-zinc-500 hover:text-rose-400 text-sm px-1"
                >
                  ✕
                </button>
              </div>
              <input
                value={item.notes ?? ''}
                onChange={(e) => update(item.id, { notes: e.target.value })}
                placeholder="Notes (optional)"
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1 text-xs text-zinc-300 placeholder:text-zinc-600"
              />
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={add}
        className="rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-sm text-zinc-200"
      >
        + Add item
      </button>
    </div>
  )
}
