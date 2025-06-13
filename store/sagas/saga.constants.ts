import { characterPresetsService } from "@/services/characterPresets";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { DELETE_PRESET, FETCH_PRESETS, LOAD_PRESET, SAVE_PRESET } from "../actions";
import { Character, setCharacter } from "../reducers/characterReducer";
import { setPresets } from "../reducers/presetReducer";

// Fetch all presets from Supabase
function* fetchPresets(): Generator<any, void, any> {
  try {
    // Call the service method to get presets
    const response = yield call(characterPresetsService.getPresets);
    console.log(response);

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
function* deletePreset(action: PayloadAction<Character>): Generator<any, void, any> {
  try {
    const presetId = action.payload.id;
    const response = yield call(characterPresetsService.deletePreset, presetId);

    if (response.success) {
      // Refresh presets after deletion
      yield call(fetchPresets);
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

function* savePreset(action: PayloadAction<SavePresetPayload>): Generator<any, void, any> {
  try {
    // Get the current character from the store if not provided in action
    const character = action.payload.character;

    if (!character) {
      console.error("No character provided to savePreset saga");
      return;
    }

    const presetName = action.payload.presetName || character.name || "Unnamed Character";
    const description = action.payload.description || "";
    const tags = action.payload.tags || [];

    const response = yield call([characterPresetsService, 'savePreset'], presetName, description, character, tags);

    if (response.success) {
      // Refresh presets after saving
      yield call(fetchPresets);
    } else {
      console.error("Error saving preset:", response.error);
    }
  } catch (error) {
    console.error("Exception in savePreset saga:", error);
  }
}

// Load a preset by ID
function* loadPreset(action: PayloadAction<number>): Generator<any, void, any> {
  try {
    const presetId = action.payload;
    const response = yield call(characterPresetsService.getPresetById, presetId);

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
  yield takeEvery(FETCH_PRESETS, fetchPresets);
  yield takeEvery(DELETE_PRESET, deletePreset);
  yield takeEvery(SAVE_PRESET, savePreset);
  yield takeEvery(LOAD_PRESET, loadPreset);
}
