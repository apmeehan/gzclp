import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LiftInfoProps {
  tier: string;
  name: string;
  weight: number;
  sets: number;
  reps: number;
}

export default function LiftInfo({ tier, name, weight, sets, reps }: LiftInfoProps) {
  return (
    <View>
      <Text style={styles.liftName}>
        {tier} {name}
      </Text>
      <Text style={styles.liftDetails}>
        {weight} kg   {sets}×{reps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  liftName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  liftDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
}); 