export interface InventoryItem {
  id: string
  name: string
  quantity: number
  notes?: string
}

export function newInventoryItem(): InventoryItem {
  return {
    id: `item-${crypto.randomUUID()}`,
    name: '',
    quantity: 1,
  }
}
