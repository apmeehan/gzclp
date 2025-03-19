import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import { gzclp } from '../../js';
import { Ionicons } from '@expo/vector-icons';

// Define interface for exercise data
interface Exercise {
  id: string | number;
  name: string;
  tier: string;
  increment: number;
}

// Main Weight Increments screen
export default function WeightIncrementsScreen() {
  const [t1Lifts, setT1Lifts] = useState<Exercise[]>([]);
  const [t2Lifts, setT2Lifts] = useState<Exercise[]>([]);
  const [t3Lifts, setT3Lifts] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load exercise data
  const loadExercises = useCallback(() => {
    setIsLoading(true);
    
    // Get all lifts by tier
    const t1Exercises: Exercise[] = [];
    const t2Exercises: Exercise[] = [];
    const t3Exercises: Exercise[] = [];
    
    // Get lifts for each tier
    const loadLiftsForTier = (tier: string, setLiftsArray: Exercise[]) => {
      const liftIds = gzclp.getAllLiftIDsInTier ? gzclp.getAllLiftIDsInTier(tier) : [];
      
      liftIds.forEach(id => {
        // Get the current increment for this lift
        const increment = gzclp.getLiftIncrement ? gzclp.getLiftIncrement(id) : 2.5;
        
        setLiftsArray.push({
          id,
          name: gzclp.getLiftName ? gzclp.getLiftName(id) : `Exercise ${id}`,
          tier,
          increment
        });
      });
    };
    
    // Load lifts for each tier
    loadLiftsForTier('T1', t1Exercises);
    loadLiftsForTier('T2', t2Exercises);
    loadLiftsForTier('T3', t3Exercises);
    
    // Sort each tier's exercises by name
    t1Exercises.sort((a, b) => a.name.localeCompare(b.name));
    t2Exercises.sort((a, b) => a.name.localeCompare(b.name));
    t3Exercises.sort((a, b) => a.name.localeCompare(b.name));
    
    // Set state
    setT1Lifts(t1Exercises);
    setT2Lifts(t2Exercises);
    setT3Lifts(t3Exercises);
    setIsLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);
  
  // Refresh data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadExercises();
      return () => {
        // Cleanup if needed
      };
    }, [loadExercises])
  );

  // Navigate to the increment picker screen for an exercise
  const handleSelectIncrement = (exercise: Exercise) => {
    router.push({
      pathname: '/(screens)/increment-picker',
      params: { 
        exerciseId: String(exercise.id), 
        exerciseName: exercise.name,
        exerciseTier: exercise.tier
      }
    });
  };

  // Handle going back
  const handleBack = () => {
    router.back();
  };

  // Render a lift row
  const renderExerciseRow = (exercise: Exercise) => (
    <TouchableOpacity 
      key={exercise.id}
      style={styles.exerciseRow}
      onPress={() => handleSelectIncrement(exercise)}
    >
      <View style={styles.exerciseInfo}>
        <Text style={[styles.tierBadge, 
          exercise.tier === 'T1' ? styles.tierT1 : 
          exercise.tier === 'T2' ? styles.tierT2 : 
          styles.tierT3
        ]}>
          {exercise.tier}
        </Text>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
      </View>
      <View style={styles.incrementContainer}>
        <Text style={styles.incrementValue}>{exercise.increment} kg</Text>
        <Ionicons name="chevron-forward" size={18} color="#777" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Weight Increments',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Weight Progression</Text>
          <Text style={styles.infoText}>
            GZCLP uses a simple linear progression. After completing all sets and reps 
            for an exercise, the weight increases by the specified increment for the next session.
            Tap on an exercise to set its increment.
          </Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading exercises...</Text>
          </View>
        ) : (
          <>
            {t1Lifts.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>T1 LIFTS</Text>
                <View style={styles.exercisesList}>
                  {t1Lifts.map(exercise => renderExerciseRow(exercise))}
                </View>
              </View>
            )}
            
            {t2Lifts.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>T2 LIFTS</Text>
                <View style={styles.exercisesList}>
                  {t2Lifts.map(exercise => renderExerciseRow(exercise))}
                </View>
              </View>
            )}
            
            {t3Lifts.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>T3 LIFTS</Text>
                <View style={styles.exercisesList}>
                  {t3Lifts.map(exercise => renderExerciseRow(exercise))}
                </View>
              </View>
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
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
    marginBottom: 8,
    paddingLeft: 5,
  },
  exercisesList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierBadge: {
    width: 30,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
    color: '#fff',
  },
  tierT1: {
    backgroundColor: '#007AFF',
  },
  tierT2: {
    backgroundColor: '#5AC8FA',
  },
  tierT3: {
    backgroundColor: '#34C759',
  },
  exerciseName: {
    fontSize: 16,
    color: '#333',
  },
  incrementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incrementValue: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 5,
  },
}); 