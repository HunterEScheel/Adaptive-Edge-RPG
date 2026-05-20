export const WEAPON_CATEGORIES = [
  { key: 'melee-1h', label: 'Melee (1H)' },
  { key: 'melee-2h', label: 'Melee (2H)' },
  { key: 'fired-1h', label: 'Fired (1H)' },
  { key: 'fired-2h', label: 'Fired (2H)' },
] as const

export type WeaponCategory = (typeof WEAPON_CATEGORIES)[number]['key']

export function weaponCategoryLabel(key: WeaponCategory): string {
  return WEAPON_CATEGORIES.find((c) => c.key === key)?.label ?? key
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  notes?: string
  weaponCategory?: WeaponCategory
  equipped?: boolean
}

export function newInventoryItem(): InventoryItem {
  return {
    id: `item-${crypto.randomUUID()}`,
    name: '',
    quantity: 1,
  }
}
