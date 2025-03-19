import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { gzclp } from '../../js';
import { styles as globalStyles, colors } from '../../js/styles';

// Import components
import Lift from '../../components/Lift';

interface LiftResults {
  [key: string]: number;
}

export default function SessionScreen() {
  const params = useLocalSearchParams();
  const sessionId = typeof params.sessionId === 'string' ? parseInt(params.sessionId) : 0;
  
  // Session state to track lift completions - similar to the original implementation
  // 0: incomplete, 1: successful, 2: failed
  const [liftResults, setLiftResults] = useState<LiftResults>({});
  
  // Get the lifts for this session
  const [liftIds, setLiftIds] = useState<string[]>([]);
  
  // Load session data when component mounts
  useEffect(() => {
    // Get the lift IDs for this session
    const sessionLifts = gzclp.getSessionLifts ? gzclp.getSessionLifts(sessionId) : [];
    
    // Sort the lifts by tier
    if (gzclp.sortLiftIDsByTier) {
      gzclp.sortLiftIDsByTier(sessionLifts);
    }
    
    // Initialize the state for each lift (all incomplete)
    const initialLiftResults: LiftResults = {};
    sessionLifts.forEach(liftId => {
      initialLiftResults[liftId] = 0;
    });
    
    setLiftIds(sessionLifts);
    setLiftResults(initialLiftResults);
  }, [sessionId]);
  
  // Handle lift result updates
  const handleLiftResult = (liftId: string, result: number) => {
    setLiftResults(prev => ({
      ...prev,
      [liftId]: result
    }));
  };
  
  // Handle the Done button press
  const handleDoneButtonPress = async () => {
    // Update each lift based on its result
    for (const liftId in liftResults) {
      const result = liftResults[liftId];
      
      if (result === 1 && gzclp.handleSuccessfulLift) {
        // Successful lift
        gzclp.handleSuccessfulLift(liftId);
      } else if (result === 2 && gzclp.handleFailedLift) {
        // Failed lift
        gzclp.handleFailedLift(liftId);
      }
    }
    
    // Record the completed session
    if (gzclp.addCompletedSession) {
      gzclp.addCompletedSession(liftResults);
    }
    
    // Increment the session counter
    if (gzclp.incrementSessionCounter) {
      gzclp.incrementSessionCounter();
    }
    
    // Save the program state
    try {
      if (gzclp.saveProgramState) {
        await gzclp.saveProgramState();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "There was a problem saving your workout data.");
    }
    
    // Return to home screen
    router.replace('/(screens)/home');
  };
  
  // Handle cancellation
  const handleCancel = () => {
    Alert.alert(
      "Cancel Workout",
      "Are you sure you want to cancel this workout? Your progress will not be saved.",
      [
        { text: "Stay", style: "cancel" },
        { 
          text: "Cancel Workout", 
          style: "destructive", 
          onPress: () => router.back() 
        }
      ]
    );
  };

  // Get the session name
  const sessionName = gzclp.getSessionName ? gzclp.getSessionName(sessionId) : `Session ${sessionId + 1}`;
  
  return (
    <View style={globalStyles.screenContainer}>
      <Stack.Screen options={{ 
        title: `Session ${sessionId + 1}: ${sessionName}`,
        headerLeft: () => (
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
        ),
      }} />
      
      <View style={styles.sessionContainer}>
        <ScrollView style={{flex: 1}}>
          {liftIds.map((liftId, index) => {
            // Get lift details
            const tier = gzclp.getLiftTier ? gzclp.getLiftTier(liftId) : 'T1';
            const name = gzclp.getLiftName ? gzclp.getLiftName(liftId) : `Exercise ${liftId}`;
            const repSchemeIndex = gzclp.getNextAttemptRepSchemeIndex ? 
              gzclp.getNextAttemptRepSchemeIndex(liftId) : 0;
            const weight = gzclp.getNextAttemptWeight ? 
              gzclp.getNextAttemptWeight(liftId) : 0;
            
            return (
              <Lift 
                key={index}
                liftId={liftId}
                tier={tier}
                name={name}
                repSchemeIndex={repSchemeIndex}
                weight={weight}
                setLiftResult={(result) => handleLiftResult(liftId, result)}
              />
            );
          })}
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={handleDoneButtonPress}
          >
            <Text style={globalStyles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  sessionContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 15,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 15,
  },
}); 