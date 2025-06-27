export enum ePlayerStat {
    hp = 1,
    energy,
    bp,
    evasion,
    str,
    dex,
    con,
    foc,
    int,
    cha,
    movement,
}
export const pStatOptions = [
    { name: "None", value: 0 },
    { name: "Hit Points", value: 1 },
    { name: "Energy Points", value: 2 },
    { name: "Evasion", value: 4 },
    { name: "STR", value: 5 },
    { name: "DEX", value: 6 },
    { name: "CON", value: 7 },
    { name: "FOC", value: 8 },
    { name: "INT", value: 9 },
    { name: "CHA", value: 10 },
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
