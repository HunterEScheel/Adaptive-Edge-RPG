import { WeaponSkill } from "@/components/Combat/WeaponSkillsManager";
import { Skill } from "@/constants/Skills";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SkillsState {
  skills: Skill[];
  weaponSkills: WeaponSkill[];
  dodge: number;
  parry: number;
}

const initialState: SkillsState = {
  skills: [],
  weaponSkills: [],
  dodge: 0,
  parry: 0,
};

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    setSkillsState: (state, action: PayloadAction<SkillsState>) => {
      return action.payload;
    },
    // General skills
    updateSkills: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload;
      return state;
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.skills.push(action.payload);
      return state;
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter((skill) => skill.id !== action.payload);
      return state;
    },
    updateSkillLevel: (state, action: PayloadAction<{ id: string; level: number }>) => {
      const { id, level } = action.payload;
      const skillIndex = state.skills.findIndex((skill) => skill.id === id);
      if (skillIndex >= 0) {
        state.skills[skillIndex].level = level;
      }
      return state;
    },
    // Weapon skills
    updateWeaponSkills: (state, action: PayloadAction<WeaponSkill[]>) => {
      state.weaponSkills = action.payload;
      return state;
    },
    // Defensive skills
    updateDodge: (state, action: PayloadAction<number>) => {
      state.dodge = action.payload;
      return state;
    },
    updateParry: (state, action: PayloadAction<number>) => {
      state.parry = action.payload;
      return state;
    },
  },
});

export const { setSkillsState, updateSkills, addSkill, removeSkill, updateSkillLevel, updateWeaponSkills, updateDodge, updateParry } = skillsSlice.actions;

export default skillsSlice.reducer;
