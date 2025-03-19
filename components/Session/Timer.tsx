import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { gzclp } from '../../js';
import { colors } from '../../js/styles';

interface TimerProps {
  tier: string;
  resetKey?: number;  // Add a reset key that can be changed to force timer reset
}

export default function Timer({ tier, resetKey = 0 }: TimerProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnimation = useRef(new Animated.Value(1)).current;
  
  // Get the rest time for this tier
  const getRestTimeValue = (): number => {
    if (gzclp.getRestTime) {
      const time = gzclp.getRestTime(tier);
      return typeof time === 'number' ? time : tier === 'T1' ? 3 : tier === 'T2' ? 2 : 1;
    }
    return tier === 'T1' ? 3 : tier === 'T2' ? 2 : 1;
  };
  
  const restTime = getRestTimeValue();
  const restTimeInSeconds = restTime * 60;
  
  // Reset and start the timer whenever resetKey changes
  useEffect(() => {
    // Reset state
    setTimeElapsed(0);
    progressAnimation.setValue(1);
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start a new timer
    timerRef.current = setInterval(() => {
      setTimeElapsed(prevTime => prevTime + 1);
    }, 1000);
    
    // Animate the progress bar to decrease
    Animated.timing(progressAnimation, {
      toValue: 0,
      duration: restTimeInSeconds * 1000,
      useNativeDriver: false,
    }).start();
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetKey, tier]); // Re-run this effect when resetKey or tier changes
  
  const convertToMinutesAndSeconds = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // Prefix single-digit seconds with a 0
    const paddedSeconds = seconds.toString().length === 1 ? '0' + seconds : seconds;
    
    return minutes + ':' + paddedSeconds;
  };
  
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  const timeRemaining = Math.max(0, restTimeInSeconds - timeElapsed);
  const percentComplete = (timeElapsed / restTimeInSeconds) * 100;
  const isNearingCompletion = percentComplete >= 80;
  const isTimeUp = timeRemaining === 0;
  
  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerHeader}>
        <Text style={styles.timerLabel}>REST TIMER</Text>
        <Text style={styles.targetTime}>Target: {restTime} min</Text>
      </View>
      
      {!isTimeUp ? (
        <>
          <Text style={[
            styles.timerNumbers,
            isNearingCompletion ? styles.timerNearingCompletion : null
          ]}>
            {convertToMinutesAndSeconds(timeRemaining)}
          </Text>
          
          <Text style={[
            styles.timeRemainingLabel, 
            isNearingCompletion ? styles.timeNearingCompletion : null
          ]}>
            remaining
          </Text>
        </>
      ) : (
        <Text style={[styles.timeToLiftMessage]}>
          Time to lift!
        </Text>
      )}
      
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { width: progressWidth },
            isNearingCompletion ? styles.progressNearingCompletion : null
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    letterSpacing: 1,
  },
  targetTime: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },
  timerNumbers: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  timerNearingCompletion: {
    color: '#00b300',
  },
  timeToLiftMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 12,
  },
  timeRemainingLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  timeNearingCompletion: {
    color: '#00b300',
    fontWeight: '600',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primaryColor,
    borderRadius: 3,
  },
  progressNearingCompletion: {
    backgroundColor: '#00b300',
  },
}); 