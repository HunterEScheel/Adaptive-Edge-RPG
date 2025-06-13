import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Simple ID generator function
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export type FlawSeverity = "quirk" | "flaw" | "vice";

export type Flaw = {
  id: string;
  name: string;
  description: string;
  severity: FlawSeverity; // quirk: 10 BP, flaw: 25 BP, vice: 40 BP
};

export type Attack = {
  id: string;
  name: string;
  description: string;
  buildPointCost: number;
  energyCost: number;
};

export type Passive = {
  id: string;
  name: string;
  description: string;
  buildPointCost: number;
};

export interface AbilitiesState {
  flaws: Flaw[];
  attacks: Attack[];
  passives: Passive[];
}

const initialState: AbilitiesState = {
  flaws: [],
  attacks: [],
  passives: []
};

const abilitiesSlice = createSlice({
  name: "abilities",
  initialState,
  reducers: {
    setAbilitiesState: (state, action: PayloadAction<AbilitiesState>) => {
      return action.payload;
    },
    // Flaws
    addFlaw: (state, action: PayloadAction<Omit<Flaw, "id">>) => {
      const newFlaw = {
        ...action.payload,
        id: generateId()
      };
      state.flaws.push(newFlaw);
      return state;
    },
    removeFlaw: (state, action: PayloadAction<string>) => {
      state.flaws = state.flaws.filter(flaw => flaw.id !== action.payload);
      return state;
    },
    updateFlaw: (state, action: PayloadAction<{ id: string, name?: string, description?: string, severity?: FlawSeverity }>) => {
      const { id, ...updates } = action.payload;
      const flawIndex = state.flaws.findIndex(flaw => flaw.id === id);
      
      if (flawIndex >= 0) {
        state.flaws[flawIndex] = { ...state.flaws[flawIndex], ...updates };
      }
      return state;
    },
    // Attacks
    addAttack: (state, action: PayloadAction<Omit<Attack, "id">>) => {
      const newAttack = {
        ...action.payload,
        id: generateId()
      };
      state.attacks.push(newAttack);
      return state;
    },
    removeAttack: (state, action: PayloadAction<string>) => {
      state.attacks = state.attacks.filter(attack => attack.id !== action.payload);
      return state;
    },
    updateAttack: (state, action: PayloadAction<{ id: string, name?: string, description?: string, buildPointCost?: number, energyCost?: number }>) => {
      const { id, ...updates } = action.payload;
      const attackIndex = state.attacks.findIndex(attack => attack.id === id);
      
      if (attackIndex >= 0) {
        state.attacks[attackIndex] = { ...state.attacks[attackIndex], ...updates };
      }
      return state;
    },
    // Passives
    addPassive: (state, action: PayloadAction<Omit<Passive, "id">>) => {
      const newPassive = {
        ...action.payload,
        id: generateId()
      };
      state.passives.push(newPassive);
      return state;
    },
    removePassive: (state, action: PayloadAction<string>) => {
      state.passives = state.passives.filter(passive => passive.id !== action.payload);
      return state;
    },
    updatePassive: (state, action: PayloadAction<{ id: string, name?: string, description?: string, buildPointCost?: number }>) => {
      const { id, ...updates } = action.payload;
      const passiveIndex = state.passives.findIndex(passive => passive.id === id);
      
      if (passiveIndex >= 0) {
        state.passives[passiveIndex] = { ...state.passives[passiveIndex], ...updates };
      }
      return state;
    }
  }
});

export const {
  setAbilitiesState,
  addFlaw,
  removeFlaw,
  updateFlaw,
  addAttack,
  removeAttack,
  updateAttack,
  addPassive,
  removePassive,
  updatePassive
} = abilitiesSlice.actions;

export default abilitiesSlice.reducer;
