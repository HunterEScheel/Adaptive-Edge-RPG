import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadSettingsFromStorage, loadSettingsFromStorageAsync } from '@/store/slices/settingsSlice';
import { initializeSupabase } from '@/services/supabase';
import { initializeOpenAI } from '@/components/ai/compareEmbedding';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load settings from AsyncStorage and initialize services
    loadSettingsFromStorageAsync().then((savedSettings) => {
      if (savedSettings) {
        dispatch(loadSettingsFromStorage(savedSettings));
        
        // Initialize services if settings exist
        if (savedSettings.supabaseUrl && savedSettings.supabaseServiceKey) {
          initializeSupabase(savedSettings.supabaseUrl, savedSettings.supabaseServiceKey);
        }
        if (savedSettings.openaiApiKey) {
          initializeOpenAI(savedSettings.openaiApiKey);
        }
      }
    });
  }, [dispatch]);

  return <>{children}</>;
}