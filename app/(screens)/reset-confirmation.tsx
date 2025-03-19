import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { gzclp } from '../../js';

export default function ResetConfirmationScreen() {
  // Handle the cancel action
  const handleCancel = () => {
    router.back();
  };

  // Handle the reset action with confirmation
  const handleReset = () => {
    Alert.alert(
      "Confirm Reset",
      "Are you sure you want to reset all data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset Everything", 
          style: "destructive", 
          onPress: async () => {
            try {
              // Reset the program state
              gzclp.resetProgramState();
              
              // Clear saved data
              await gzclp.deleteSavedProgramState();
              
              // Show success message
              Alert.alert(
                "Data Reset",
                "All data has been successfully reset.",
                [
                  { 
                    text: "OK", 
                    onPress: () => router.replace('/(screens)/welcome')
                  }
                ]
              );
            } catch (error) {
              console.error("Error resetting data:", error);
              Alert.alert(
                "Error",
                "There was a problem resetting your data. Please try again."
              );
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Reset Data',
        headerLeft: () => (
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
        ),
      }} />
      
      <View style={styles.content}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.title}>Reset All Data?</Text>
        
        <Text style={styles.warningText}>
          This will reset all your progress and settings, including:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• All workout progress</Text>
          <Text style={styles.bulletItem}>• Your starting weights</Text>
          <Text style={styles.bulletItem}>• Completed sessions</Text>
          <Text style={styles.bulletItem}>• Custom program settings</Text>
        </View>
        
        <Text style={styles.warningText}>
          This action cannot be undone. You will need to set up your program from the beginning.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Reset Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerButton: {
    marginLeft: 15,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  warningText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  bulletList: {
    alignSelf: 'stretch',
    marginLeft: 20,
    marginBottom: 20,
  },
  bulletItem: {
    fontSize: 16,
    lineHeight: 28,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: '#ff3b30',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 