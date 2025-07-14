export enum ePlayerStat {
  hp = 1,
  energy,
  bp,
  evasion,
  pow,
  agi,
  lor,
  ins,
  inf,
  movement,
}
export const pStatOptions = [
  { name: "None", value: 0 },
  { name: "Hit Points", value: 1 },
  { name: "Energy Points", value: 2 },
  { name: "Evasion", value: 4 },
  { name: "POW", value: 5 },
  { name: "AGI", value: 6 },
  { name: "END", value: 7 },
  { name: "LOR", value: 8 },
  { name: "INS", value: 9 },
  { name: "INF", value: 10 },
  { name: "Movement Speed", value: 11 },
  { name: "Other/Spell", value: 12 },
];

export enum eDamageDice {
  d4 = 1,
  d6,
  d8,
  d10,
  d12,
  d20,
}

export enum eStatusCondition {
  prone,
  incapacitated,
}
