import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { gzclp, StartingWeights } from '../../js';
import { colors, styles as globalStyles } from '../../js/styles';

export default function StartingWeightsScreen() {
  // Get the default weights from the program
  const initialWeights = gzclp.getDefaultWeights();
  
  // Set up state for the weight inputs
  const [weights, setWeights] = useState({
    squat: initialWeights.squat.toString(),
    bench: initialWeights.bench.toString(),
    deadlift: initialWeights.deadlift.toString(),
    overheadPress: initialWeights.overheadPress.toString(),
    row: initialWeights.row.toString(),
  });

  // Update a specific exercise weight
  const updateWeight = (exercise: string, value: string) => {
    setWeights({
      ...weights,
      [exercise]: value,
    });
  };

  // Handle the save action
  const handleSave = () => {
    // Convert input values to numbers
    const startingWeights: StartingWeights = {
      squat: parseFloat(weights.squat) || initialWeights.squat,
      bench: parseFloat(weights.bench) || initialWeights.bench,
      deadlift: parseFloat(weights.deadlift) || initialWeights.deadlift,
      overheadPress: parseFloat(weights.overheadPress) || initialWeights.overheadPress,
      row: parseFloat(weights.row) || initialWeights.row,
    };

    // Save the weights to the program state
    gzclp.setStartingWeights(startingWeights);
    
    // Mark setup as complete
    gzclp.completeSetup();
    
    // Navigate to home screen
    router.replace('/(screens)/home');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoid} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen options={{ 
        title: 'Starting Weights',
        headerLeft: () => null, // Remove back button
      }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>Set Your Starting Weights</Text>
          <Text style={styles.description}>
            Enter your starting weights for each exercise. If you're not sure, 
            you can use the default values or start with an empty barbell (20kg) 
            and focus on form first.
          </Text>
          
          <View style={styles.inputsContainer}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Squat</Text>
              <TextInput
                style={styles.input}
                value={weights.squat}
                onChangeText={(value) => updateWeight('squat', value)}
                keyboardType="numeric"
                placeholder="Weight in kg"
              />
              <Text style={styles.unitText}>kg</Text>
            </View>
            
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Bench Press</Text>
              <TextInput
                style={styles.input}
                value={weights.bench}
                onChangeText={(value) => updateWeight('bench', value)}
                keyboardType="numeric"
                placeholder="Weight in kg"
              />
              <Text style={styles.unitText}>kg</Text>
            </View>
            
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Deadlift</Text>
              <TextInput
                style={styles.input}
                value={weights.deadlift}
                onChangeText={(value) => updateWeight('deadlift', value)}
                keyboardType="numeric"
                placeholder="Weight in kg"
              />
              <Text style={styles.unitText}>kg</Text>
            </View>
            
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Overhead Press</Text>
              <TextInput
                style={styles.input}
                value={weights.overheadPress}
                onChangeText={(value) => updateWeight('overheadPress', value)}
                keyboardType="numeric"
                placeholder="Weight in kg"
              />
              <Text style={styles.unitText}>kg</Text>
            </View>
            
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Row</Text>
              <TextInput
                style={styles.input}
                value={weights.row}
                onChangeText={(value) => updateWeight('row', value)}
                keyboardType="numeric"
                placeholder="Weight in kg"
              />
              <Text style={styles.unitText}>kg</Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={globalStyles.button}
              onPress={handleSave}
            >
              <Text style={globalStyles.buttonText}>Start Program</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 25,
    color: '#555',
  },
  inputsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputLabel: {
    flex: 1,
    fontSize: 16,
    color: '#444',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
  },
  unitText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
    width: 30,
  },
  buttonContainer: {
    alignItems: 'center',
  },
}); 