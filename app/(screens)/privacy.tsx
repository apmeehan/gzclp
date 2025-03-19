import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Privacy Policy' }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: June 2023</Text>
          
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.paragraph}>
            This Privacy Policy explains how the GZCLP App collects, uses, and protects your information.
          </Text>
          
          <Text style={styles.sectionTitle}>Data Collection</Text>
          <Text style={styles.paragraph}>
            The GZCLP App is designed to respect your privacy. We do not collect any personal information from you.
            All of your workout data is stored locally on your device and is not transmitted to our servers or any third parties.
          </Text>
          
          <Text style={styles.sectionTitle}>Data Storage</Text>
          <Text style={styles.paragraph}>
            Your workout information, including weights, reps, and workout history, is stored only on your device
            using AsyncStorage. This data remains on your device unless you explicitly choose to clear app data
            or uninstall the application.
          </Text>
          
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <Text style={styles.paragraph}>
            This app does not use any third-party analytics, tracking, or advertising services.
          </Text>
          
          <Text style={styles.sectionTitle}>Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by updating the
            "Last Updated" date of this Privacy Policy.
          </Text>
          
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contact}>support@gzclpapp.com</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 15,
  },
  contact: {
    fontSize: 16,
    lineHeight: 24,
    color: '#007AFF',
    marginTop: 5,
  },
}); 