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

// Store reference to the supabase client
let supabaseClient = null;

// Function to initialize or reinitialize Supabase with new settings
export const initializeSupabase = (supabaseUrl, supabaseServiceKey) => {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials not provided');
    return null;
  }
  
  supabaseClient = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        storage: customStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  );
  
  return supabaseClient;
};

// Export a getter function for the supabase client
export const getSupabase = () => {
  if (!supabaseClient) {
    console.warn('Supabase not initialized. Please configure API settings.');
    
    // Auto-initialize with environment variables if available
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (url && key) {
      console.log('Auto-initializing Supabase client with environment variables');
      return initializeSupabase(url, key);
    }
  }
  return supabaseClient;
};

// Direct export of supabase client for easier access
export const supabase = {
  from: function(table) {
    const client = getSupabase();
    return client ? client.from(table) : { select: () => ({ data: null, error: new Error('Supabase not initialized') }) };
  },
  auth: {
    getSession: function() {
      const client = getSupabase();
      return client ? client.auth.getSession() : { data: null, error: new Error('Supabase not initialized') };
    },
    signInAnonymously: function() {
      const client = getSupabase();
      return client ? client.auth.signInAnonymously() : { data: null, error: new Error('Supabase not initialized') };
    }
  }
};
