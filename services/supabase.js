import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Create a storage wrapper that mimics MMKV but uses AsyncStorage instead
export const mmkvStorage = {
  getString: async (key) => {
    return await AsyncStorage.getItem(key);
  },
  getBoolean: async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value === "true";
  },
  set: async (key, value) => {
    if (typeof value === "boolean") {
      await AsyncStorage.setItem(key, value.toString());
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  delete: async (key) => {
    await AsyncStorage.removeItem(key);
  },
};

// Custom storage adapter that uses AsyncStorage
const customStorageAdapter = {
  getItem: async (key) => {
    return await AsyncStorage.getItem(key);
  },
  setItem: async (key, value) => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key);
  },
};

// Initialize Supabase client
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
  auth: {
    storage: customStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
