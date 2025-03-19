import React, { useEffect, useState } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { gzclp } from '../js';
import { View, Text } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

export default function RootLayout() {
  const [dataFinishedFetching, setDataFinishedFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch saved data when the app loads
  useEffect(() => {
    async function fetchSavedData() {
      try {
        // Initialize program state with default values
        gzclp.resetProgramState();
        
        // Overwrite with saved values if applicable
        const storedProgramState = await gzclp.fetchProgramState();
        if (storedProgramState !== null) {
          gzclp.setProgramState(storedProgramState);
        } else {
          console.log("No sessions completed yet");
        }
      } catch (error) {
        console.error("Error setting fetched data:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setDataFinishedFetching(true);
        SplashScreen.hideAsync().catch(() => {
          /* ignore error */
        });
      }
    }

    fetchSavedData();
  }, []);

  if (!dataFinishedFetching) {
    return null;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Error Loading Data
        </Text>
        <Text style={{ textAlign: 'center' }}>
          {error.message}
        </Text>
      </View>
    );
  }

  // Return a Slot to allow Expo Router to manage the navigation
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Slot />
    </SafeAreaProvider>
  );
} 