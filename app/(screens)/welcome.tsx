import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Stack, router } from 'expo-router';
import { gzclp } from '../../js';
import { colors, styles as globalStyles } from '../../js/styles';

export default function WelcomeScreen() {
  const handleStartProgram = () => {
    router.push('/(screens)/starting-weights');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to GZCLP</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is GZCLP?</Text>
            <Text style={styles.text}>
              GZCLP is a beginner linear progression program based on the GZCL method.
              It's designed to help beginners make consistent strength gains through a
              structured approach to weight training.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How it works</Text>
            <Text style={styles.text}>
              GZCLP involves 4 workout days (A1, B1, A2, B2) rotating through different exercises.
              As you progress, you'll follow specific progression schemes for different types of lifts.
            </Text>
            
            <Text style={styles.bulletTitle}>Tier 1 (T1) - Main lifts:</Text>
            <Text style={styles.bullet}>• 5 sets of 3 reps, last set AMRAP</Text>
            <Text style={styles.bullet}>• When you can't complete 5×3, move to 6×2</Text>
            <Text style={styles.bullet}>• When you can't complete 6×2, move to 10×1</Text>
            <Text style={styles.bullet}>• When you can't complete 10×1, reset weight and start over</Text>
            
            <Text style={styles.bulletTitle}>Tier 2 (T2) - Assistance lifts:</Text>
            <Text style={styles.bullet}>• 3 sets of 10 reps</Text>
            <Text style={styles.bullet}>• When you can't complete 3×10, move to 3×8</Text>
            <Text style={styles.bullet}>• When you can't complete 3×8, move to 3×6</Text>
            <Text style={styles.bullet}>• When you can't complete 3×6, reset weight and start over</Text>
            
            <Text style={styles.bulletTitle}>Tier 3 (T3) - Isolation work:</Text>
            <Text style={styles.bullet}>• 3 sets of 15 reps, last set AMRAP</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={globalStyles.button}
              onPress={handleStartProgram}
            >
              <Text style={globalStyles.buttonText}>Set Starting Weights</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primaryColor,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
    marginBottom: 15,
  },
  bulletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginLeft: 10,
    marginBottom: 3,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
}); 