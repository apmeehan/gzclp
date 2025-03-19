import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { gzclp } from '../../js';
import { Ionicons } from '@expo/vector-icons';
import { styles as globalStyles, colors } from '../../js/styles';

// Import component types only
type NextSessionButtonType = typeof import('../../components/Home/NextSessionButton').default;
type CompletedSessionResultType = typeof import('../../components/Home/CompletedSessionResult').default;
type ProgramStateType = typeof import('../../components/Home/ProgramState').default;

// Dynamic imports to avoid TypeScript errors
const NextSessionButton = require('../../components/Home/NextSessionButton').default as NextSessionButtonType;
const CompletedSessionResult = require('../../components/Home/CompletedSessionResult').default as CompletedSessionResultType;
const ProgramState = require('../../components/Home/ProgramState').default as ProgramStateType;

// Define params interface for session navigation
interface SessionParams {
  sessionId?: string;
}

export default function HomeScreen() {
  // Program state visibility toggle
  const [isProgramStateVisible, setIsProgramStateVisible] = useState(false);
  
  // Navigation handlers
  const goToSettings = () => {
    router.push('/(screens)/settings');
  };
  
  // Handle program state button toggle
  const handleShowProgramStateButton = () => {
    setIsProgramStateVisible(!isProgramStateVisible);
  };
  
  // Function to refresh the home screen (can be passed to child components)
  const refreshHomeScreen = () => {
    // Refresh is automatic with React hooks
  };
  
  // Get all completed sessions to display
  const previousSessions = gzclp.getAllCompletedSessions ? gzclp.getAllCompletedSessions() : [];
  
  // Create array of completed session results
  const previousSessionResults = [];
  for (let i = 0; i < previousSessions.length; i++) {
    previousSessionResults.push(
      <CompletedSessionResult
        key={i}
        sessionID={i}
      />
    );
  }
  
  // Simple navigation function that child components can use
  const navigate = (screenName: string) => {
    // This is unused since we switched to direct router navigation in the components
  };
  
  return (
    <View style={globalStyles.screenContainer}>
      <Stack.Screen 
        options={{
          title: 'GZCLP',
          headerLeft: () => (
            <TouchableOpacity onPress={goToSettings} style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.menuHeading}>NEXT SESSION</Text>
        <NextSessionButton
          navigate={navigate}
          refreshHomeScreen={refreshHomeScreen}
        />
        
        {previousSessionResults.length > 0 && (
          <Text style={globalStyles.menuHeading}>PREVIOUS SESSIONS</Text>
        )}
        
        <ScrollView style={styles.sessionsScroll}>
          {[...previousSessionResults].reverse()}
        </ScrollView>
        
        {isProgramStateVisible && <ProgramState />}
        
        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleShowProgramStateButton}
        >
          <Text style={globalStyles.buttonText}>
            {isProgramStateVisible ? 'Hide Lift Info' : 'Show Lift Info'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Home-specific styles that extend the global styles
const styles = StyleSheet.create({
  settingsButton: {
    marginLeft: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center' as const,
  },
  sessionsScroll: {
    flex: 1,
  }
}); 