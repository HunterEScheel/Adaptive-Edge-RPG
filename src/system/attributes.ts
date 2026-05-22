export const ATTRIBUTES = [
  'Power',
  'Agility',
  'Lore',
  'Awareness',
  'Influence',
] as const

export type AttributeName = (typeof ATTRIBUTES)[number]
