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

export const ARMOR_REDUCTION_DICE = ['d4', 'd6', 'd8'] as const
export type ArmorReductionDie = (typeof ARMOR_REDUCTION_DICE)[number]

export const DAMAGE_TYPES = [
  'Physical',
  'Fire',
  'Cold',
  'Lightning',
  'Acid',
  'Poison',
  'Psychic',
  'Magical',
  'Force',
  'Sonic',
] as const
export type DamageType = (typeof DAMAGE_TYPES)[number]

export interface ArmorStats {
  reductionDie: ArmorReductionDie
  reductionTypes: DamageType[]
  damageThreshold: number
  durability: number
  evasionReduction: number
}

export function newArmorStats(): ArmorStats {
  return {
    reductionDie: 'd4',
    reductionTypes: ['Physical'],
    damageThreshold: 0,
    durability: 10,
    evasionReduction: 0,
  }
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  notes?: string
  weaponCategory?: WeaponCategory
  armor?: ArmorStats
  equipped?: boolean
}

export function newInventoryItem(): InventoryItem {
  return {
    id: `item-${crypto.randomUUID()}`,
    name: '',
    quantity: 1,
  }
}
