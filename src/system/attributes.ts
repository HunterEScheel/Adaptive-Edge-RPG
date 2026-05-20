export const ATTRIBUTES = [
  'Power',
  'Agility',
  'Lore',
  'Intuition',
  'Influence',
] as const

export type AttributeName = (typeof ATTRIBUTES)[number]
