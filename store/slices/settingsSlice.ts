import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SettingsState {
  supabaseUrl: string;
  supabaseServiceKey: string;
  openaiApiKey: string;
  isConfigured: boolean;
}

const initialState: SettingsState = {
  supabaseUrl: '',
  supabaseServiceKey: '',
  openaiApiKey: '',
  isConfigured: false,
};

const SETTINGS_STORAGE_KEY = 'app_settings';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSupabaseUrl: (state, action: PayloadAction<string>) => {
      state.supabaseUrl = action.payload;
      state.isConfigured = !!(state.supabaseUrl && state.supabaseServiceKey);
    },
    setSupabaseServiceKey: (state, action: PayloadAction<string>) => {
      state.supabaseServiceKey = action.payload;
      state.isConfigured = !!(state.supabaseUrl && state.supabaseServiceKey);
    },
    setOpenaiApiKey: (state, action: PayloadAction<string>) => {
      state.openaiApiKey = action.payload;
    },
    setSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      Object.assign(state, action.payload);
      state.isConfigured = !!(state.supabaseUrl && state.supabaseServiceKey);
    },
    loadSettingsFromStorage: (state, action: PayloadAction<SettingsState>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setSupabaseUrl,
  setSupabaseServiceKey,
  setOpenaiApiKey,
  setSettings,
  loadSettingsFromStorage,
} = settingsSlice.actions;

// Async thunks for persisting settings
export const saveSettingsToStorage = async (settings: Partial<SettingsState>) => {
  try {
    const currentSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsed = currentSettings ? JSON.parse(currentSettings) : {};
    const updated = { ...parsed, ...settings };
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadSettingsFromStorageAsync = async () => {
  try {
    const settings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (settings) {
      return JSON.parse(settings);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return null;
};

export default settingsSlice.reducer;