import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AbilitiesState } from "./abilitiesSlice";
import { BaseState } from "./baseSlice";
import { InventoryState } from "./inventorySlice";
import { MagicState } from "./magicSlice";
import { NotesState } from "./notesSlice";
import { SkillsState } from "./skillsSlice";

// Define the complete character state that combines all slices
export interface Character {
    base: BaseState;
    inventory: InventoryState;
    skills: SkillsState;
    abilities: AbilitiesState;
    magic: MagicState;
    notes: NotesState;
}

// Create a slice that handles operations on the entire character
const characterSlice = createSlice({
    name: "character",
    initialState: {} as Character,
    reducers: {
        // Set the entire character state at once (useful for loading saved characters)
        setCharacter: (state, action: PayloadAction<Character>) => {
            console.log(action.payload);
            state = action.payload;
        },

        // Reset the character to initial state (useful for creating a new character)
        resetCharacter: () => {
            return {} as Character;
        },

        // Perform a long rest that affects multiple slices
        longRest: (state) => {
            // Restore health and energy in base slice
            if (state.base) {
                state.base.hitPoints = state.base.maxHitPoints;
                state.base.energy = state.base.maxEnergy;
            }

            // Reset any per-rest abilities or resources in other slices if needed

            return state;
        },
    },
});

export const { setCharacter, resetCharacter, longRest } = characterSlice.actions;

export default characterSlice.reducer;
