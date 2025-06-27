import { ePlayerStat } from "@/constants/Stats";
import { Character } from "@/store/slices/characterSlice";

export const calculateTotalEvasion = (character: Character) => {
    const base_evasion = 10 + character.base.dex;
    const evasion_equipment =
        character.inventory?.equipment
            ?.filter((x) => x.statEffected === ePlayerStat.evasion && (!x.requiresAttunement || x.attunement) && x.equipped)
            .reduce((total, item) => total + (item.statModifier || 0), 0) || 0;
    let evasion = character.skills?.dodge || 0;

    // Apply dodge reduction from armor
    const reductionFromArmor = character.inventory?.armor?.statUpdates?.evasionReduction || 0;

    return base_evasion + evasion_equipment + evasion - reductionFromArmor;
};

export const calculateTotalMaxHP = (character: Character) => {
    const base_hp = character.base.maxHitPoints;
    const con_hp = character.base.con * 5;
    return base_hp + con_hp;
};

export const calculateTotalDamageReduction = (character: Character) => {
    const armorDR = character.inventory?.armor?.statUpdates?.damageReduction || 0;
    const enchantmentBonus = character.inventory?.armor?.enchantmentBonus || 0;
    return armorDR + enchantmentBonus;
};
