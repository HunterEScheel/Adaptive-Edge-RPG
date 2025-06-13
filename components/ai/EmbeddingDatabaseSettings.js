import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert } from 'react-native';
import embeddingDatabase from '../../services/embeddingDatabase';

/**
 * Component to manage the embedding database settings
 * Controls online/offline mode and provides sync functionality
 */
const EmbeddingDatabaseSettings = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial state on mount
  useEffect(() => {
    const loadSettings = async () => {
      await embeddingDatabase.initialize();
      setIsOffline(embeddingDatabase.getOfflineMode());
      
      // Check last sync time
      const lastSyncTime = embeddingDatabase.getLastSyncTime();
      if (lastSyncTime) {
        setLastSync(new Date(lastSyncTime));
      }
    };
    
    loadSettings();
  }, []);

  // Handle offline mode toggle
  const toggleOfflineMode = (value) => {
    embeddingDatabase.setOfflineMode(value);
    setIsOffline(value);
    
    // Show alert about the mode change
    Alert.alert(
      'Mode Changed',
      `Embedding database is now in ${value ? 'offline' : 'online'} mode.`,
      [{ text: 'OK' }]
    );
  };

  // Handle sync from cloud
  const syncFromCloud = async () => {
    if (isOffline) {
      Alert.alert(
        'Offline Mode',
        'Please switch to online mode before syncing.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsSyncing(true);
    
    try {
      await embeddingDatabase.syncFromCloud();
      setLastSync(new Date());
      
      Alert.alert(
        'Sync Complete',
        'Successfully synchronized embeddings from cloud.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Sync Failed',
        `Error: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle upload to cloud
  const uploadToCloud = async () => {
    if (isOffline) {
      Alert.alert(
        'Offline Mode',
        'Please switch to online mode before uploading.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert(
      'Confirm Upload',
      'This will overwrite all embeddings in the cloud database. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upload',
          style: 'destructive',
          onPress: async () => {
            setIsSyncing(true);
            
            try {
              await embeddingDatabase.uploadToCloud();
              setLastSync(new Date());
              
              Alert.alert(
                'Upload Complete',
                'Successfully uploaded embeddings to cloud.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert(
                'Upload Failed',
                `Error: ${error.message}`,
                [{ text: 'OK' }]
              );
            } finally {
              setIsSyncing(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Embedding Database Settings</Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Offline Mode</Text>
        <Switch
          value={isOffline}
          onValueChange={toggleOfflineMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isOffline ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      
      <Text style={styles.statusText}>
        Status: {isOffline ? 'Using local cache' : 'Using cloud database'}
      </Text>
      
      {lastSync && (
        <Text style={styles.syncText}>
          Last synced: {lastSync.toLocaleString()}
        </Text>
      )}
      
      <View style={styles.buttonContainer}>
        <Button
          title="Sync from Cloud"
          onPress={syncFromCloud}
          disabled={isSyncing || isOffline}
        />
        
        <Button
          title="Upload to Cloud"
          onPress={uploadToCloud}
          disabled={isSyncing || isOffline}
          color="#ff5c5c"
        />
      </View>
      
      {isSyncing && <Text style={styles.syncingText}>Syncing...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
  },
  statusText: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  syncText: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  syncingText: {
    marginTop: 16,
    textAlign: 'center',
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default EmbeddingDatabaseSettings;
