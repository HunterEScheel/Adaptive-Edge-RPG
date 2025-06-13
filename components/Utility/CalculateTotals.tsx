import { ePlayerStat } from "@/constants/Stats";
import { Character } from "@/store/slices/characterSlice";

export const calculateTotalAC = (character: Character) => {
    const base_AC = 10 + character.base.dex;
    const AC_equipment =
        character.inventory?.equipment
            ?.filter((x) => x.statEffected === ePlayerStat.ac && (!x.requiresAttunement || x.attunement) && x.equipped)
            .reduce((total, item) => total + (item.statModifier || 0), 0) || 0;
    const AC_items =
        character.inventory?.consumables?.filter((x) => x.statEffected === ePlayerStat.ac).reduce((total, item) => total + (item.statModifier || 0), 0) || 0;
    let AC_Dodge = character.skills?.dodge;
    if (character.inventory.armor.armorClassification === "Medium") AC_Dodge = Math.max(AC_Dodge - 1, 0);
    if (character.inventory.armor.armorClassification === "Heavy") AC_Dodge = 0;
    const armor_AC = character.inventory.armor.bonus + (character.inventory.armor.enchantmentBonus || 0) || 0;
    return base_AC + AC_equipment + AC_items + AC_Dodge + armor_AC;
};

export const calculateTotalMaxHP = (character: Character) => {
    const base_hp = character.base.maxHitPoints;
    const con_hp = character.base.con * 5;
    return base_hp + con_hp;
};
