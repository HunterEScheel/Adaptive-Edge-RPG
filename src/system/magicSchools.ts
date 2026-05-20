export const MAGIC_SCHOOLS = [
  'Destroy',
  'Create',
  'Dominate',
  'Alter',
  'Restore',
  'Divine',
  'Control',
  'Summon',
] as const

export const MAGIC_MEDIUMS = [
  'Temperature',
  'Kinetic',
  'Resonance',
  'Luminance',
  'Earth',
  'Vitality',
  'Cognition',
  'Poison',
  'Acid',
  'Weather',
  'Magic',
  'Body',
  'Object',
  'Space',
] as const

export type MagicSchool = (typeof MAGIC_SCHOOLS)[number]
export type MagicMedium = (typeof MAGIC_MEDIUMS)[number]
