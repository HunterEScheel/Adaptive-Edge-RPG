import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Stat = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface BaseState {
  id: number;
  name: string;
  buildPointsSpent: number;
  buildPointsRemaining: number;
  energy: number;
  maxEnergy: number;
  hitPoints: number;
  maxHitPoints: number;
  ac: number;
  movement: number;
  str: Stat;
  dex: Stat;
  con: Stat;
  int: Stat;
  foc: Stat;
  cha: Stat;
}

const initialState: BaseState = {
  id: 0,
  name: "",
  buildPointsSpent: 0,
  buildPointsRemaining: 100,
  energy: 10,
  maxEnergy: 10,
  hitPoints: 10,
  maxHitPoints: 10,
  ac: 10,
  movement: 30,
  str: 0,
  dex: 0,
  con: 0,
  int: 0,
  foc: 0,
  cha: 0
};

const baseSlice = createSlice({
  name: "base",
  initialState,
  reducers: {
    setBaseState: (state, action: PayloadAction<BaseState>) => {
      return action.payload;
    },
    updateField: (state, action: PayloadAction<{ field: keyof BaseState; value: any }>) => {
      const { field, value } = action.payload;
      return { ...state, [field]: value };
    },
    updateMultipleFields: (state, action: PayloadAction<{ field: keyof BaseState; value: any }[]>) => {
      let newState = { ...state };
      action.payload.forEach((update) => {
        newState = { ...newState, [update.field]: update.value };
      });
      return newState;
    },
    spendEnergy: (state, action: PayloadAction<number>) => {
      const energyCost = action.payload;
      if (state.energy >= energyCost) {
        state.energy -= energyCost;
      }
      return state;
    },
    restoreEnergy: (state, action: PayloadAction<number>) => {
      const energyRestored = action.payload;
      state.energy = Math.min(state.energy + energyRestored, state.maxEnergy);
      return state;
    },
    restoreHealth: (state, action: PayloadAction<number>) => {
      const healthRestored = action.payload;
      state.hitPoints = Math.min(state.hitPoints + healthRestored, state.maxHitPoints);
      return state;
    },
    takeDamage: (state, action: PayloadAction<number>) => {
      const damage = action.payload;
      state.hitPoints = Math.max(0, state.hitPoints - damage);
      return state;
    },
    longRest: (state) => {
      state.energy = state.maxEnergy;
      state.hitPoints = state.maxHitPoints;
      return state;
    }
  }
});

export const { 
  setBaseState, 
  updateField, 
  updateMultipleFields, 
  spendEnergy, 
  restoreEnergy,
  restoreHealth,
  takeDamage,
  longRest
} = baseSlice.actions;

export default baseSlice.reducer;
