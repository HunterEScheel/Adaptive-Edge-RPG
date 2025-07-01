import { deletePreset, getPresetById, getPresets, savePreset } from "@/services/characterPresets";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { DELETE_PRESET, FETCH_PRESETS, LOAD_PRESET, SAVE_PRESET } from "../actions";
import { setPresets } from "../reducers/presetReducer";
import { RootState } from "../rootReducer";
import { Character, setCharacter } from "../slices/characterSlice";

// Fetch all presets from Supabase
function* fetch(): Generator<any, void, any> {
    try {
        // Call the service method to get presets
        const response = yield call(getPresets);

        if (response.success) {
            // If successful, update the Redux store with the fetched presets

            yield put(setPresets(response.data));
        } else {
            console.error("Error fetching presets:", response.error);
            // You can dispatch an error action here if you have one
        }
    } catch (error) {
        console.error("Exception in fetchPresets saga:", error);
        // You can dispatch an error action here if you have one
    }
}

// Delete a preset by ID
function* deletePresetById(action: PayloadAction<Character>): Generator<any, void, any> {
    try {
        const presetId = action.payload.base.id;
        const response = yield call(deletePreset, presetId.toString());

        if (response.success) {
            // Refresh presets after deletion
            yield call(fetch);
        } else {
            console.error("Error deleting preset:", response.error);
        }
    } catch (error) {
        console.error("Exception in deletePreset saga:", error);
    }
}

// Save current character as a preset
interface SavePresetPayload {
    character: Character;
    presetName?: string;
    description?: string;
    tags?: string[];
}

function* save(action: PayloadAction<SavePresetPayload>): Generator<any, void, any> {
    try {
        // Get the current character from the store if not provided in action

        const character = yield select((state: RootState) => state.character);

        if (!character) {
            console.error("No character provided to savePreset saga");
            return;
        }

        const presetName = action.payload.presetName || character.base.name || "Unnamed Character";
        const description = action.payload.description || "";
        const tags = action.payload.tags || [];

        const response = yield call(savePreset, presetName, description, character);

        if (response.success) {
            // Refresh presets after saving
            yield call(fetch);
        } else {
            console.error("Error saving preset:", response.error);
        }
    } catch (error) {
        console.error("Exception in savePreset saga:", error);
    }
}

// Load a preset by ID
function* load(action: PayloadAction<number>): Generator<any, void, any> {
    try {
        const presetId = action.payload;
        const response = yield call(getPresetById, presetId.toString());

        if (response.success && response.data) {
            // Set the loaded character as the current character in the store
            yield put(setCharacter(response.data));
        } else {
            console.error("Error loading preset:", response.error);
        }
    } catch (error) {
        console.error("Exception in loadPreset saga:", error);
    }
}

// Root saga that combines all sagas for presets
export function* presetSaga(): Generator<any, void, any> {
    yield takeEvery(FETCH_PRESETS, fetch);
    yield takeEvery(DELETE_PRESET, deletePresetById);
    yield takeEvery(SAVE_PRESET, save);
    yield takeEvery(LOAD_PRESET, load);
}
