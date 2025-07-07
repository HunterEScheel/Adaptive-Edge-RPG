import { Armor, Consumable, Equipment, Weapon } from "@/constants/Item";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Simple ID generator function
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export interface InventoryState {
  weapons: Weapon[];
  equipment: Equipment[];
  consumables: Consumable[];
  armor: Armor;
  gold: number;
}

const initialState: InventoryState = {
  weapons: [],
  equipment: [],
  armor: {} as Armor,
  consumables: [],
  gold: 0,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventoryState: (state, action: PayloadAction<InventoryState>) => {
      return action.payload;
    },
    // Weapons
    addWeapon: (state, action: PayloadAction<Omit<Weapon, "id">>) => {
      state.weapons.push({ ...action.payload, id: generateId() });
      return state;
    },
    removeWeapon: (state, action: PayloadAction<string>) => {
      state.weapons = state.weapons.filter((weapon) => weapon.id !== action.payload);
      return state;
    },
    toggleEquipWeapon: (state, action: PayloadAction<string>) => {
      const weaponId = action.payload;
      const weaponIndex = state.weapons.findIndex((weapon) => weapon.id === weaponId);
      if (weaponIndex >= 0) {
        state.weapons[weaponIndex].equipped = !state.weapons[weaponIndex].equipped;
      }
      return state;
    },
    // Equipment
    addEquipment: (state, action: PayloadAction<Omit<Equipment, "id">>) => {
      state.equipment.push({ ...action.payload, id: generateId() });
      return state;
    },
    removeEquipment: (state, action: PayloadAction<string>) => {
      state.equipment = state.equipment.filter((equipment) => equipment.id !== action.payload);
      return state;
    },
    toggleEquipEquipment: (state, action: PayloadAction<string>) => {
      const equipmentId = action.payload;
      const equipmentIndex = state.equipment.findIndex((equipment) => equipment.id === equipmentId);
      if (equipmentIndex >= 0) {
        state.equipment[equipmentIndex].equipped = !state.equipment[equipmentIndex].equipped;
      }
      return state;
    },
    toggleAttunementEquipment: (state, action: PayloadAction<string>) => {
      const equipmentId = action.payload;
      const newEquipment = state.equipment.map((item: any) => (item.id === equipmentId ? { ...item, attune: !item.attune } : item));
      state.equipment = newEquipment;
      return state;
    },
    // Consumables
    addConsumable: (state, action: PayloadAction<Omit<Consumable, "id">>) => {
      // Check if a similar consumable already exists
      const existingIndex = state.consumables.findIndex((item) => item.name === action.payload.name);

      if (existingIndex >= 0) {
        // Increase quantity of existing item
        const qty = state.consumables[existingIndex].qty || 1;
        state.consumables[existingIndex].qty = qty + (action.payload.qty || 1);
      } else {
        // Add new consumable
        state.consumables.push({ ...action.payload, id: generateId() });
      }
      return state;
    },
    removeConsumable: (state, action: PayloadAction<string>) => {
      state.consumables = state.consumables.filter((consumable) => consumable.id !== action.payload);
      return state;
    },
    useConsumable: (state, action: PayloadAction<string>) => {
      const consumableId = action.payload;
      const consumableIndex = state.consumables.findIndex((consumable) => consumable.id === consumableId);

      if (consumableIndex >= 0) {
        const qty = state.consumables[consumableIndex].qty || 1;
        if (qty > 1) {
          // Decrease quantity
          state.consumables[consumableIndex].qty = qty - 1;
        } else {
          // Remove if last one
          state.consumables = state.consumables.filter((consumable) => consumable.id !== consumableId);
        }
      }
      return state;
    },
    // Gold
    updateGold: (state, action: PayloadAction<number>) => {
      state.gold = action.payload;
      return state;
    },
    addGold: (state, action: PayloadAction<number>) => {
      state.gold += action.payload;
      return state;
    },
    spendGold: (state, action: PayloadAction<number>) => {
      if (state.gold >= action.payload) {
        state.gold -= action.payload;
      }
      return state;
    },
    addArmor: (state, action: PayloadAction<Armor>) => {
      console.log(action.payload);
      state.armor = action.payload;
      return state;
    },
    removeArmor: (state) => {
      state.armor = {} as Armor;
      return state;
    },
    damageArmor: (state) => {
      state.armor.statUpdates!.durability -= 1;
      return state;
    },
    repairArmor: (state) => {
      state.armor.statUpdates!.durability += 1;
      return state;
    },
  },
});

export const {
  setInventoryState,
  addWeapon,
  removeWeapon,
  toggleEquipWeapon,
  addEquipment,
  removeEquipment,
  toggleEquipEquipment,
  toggleAttunementEquipment,
  addConsumable,
  removeConsumable,
  useConsumable,
  updateGold,
  addGold,
  spendGold,
  addArmor,
  removeArmor,
  damageArmor,
  repairArmor,
} = inventorySlice.actions;

export default inventorySlice.reducer;
