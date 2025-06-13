import { eDamageDice, ePlayerStat } from "./Stats";

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
  attribute?: 'str' | 'dex'; // Attribute that determines attack bonus: strength or dexterity
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
  other,
}
export const itemClassifications = [
  { name: "Equipment", value: eItemClassifications.equipment },
  { name: "Weapon", value: eItemClassifications.weapon },
  { name: "Consumable", value: eItemClassifications.consumable },
  { name: "Other", value: eItemClassifications.other },
];
