import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import { router } from 'expo-router';
import { gzclp } from '../../js';
import { colors, styles as globalStyles } from '../../js/styles';

interface NextSessionButtonProps {
  navigate: (screenName: string, params?: any) => void;
  refreshHomeScreen: () => void;
}

export default function NextSessionButton({ 
  navigate, 
  refreshHomeScreen 
}: NextSessionButtonProps) {
  // Try to get the next session from gzclp if the function exists
  const nextSession = gzclp.getNextSession ? gzclp.getNextSession() : null;
  const nextSessionID = nextSession?.id || 0;
  
  // Get exercise info for display
  const getExercisesForSession = () => {
    const liftIDs = gzclp.getSessionLifts ? gzclp.getSessionLifts(nextSessionID) : [];
    const exerciseInfo: { name: string; tier: string }[] = [];
    
    liftIDs.forEach(id => {
      if (gzclp.getLiftName && gzclp.getLiftTier) {
        exerciseInfo.push({
          name: gzclp.getLiftName(id),
          tier: gzclp.getLiftTier(id)
        });
      }
    });
    
    return exerciseInfo;
  };
  
  const exercises = getExercisesForSession();
  
  // Handle button press
  const handlePress = () => {
    // Navigate directly to the session screen with the session ID
    router.push({
      pathname: '/(screens)/session',
      params: { sessionId: nextSessionID.toString() }
    });
  };
  
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={handlePress}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          {nextSession?.name || `Session ${nextSessionID + 1}`}
        </Text>
        
        <View style={styles.exercisesList}>
          {exercises.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>
              {exercise.tier} {exercise.name}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    borderColor: colors.primaryColor,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryColor,
    marginBottom: 10,
  },
  exercisesList: {
    marginLeft: 10,
  },
  exerciseText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
}); 