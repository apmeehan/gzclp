import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView 
} from 'react-native';
import { gzclp } from '../../js';
import { colors, styles as globalStyles } from '../../js/styles';

export default function ProgramState() {
  // Get all lifts
  const getAllLifts = () => {
    if (!gzclp.getAllLifts) return [];
    
    const lifts = gzclp.getAllLifts();
    const liftArray: { id: string; name: string; tier: string; weight: number; }[] = [];
    
    Object.keys(lifts).forEach(id => {
      if (gzclp.getLiftName && gzclp.getLiftTier && gzclp.getNextAttemptWeight) {
        liftArray.push({
          id,
          name: gzclp.getLiftName(id),
          tier: gzclp.getLiftTier(id),
          weight: gzclp.getNextAttemptWeight(id)
        });
      }
    });
    
    // Sort first by tier, then by name
    liftArray.sort((a, b) => {
      if (a.tier !== b.tier) {
        return a.tier < b.tier ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    return liftArray;
  };
  
  const lifts = getAllLifts();
  
  return (
    <ScrollView style={styles.container}>
      {lifts.map((lift, index) => (
        <View key={index} style={styles.liftRow}>
          <View style={styles.liftInfo}>
            <Text style={styles.liftName}>{lift.tier} {lift.name}</Text>
            <Text style={styles.liftWeight}>{lift.weight} kg</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    maxHeight: 200,
    borderColor: colors.primaryColor,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  liftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  liftInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  liftName: {
    fontSize: 14,
    color: colors.darkGrey,
    fontWeight: '500',
  },
  liftWeight: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryColor,
  },
}); 