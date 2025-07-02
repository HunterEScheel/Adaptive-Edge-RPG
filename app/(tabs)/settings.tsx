import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getResponsiveStyles } from '@/app/styles/responsive';
import { RootState } from '@/store/rootReducer';
import {
  setSupabaseUrl,
  setSupabaseServiceKey,
  setOpenaiApiKey,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  loadSettingsFromStorageAsync,
} from '@/store/slices/settingsSlice';
import { initializeSupabase } from '@/services/supabase';
import { initializeOpenAI } from '@/components/ai/compareEmbedding';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const styles = getResponsiveStyles();
  
  const [supabaseUrl, setLocalSupabaseUrl] = useState(settings.supabaseUrl);
  const [supabaseKey, setLocalSupabaseKey] = useState(settings.supabaseServiceKey);
  const [openaiKey, setLocalOpenaiKey] = useState(settings.openaiApiKey);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load settings from AsyncStorage on mount
    loadSettingsFromStorageAsync().then((savedSettings) => {
      if (savedSettings) {
        dispatch(loadSettingsFromStorage(savedSettings));
        setLocalSupabaseUrl(savedSettings.supabaseUrl || '');
        setLocalSupabaseKey(savedSettings.supabaseServiceKey || '');
        setLocalOpenaiKey(savedSettings.openaiApiKey || '');
        
        // Initialize services if settings exist
        if (savedSettings.supabaseUrl && savedSettings.supabaseServiceKey) {
          initializeSupabase(savedSettings.supabaseUrl, savedSettings.supabaseServiceKey);
        }
        if (savedSettings.openaiApiKey) {
          initializeOpenAI(savedSettings.openaiApiKey);
        }
      }
      setIsLoading(false);
    });
  }, [dispatch]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update Redux store
      dispatch(setSupabaseUrl(supabaseUrl));
      dispatch(setSupabaseServiceKey(supabaseKey));
      dispatch(setOpenaiApiKey(openaiKey));
      
      // Save to AsyncStorage
      await saveSettingsToStorage({
        supabaseUrl,
        supabaseServiceKey: supabaseKey,
        openaiApiKey: openaiKey,
      });
      
      // Initialize services with new settings
      if (supabaseUrl && supabaseKey) {
        initializeSupabase(supabaseUrl, supabaseKey);
      }
      if (openaiKey) {
        initializeOpenAI(openaiKey);
      }
      
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            API Configuration
          </ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Supabase URL</ThemedText>
            <TextInput
              style={[styles.input, styles.textInput]}
              value={supabaseUrl}
              onChangeText={setLocalSupabaseUrl}
              placeholder="https://your-project.supabase.co"
              placeholderTextColor="#666"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Supabase Service Key</ThemedText>
            <TextInput
              style={[styles.input, styles.textInput]}
              value={supabaseKey}
              onChangeText={setLocalSupabaseKey}
              placeholder="Your service key"
              placeholderTextColor="#666"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>OpenAI API Key (Optional)</ThemedText>
            <TextInput
              style={[styles.input, styles.textInput]}
              value={openaiKey}
              onChangeText={setLocalOpenaiKey}
              placeholder="sk-..."
              placeholderTextColor="#666"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title={isSaving ? "Saving..." : "Save Settings"}
              onPress={handleSave}
              disabled={isSaving}
            />
          </View>
          
          {settings.isConfigured && (
            <ThemedText style={[styles.statusText, { color: 'green' }]}>
              ✓ Supabase configured
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}