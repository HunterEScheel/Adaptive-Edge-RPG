import { eDamageDice, ePlayerStat } from "./Stats";

export interface Armor {
    name: string;
    id: number;
    armorClassification: "Light" | "Medium" | "Heavy";
    bonus: 1 | 2 | 3 | 4 | 5 | 6;
    enchantmentBonus?: 1 | 2 | 3;
}

export interface iItem {
    id: string;
    name: string;
    value: number;
    qty: number;
    class: eItemClassifications;
}
export interface Weapon extends iItem {
    requiresAttunement: boolean;
    attunement: boolean;
    damageDice: eDamageDice;
    damageDiceCount: number;
    versatile: boolean;
    twoHanded: boolean;
    charges: number;
    maxCharges: number;
    recharge: boolean;
    equipped?: boolean;
    attackBonus?: number;
    attribute?: "str" | "dex"; // Attribute that determines attack bonus: strength or dexterity
    weaponHeft?: "Unarmed" | "2-handed" | "1-handed" | "Versatile"; // Weapon classification for skill matching
    weaponType?: "Stab" | "Swing" | "Fire" | "Draw"; // Weapon type for skill matching
}

export interface Equipment extends iItem {
    requiresAttunement: boolean;
    attunement: boolean;
    statEffected: ePlayerStat;
    statModifier: number;
    charges: number;
    maxCharges: number;
    recharge: boolean;
    equipped?: boolean;
}

export interface Consumable extends iItem {
    statEffected: ePlayerStat;
    statModifier: number;
}

export enum eItemClassifications {
    equipment,
    weapon,
    consumable,
    armor,
    other,
}
export const itemClassifications = [
    { name: "Equipment", value: eItemClassifications.equipment },
    { name: "Weapon", value: eItemClassifications.weapon },
    { name: "Consumable", value: eItemClassifications.consumable },
    { name: "Armor", value: eItemClassifications.armor },
    { name: "Other", value: eItemClassifications.other },
];
