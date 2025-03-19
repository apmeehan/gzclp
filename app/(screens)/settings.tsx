import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import { gzclp } from '../../js';
import { colors, styles as globalStyles } from '../../js/styles';

// Import MenuItem component
import MenuItem from '../../components/MenuItem';

interface SessionInfo {
  id: string;
  name: string;
  exercises: string;
}

// Update the global styles to increase button max width
// This will be applied to all buttons in the app
const extendedGlobalStyles = {
  ...globalStyles,
  button: {
    ...globalStyles.button,
    maxWidth: 350, // Increased from 300
  },
};

export default function SettingsScreen() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load session data
  const loadSessionData = useCallback(() => {
    setIsLoading(true);
    
    const sessionData: SessionInfo[] = [];
    
    // Get information for each session (A, B, C, D)
    const sessionIds = ['A', 'B', 'C', 'D'];
    const sessionNumbers = [0, 1, 2, 3]; // Corresponding number IDs
    
    for (let i = 0; i < sessionIds.length; i++) {
      const sessionId = sessionIds[i];
      const numId = sessionNumbers[i];
      const name = gzclp.getSessionName ? gzclp.getSessionName(numId) : `Session ${sessionId}`;
      
      // Get lift IDs for this session
      const liftIds = gzclp.getSessionLifts ? gzclp.getSessionLifts(numId) : [];
      
      // Create a list of exercises grouped by tier
      const t1Lifts: string[] = [];
      const t2Lifts: string[] = [];
      const t3Lifts: string[] = [];
      
      liftIds.forEach(id => {
        if (gzclp.getLiftTier && gzclp.getLiftName) {
          const tier = gzclp.getLiftTier(id);
          const name = gzclp.getLiftName(id);
          
          if (tier === 'T1') t1Lifts.push(name);
          else if (tier === 'T2') t2Lifts.push(name);
          else if (tier === 'T3') t3Lifts.push(name);
        }
      });
      
      // Create exercise list string
      let exerciseStr = '';
      if (t1Lifts.length > 0) exerciseStr += `T1: ${t1Lifts.join(', ')}`;
      if (t2Lifts.length > 0) {
        if (exerciseStr) exerciseStr += '\n';
        exerciseStr += `T2: ${t2Lifts.join(', ')}`;
      }
      if (t3Lifts.length > 0) {
        if (exerciseStr) exerciseStr += '\n';
        exerciseStr += `T3: ${t3Lifts.join(', ')}`;
      }
      
      sessionData.push({
        id: sessionId,
        name,
        exercises: exerciseStr || 'No exercises configured'
      });
    }
    
    setSessions(sessionData);
    setIsLoading(false);
  }, []);
  
  // Initial load
  useEffect(() => {
    loadSessionData();
  }, [loadSessionData]);
  
  // Refresh data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSessionData();
      return () => {
        // Cleanup if needed
      };
    }, [loadSessionData])
  );

  // Handle going back to the main screen
  const handleDone = () => {
    // In the original code, there was a refreshHomeScreen function passed via navigation params
    // Here we'll just navigate back
    router.back();
  };

  // Reset all program data
  const handleResetButton = async () => {
    try {
      // Show a confirmation alert first
      Alert.alert(
        "Reset Data", 
        "Are you sure you want to reset all data? This cannot be undone.",
        [
          { 
            text: "Cancel", 
            style: "cancel" 
          },
          { 
            text: "Reset", 
            style: "destructive",
            onPress: async () => {
              if (gzclp.deleteSavedProgramState) {
                await gzclp.deleteSavedProgramState();
              }
              if (gzclp.resetProgramState) {
                gzclp.resetProgramState();
              }
              // Navigate to the Starting Weights screen after reset
              router.replace('/(screens)/starting-weights');
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error removing data:", error);
      Alert.alert("Error", "There was a problem resetting your data.");
    }
  };

  // Navigate to a specific screen
  const navigateTo = (screen: string) => {
    router.push(`/(screens)/${screen}` as any);
  };

  return (
    <View style={extendedGlobalStyles.screenContainer}>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={handleDone} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <Text style={extendedGlobalStyles.menuHeading}>EDIT SESSIONS</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primaryColor} />
            <Text style={styles.loadingText}>Loading sessions...</Text>
          </View>
        ) : (
          sessions.map(session => (
            <MenuItem
              key={session.id}
              title={`Session ${session.id}`}
              subtitle={session.exercises}
              onPress={() => navigateTo(`edit-session-lifts?sessionId=${session.id}`)}
              hasNavArrow={true}
            />
          ))
        )}

        <Text style={extendedGlobalStyles.menuHeading}>EDIT LIFTS</Text>
        <MenuItem
          title="Increments"
          onPress={() => navigateTo('weight-increments')}
          hasNavArrow={true}
        />
        <MenuItem
          title="Weights"
          onPress={() => navigateTo('starting-weights')}
          hasNavArrow={true}
        />

        <View style={{marginTop: 40}}>
          <MenuItem
            title="Privacy Policy"
            onPress={() => navigateTo('privacy')}
            hasNavArrow={true}
          />
        </View>

        <View style={styles.resetContainer}>
          <Text style={styles.resetWarningText}>
            Warning: This will erase all your progress data.
          </Text>
          <TouchableOpacity style={extendedGlobalStyles.button} onPress={handleResetButton}>
            <Text style={extendedGlobalStyles.buttonText}>Reset data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 15,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 2,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.darkGrey,
  },
  resetContainer: {
    marginTop: 40,
    marginBottom: 40,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  resetWarningText: {
    fontSize: 14,
    color: colors.darkGrey,
    marginBottom: 12,
    textAlign: 'center',
  },
}); 