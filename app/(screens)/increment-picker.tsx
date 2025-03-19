import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { gzclp } from '../../js';

export default function IncrementPickerScreen() {
  const params = useLocalSearchParams();
  const exerciseId = params.exerciseId as string;
  const exerciseName = params.exerciseName as string;
  const exerciseTier = params.exerciseTier as string;
  
  const [selectedIncrement, setSelectedIncrement] = useState<number>(0);
  const [increments, setIncrements] = useState<number[]>([]);
  
  useEffect(() => {
    // Get the available increments
    const availableIncrements = gzclp.getIncrements ? gzclp.getIncrements() : [0.5, 1, 2.5, 5, 10];
    setIncrements(availableIncrements);
    
    // Get the current increment for this exercise
    if (exerciseId && gzclp.getLiftIncrement) {
      const currentIncrement = gzclp.getLiftIncrement(exerciseId);
      setSelectedIncrement(currentIncrement);
    }
  }, [exerciseId]);
  
  const handleSelectIncrement = async (increment: number) => {
    try {
      // Update the increment in the gzclp object
      if (gzclp.setLiftIncrement) {
        gzclp.setLiftIncrement(exerciseId, increment);
      }
      
      // Save the state
      if (gzclp.saveProgramState) {
        await gzclp.saveProgramState();
        Alert.alert(
          "Success", 
          `Weight increment for ${exerciseName} updated to ${increment} kg.`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        // If no save function, still go back
        router.back();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "There was a problem saving your changes.");
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: `${exerciseTier} ${exerciseName}`,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Select Weight Increment</Text>
          <Text style={styles.infoText}>
            This is how much the weight will increase each time you successfully complete all sets for this exercise.
          </Text>
        </View>
        
        <View style={styles.incrementsList}>
          {increments.map((increment, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.incrementItem,
                selectedIncrement === increment && styles.selectedItem
              ]}
              onPress={() => handleSelectIncrement(increment)}
            >
              <Text style={[
                styles.incrementValue,
                selectedIncrement === increment && styles.selectedValue
              ]}>
                {increment} kg
              </Text>
              {selectedIncrement === increment && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  },
  incrementsList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  incrementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedItem: {
    backgroundColor: '#f0f9ff',
  },
  incrementValue: {
    fontSize: 16,
    color: '#333',
  },
  selectedValue: {
    color: '#007AFF',
    fontWeight: '500',
  },
  checkmark: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
}); 