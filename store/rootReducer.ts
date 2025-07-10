import { combineReducers } from "@reduxjs/toolkit";
import characterAuthReducer from "./characterAuthSlice";
import abilitiesReducer from "./slices/abilitiesSlice";
import baseReducer from "./slices/baseSlice";
import inventoryReducer from "./slices/inventorySlice";
import magicReducer from "./slices/magicSlice";
import notesReducer from "./slices/notesSlice";
import settingsReducer from "./slices/settingsSlice";
import skillsReducer from "./slices/skillsSlice";
import tethersReducer from "./slices/tethersSlice";

export type RootState = ReturnType<typeof rootReducer>;

// Combine all the slice reducers
const rootReducer = combineReducers({
    // New modular slices
    character: combineReducers({
        base: baseReducer,
        inventory: inventoryReducer,
        skills: skillsReducer,
        abilities: abilitiesReducer,
        magic: magicReducer,
        notes: notesReducer,
        tethers: tethersReducer,
    }),

    // Auth
    characterAuth: characterAuthReducer,

    // App settings
    settings: settingsReducer,
});

export default rootReducer;
