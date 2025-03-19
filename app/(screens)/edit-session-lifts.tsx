import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { gzclp } from '../../js';

interface Lift {
  id: string | number;
  name: string;
  tier: string;
  selected: boolean;
}

export default function EditSessionLiftsScreen() {
  const params = useLocalSearchParams();
  const paramSessionId = params.sessionId;
  
  let sessionId = 0;
  
  if (typeof paramSessionId === 'string') {
    if (paramSessionId === 'A') sessionId = 0;
    else if (paramSessionId === 'B') sessionId = 1;
    else if (paramSessionId === 'C') sessionId = 2;
    else if (paramSessionId === 'D') sessionId = 3;
    else {
      const parsedId = parseInt(paramSessionId);
      if (!isNaN(parsedId)) {
        sessionId = parsedId;
      }
    }
  }
  
  const [sessionName, setSessionName] = useState('');
  const [t1Lifts, setT1Lifts] = useState<Lift[]>([]);
  const [t2Lifts, setT2Lifts] = useState<Lift[]>([]);
  const [t3Lifts, setT3Lifts] = useState<Lift[]>([]);
  const [currentLifts, setCurrentLifts] = useState<(string | number)[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSessionData = useCallback(() => {
    setIsLoading(true);
    
    // Get session name
    const name = gzclp.getSessionName ? gzclp.getSessionName(sessionId) : `Session ${sessionId + 1}`;
    setSessionName(name);

    // Get current lifts in the session
    const sessionLifts = gzclp.getSessionLifts ? gzclp.getSessionLifts(sessionId) : [];
    setCurrentLifts(sessionLifts);

    // Get all available lifts by tier
    loadLiftsForTier('T1', setT1Lifts, sessionLifts);
    loadLiftsForTier('T2', setT2Lifts, sessionLifts);
    loadLiftsForTier('T3', setT3Lifts, sessionLifts);
    
    setIsLoading(false);
    setHasChanges(false);
  }, [sessionId]);

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

  const loadLiftsForTier = (tier: string, setLiftsFn: React.Dispatch<React.SetStateAction<Lift[]>>, selectedLifts: (string | number)[]) => {
    const liftIds = gzclp.getAllLiftIDsInTier ? gzclp.getAllLiftIDsInTier(tier) : [];
    
    const lifts = liftIds.map(id => ({
      id,
      name: gzclp.getLiftName ? gzclp.getLiftName(id) : `Exercise ${id}`,
      tier,
      selected: selectedLifts.includes(id)
    }));
    
    setLiftsFn(lifts);
  };

  const handleToggleLift = (lift: Lift) => {
    // Create a new array with the updated selection
    const newSelectedLifts = [...currentLifts];
    
    if (lift.selected) {
      // Remove from selected lifts
      const index = newSelectedLifts.indexOf(lift.id);
      if (index > -1) {
        newSelectedLifts.splice(index, 1);
      }
    } else {
      // Add to selected lifts
      newSelectedLifts.push(lift.id);
    }
    
    setCurrentLifts(newSelectedLifts);
    setHasChanges(true);
    
    // Update the specific tier's lifts
    const updateLift = (l: Lift) => 
      l.id === lift.id ? { ...l, selected: !l.selected } : l;
      
    if (lift.tier === 'T1') {
      setT1Lifts(prev => prev.map(updateLift));
    } else if (lift.tier === 'T2') {
      setT2Lifts(prev => prev.map(updateLift));
    } else if (lift.tier === 'T3') {
      setT3Lifts(prev => prev.map(updateLift));
    }
  };

  const handleSave = async () => {
    try {
      // Update the session lifts in gzclp
      if (gzclp.setSessionLifts) {
        // Convert array to correct type if needed
        const liftsArray = currentLifts.map(id => String(id));
        gzclp.setSessionLifts(sessionId, liftsArray);
      }
      
      // Save the state
      if (gzclp.saveProgramState) {
        await gzclp.saveProgramState();
        Alert.alert("Success", "Session exercises updated successfully.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Success", "Session exercises updated.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "There was a problem saving your changes.");
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  // Render a lift row with a switch
  const renderLiftItem = (lift: Lift) => (
    <View key={lift.id} style={styles.liftItem}>
      <Text style={styles.liftName}>{lift.name}</Text>
      <Switch
        value={lift.selected}
        onValueChange={() => handleToggleLift(lift)}
        trackColor={{ false: "#d9d9d9", true: "#81b0ff" }}
        thumbColor={lift.selected ? "#007AFF" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: sessionName,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cancel</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading exercises...</Text>
          </View>
        ) : (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Edit {sessionName} Exercises</Text>
              <Text style={styles.infoText}>
                Toggle the switches to add or remove exercises from this workout session.
              </Text>
            </View>
            
            {t1Lifts.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>T1 LIFTS</Text>
                <View style={styles.liftSection}>
                  {t1Lifts.map(lift => renderLiftItem(lift))}
                </View>
              </>
            )}
            
            {t2Lifts.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>T2 LIFTS</Text>
                <View style={styles.liftSection}>
                  {t2Lifts.map(lift => renderLiftItem(lift))}
                </View>
              </>
            )}
            
            {t3Lifts.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>T3 LIFTS</Text>
                <View style={styles.liftSection}>
                  {t3Lifts.map(lift => renderLiftItem(lift))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerButton: {
    paddingHorizontal: 15,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
    marginTop: 20,
    marginBottom: 8,
    paddingLeft: 10,
  },
  liftSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 5,
  },
  liftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  liftName: {
    fontSize: 16,
    color: '#333',
  },
}); 