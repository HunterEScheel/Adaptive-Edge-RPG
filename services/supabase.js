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

// Platform-adaptive storage adapter for Supabase
let customStorageAdapter;

if (typeof window !== "undefined" && window.localStorage) {
  // Web
  customStorageAdapter = {
    getItem: async (key) => window.localStorage.getItem(key),
    setItem: async (key, value) => window.localStorage.setItem(key, value),
    removeItem: async (key) => window.localStorage.removeItem(key),
  };
} else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
  // React Native
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  customStorageAdapter = {
    getItem: async (key) => await AsyncStorage.getItem(key),
    setItem: async (key, value) => await AsyncStorage.setItem(key, value),
    removeItem: async (key) => await AsyncStorage.removeItem(key),
  };
} else {
  // Node.js fallback (in-memory, not persistent)
  const memoryStore = {};
  customStorageAdapter = {
    getItem: async (key) => memoryStore[key] || null,
    setItem: async (key, value) => { memoryStore[key] = value; },
    removeItem: async (key) => { delete memoryStore[key]; },
  };
}

// Initialize Supabase client
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_SERVICE_KEY,
  {
    auth: {
      storage: customStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
