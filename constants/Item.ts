import { eDamageDice, ePlayerStat } from "./Stats";

type ArmorStatUpdates = {
  damageReduction: "d4" | "d6" | "d8" | "d10";
  threshold: number;
  durability: number;
  evasionReduction: number;
};

export interface Armor {
  name: string;
  id: number;
  armorClassification: "Unarmored" | "Light" | "Reinforced" | "Medium" | "Heavy" | "Fortified";
  enchantmentBonus?: 1 | 2 | 3;
  statUpdates?: ArmorStatUpdates;
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
  weaponHeft?: "Unarmed" | "2H" | "1H" | "V"; // Weapon classification for skill matching
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
