import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text 
} from 'react-native';
import { gzclp } from '../../js';
import { colors, styles as globalStyles } from '../../js/styles';

interface CompletedSessionResultProps {
  sessionID: number;
}

export default function CompletedSessionResult({ sessionID }: CompletedSessionResultProps) {
  // Get the completed session data
  const completedSession = gzclp.getCompletedSession ? gzclp.getCompletedSession(sessionID) : null;
  
  if (!completedSession) {
    return null;
  }
  
  // Calculate success and failure counts
  let successCount = 0;
  let failureCount = 0;
  
  Object.values(completedSession).forEach((result: number) => {
    if (result === 1) successCount++;
    else if (result === 2) failureCount++;
  });
  
  // Get the session name from the ID
  const getSessionNameFromLiftIDs = () => {
    // In the original app, this would get the session name based on the lift IDs
    // Here we'll just use a generic name with the session number
    return `Session ${sessionID + 1}`;
  };
  
  const sessionName = getSessionNameFromLiftIDs();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sessionName}</Text>
      <View style={styles.resultsContainer}>
        <View style={styles.resultItem}>
          <Text style={styles.resultCount}>{successCount}</Text>
          <Text style={styles.resultLabel}>Successful</Text>
        </View>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultCount}>{failureCount}</Text>
          <Text style={styles.resultLabel}>Failed</Text>
        </View>
        
        <View style={styles.resultItem}>
          <Text style={styles.resultCount}>{Object.keys(completedSession).length - successCount - failureCount}</Text>
          <Text style={styles.resultLabel}>Incomplete</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    borderColor: colors.primaryColor,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryColor,
    marginBottom: 8,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultItem: {
    alignItems: 'center',
    flex: 1,
  },
  resultCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGrey,
  },
  resultLabel: {
    fontSize: 12,
    color: colors.mediumGrey,
    marginTop: 2,
  },
}); 