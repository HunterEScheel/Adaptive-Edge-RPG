import { useState } from 'react'
import {
  ARMOR_REDUCTION_DICE,
  DAMAGE_TYPES,
  WEAPON_CATEGORIES,
  newArmorStats,
  newInventoryItem,
  type ArmorReductionDie,
  type ArmorStats,
  type DamageType,
  type InventoryItem,
  type WeaponCategory,
  weaponCategoryLabel,
} from '../system/inventory'

interface Props {
  value: InventoryItem[]
  onChange: (next: InventoryItem[]) => void
}

export function InventoryEditor({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (id: string, open?: boolean) =>
    setExpanded((s) => {
      const next = new Set(s)
      const shouldOpen = open ?? !next.has(id)
      if (shouldOpen) next.add(id)
      else next.delete(id)
      return next
    })

  const add = () => {
    const item = newInventoryItem()
    onChange([...value, item])
    setExpanded((s) => new Set(s).add(item.id))
  }
  const update = (id: string, patch: Partial<InventoryItem>) =>
    onChange(value.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  const remove = (id: string) => {
    onChange(value.filter((i) => i.id !== id))
    setExpanded((s) => {
      const next = new Set(s)
      next.delete(id)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <p className="text-sm text-zinc-500 italic">Empty.</p>
      ) : (
        <ul className="space-y-2">
          {value.map((item) => {
            const isOpen = expanded.has(item.id)
            return (
              <li
                key={item.id}
                className="rounded border border-zinc-800 bg-zinc-900"
              >
                {isOpen ? (
                  <ItemEditor
                    item={item}
                    onChange={(patch) => update(item.id, patch)}
                    onRemove={() => remove(item.id)}
                    onClose={() => toggle(item.id, false)}
                  />
                ) : (
                  <ItemRow
                    item={item}
                    onOpen={() => toggle(item.id, true)}
                  />
                )}
              </li>
            )
          })}
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

interface ItemRowProps {
  item: InventoryItem
  onOpen: () => void
}

function ItemRow({ item, onOpen }: ItemRowProps) {
  const typeBadge = item.weaponCategory
    ? weaponCategoryLabel(item.weaponCategory)
    : item.armor
      ? `Armor 1${item.armor.reductionDie}`
      : null
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-zinc-800/60 rounded"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-100 truncate">
            {item.name || <span className="italic text-zinc-500">Unnamed</span>}
          </span>
          {typeBadge && (
            <span
              className={
                'text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 border ' +
                (item.equipped
                  ? 'border-amber-500 bg-amber-900/30 text-amber-200'
                  : 'border-zinc-700 bg-zinc-950 text-zinc-400')
              }
            >
              {item.equipped ? 'Equipped · ' : ''}
              {typeBadge}
            </span>
          )}
        </div>
        {item.notes && (
          <div className="text-xs text-zinc-500 truncate">{item.notes}</div>
        )}
      </div>
      <span className="text-xs font-mono text-zinc-400">×{item.quantity}</span>
      <span className="text-zinc-500 text-sm">▸</span>
    </button>
  )
}

interface ItemEditorProps {
  item: InventoryItem
  onChange: (patch: Partial<InventoryItem>) => void
  onRemove: () => void
  onClose: () => void
}

function ItemEditor({ item, onChange, onRemove, onClose }: ItemEditorProps) {
  const itemKind: 'none' | 'weapon' | 'armor' = item.weaponCategory
    ? 'weapon'
    : item.armor
      ? 'armor'
      : 'none'

  const setArmor = (patch: Partial<ArmorStats>) => {
    onChange({ armor: { ...(item.armor ?? newArmorStats()), ...patch } })
  }

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <input
          value={item.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Item name"
          autoFocus
          className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100"
        />
        <input
          type="number"
          min={0}
          value={item.quantity}
          onChange={(e) =>
            onChange({
              quantity: Math.max(0, Number(e.target.value) || 0),
            })
          }
          className="w-20 bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 text-right font-mono"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          Category
          <select
            value={
              item.weaponCategory ?? (item.armor ? 'armor' : 'misc')
            }
            onChange={(e) => {
              const v = e.target.value
              if (v === 'armor') {
                onChange({
                  weaponCategory: undefined,
                  armor: item.armor ?? newArmorStats(),
                })
              } else if (v === 'misc') {
                onChange({
                  weaponCategory: undefined,
                  armor: undefined,
                  equipped: false,
                })
              } else {
                onChange({
                  weaponCategory: v as WeaponCategory,
                  armor: undefined,
                })
              }
            }}
            className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
          >
            <option value="misc">— misc —</option>
            {WEAPON_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
            <option value="armor">Armor</option>
          </select>
        </label>
        {itemKind !== 'none' && (
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={Boolean(item.equipped)}
              onChange={(e) => onChange({ equipped: e.target.checked })}
              className="accent-amber-500"
            />
            Equipped
          </label>
        )}
      </div>
      {itemKind === 'armor' && item.armor && (
        <div className="rounded border border-zinc-800 bg-zinc-950 p-3 space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <label className="flex flex-col gap-1 text-xs text-zinc-400">
              Reduction die
              <select
                value={item.armor.reductionDie}
                onChange={(e) =>
                  setArmor({ reductionDie: e.target.value as ArmorReductionDie })
                }
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100"
              >
                {ARMOR_REDUCTION_DICE.map((d) => (
                  <option key={d} value={d}>
                    1{d}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-400">
              Damage threshold
              <input
                type="number"
                min={0}
                value={item.armor.damageThreshold}
                onChange={(e) =>
                  setArmor({
                    damageThreshold: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 text-right font-mono"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-400">
              Durability
              <input
                type="number"
                min={0}
                value={item.armor.durability}
                onChange={(e) =>
                  setArmor({
                    durability: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 text-right font-mono"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-400">
              Evasion reduction
              <input
                type="number"
                min={0}
                value={item.armor.evasionReduction}
                onChange={(e) =>
                  setArmor({
                    evasionReduction: Math.max(
                      0,
                      Number(e.target.value) || 0,
                    ),
                  })
                }
                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 text-right font-mono"
              />
            </label>
          </div>
          <div>
            <div className="text-xs text-zinc-400 mb-1">Reduces damage of</div>
            <div className="flex flex-wrap gap-1">
              {DAMAGE_TYPES.map((t) => {
                const active = item.armor!.reductionTypes.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setArmor({
                        reductionTypes: active
                          ? item.armor!.reductionTypes.filter(
                              (x: DamageType) => x !== t,
                            )
                          : [...item.armor!.reductionTypes, t],
                      })
                    }
                    className={
                      'rounded px-2 py-0.5 text-xs border ' +
                      (active
                        ? 'border-emerald-500 bg-emerald-900/30 text-emerald-200'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500')
                    }
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
      <input
        value={item.notes ?? ''}
        onChange={(e) => onChange({ notes: e.target.value })}
        placeholder="Notes (optional)"
        className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-1 text-xs text-zinc-300 placeholder:text-zinc-600"
      />
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-zinc-500 hover:text-rose-400"
        >
          Remove
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-medium text-zinc-950"
        >
          Save
        </button>
      </div>
    </div>
  )
}
