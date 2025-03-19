import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { gzclp } from '../../js';
import { Ionicons } from '@expo/vector-icons';

// Define interface for lift and session data
interface Lift {
  id: string | number;
  name: string;
  tier: string;
}

interface Session {
  id: number;
  name: string;
  lifts: Lift[];
}

// Main Edit Sessions screen that shows the list of all sessions
export default function EditSessionsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load sessions data
  const loadSessions = useCallback(() => {
    setIsLoading(true);
    const numberOfSessions = gzclp.getNumberOfSessions ? gzclp.getNumberOfSessions() : 4;
    
    const sessionsData: Session[] = [];
    for (let i = 0; i < numberOfSessions; i++) {
      const liftIDs = gzclp.getSessionLifts ? gzclp.getSessionLifts(i) : [];
      const sortedLiftIDs = gzclp.sortLiftIDsByTier ? gzclp.sortLiftIDsByTier(liftIDs) : liftIDs;
      
      // Create formatted display of lifts for each session
      const lifts = sortedLiftIDs.map(id => {
        const tier = gzclp.getLiftTier ? gzclp.getLiftTier(id) : 'T1';
        const name = gzclp.getLiftName ? gzclp.getLiftName(id) : `Exercise ${id}`;
        return { id, name, tier };
      });
      
      sessionsData.push({
        id: i,
        name: gzclp.getSessionName ? gzclp.getSessionName(i) : `Session ${i+1}`,
        lifts
      });
    }
    
    setSessions(sessionsData);
    setIsLoading(false);
  }, []);
  
  // Initial load
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);
  
  // Refresh data when the screen comes into focus (e.g., after editing a session)
  useFocusEffect(
    useCallback(() => {
      loadSessions();
      return () => {
        // Cleanup if needed
      };
    }, [loadSessions])
  );
  
  const handleEditSession = (sessionId: number) => {
    // Navigate to edit-session-lifts screen with the sessionId parameter
    router.push({
      pathname: '/(screens)/edit-session-lifts',
      params: { sessionId: sessionId.toString() }
    });
  };

  const handleBack = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Edit Sessions',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Customize Your Workouts</Text>
          <Text style={styles.infoText}>
            The GZCLP program consists of 4 rotating workout sessions. 
            Tap on any session below to customize which exercises appear in that session.
          </Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading sessions...</Text>
          </View>
        ) : (
          sessions.map(session => (
            <TouchableOpacity 
              key={session.id} 
              style={styles.sessionCard}
              onPress={() => handleEditSession(session.id)}
            >
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTitle}>{session.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#777" />
              </View>
              
              {session.lifts.length > 0 ? (
                <View style={styles.liftsList}>
                  {session.lifts.map((lift: Lift, index: number) => (
                    <View key={index} style={styles.liftItem}>
                      <Text style={[styles.tierBadge, 
                        lift.tier === 'T1' ? styles.tierT1 : 
                        lift.tier === 'T2' ? styles.tierT2 : 
                        styles.tierT3
                      ]}>
                        {lift.tier}
                      </Text>
                      <Text style={styles.liftName}>{lift.name}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyMessage}>No exercises added</Text>
              )}
            </TouchableOpacity>
          ))
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
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  liftsList: {
    marginTop: 5,
  },
  liftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  liftName: {
    fontSize: 15,
    color: '#333',
  },
  emptyMessage: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
}); 