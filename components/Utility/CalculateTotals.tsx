import { ePlayerStat } from "@/constants/Stats";
import { Character } from "@/store/reducers/characterReducer";

export const calculateTotalAC = (character: Character) => {
  const base_AC = character.ac;
  const AC_equipment = character.items.equipment.filter((x) => x.statEffected === ePlayerStat.ac && (!x.requiresAttunement || x.attunement) && x.equipped).reduce((total, item) => total + (item.statModifier || 0), 0);
  const AC_items = character.items.consumables.filter((x) => x.statEffected === ePlayerStat.ac).reduce((total, item) => total + (item.statModifier || 0), 0);
  const AC_skills = character.skills.filter((x) => x.statModified === ePlayerStat.ac).reduce((total, skill) => total + (skill.modificationLevel || 0), 0);
  return base_AC + AC_equipment + AC_items + AC_skills;
};

export const calculateTotalMaxHP = (character: Character) => {
  const base_hp = character.maxHitPoints;
  const con_hp = character.con * 5;
  return base_hp + con_hp;
};
