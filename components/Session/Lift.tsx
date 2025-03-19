import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { gzclp } from '../../js';

import LiftButton from './LiftButton';
import LiftInfo from './LiftInfo';
import Timer from './Timer';

interface LiftProps {
  liftId: string;
  tier: string;
  name: string;
  repSchemeIndex: number;
  weight: number;
  setLiftResult: (result: number) => void;
}

export default function Lift({ 
  liftId, 
  tier, 
  name, 
  repSchemeIndex, 
  weight, 
  setLiftResult 
}: LiftProps) {
  // Get the number of sets for this lift
  const numberOfSets = gzclp.getNumberOfSets ? 
    gzclp.getNumberOfSets(tier, repSchemeIndex) : 
    tier === 'T1' ? 5 : tier === 'T2' ? 3 : 4; // Default values if not provided
  
  // Set up state to track button states
  // 0: incomplete, 1: successful, 2: failed
  const [buttonStates, setButtonStates] = useState<number[]>(
    Array(numberOfSets).fill(0)
  );
  
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [areAllSetsSuccessful, setAreAllSetsSuccessful] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0); // Add a key to force timer reset
  
  // Determine if a button is clickable
  const isButtonClickable = (buttonId: number) => {
    // If it's the first button, it's always clickable
    if (buttonId === 0) return true;
    
    // Otherwise, the button is only clickable if the previous one has been clicked
    return buttonStates[buttonId - 1] !== 0;
  };
  
  // Show timer after a button is clicked
  const setWhetherTimerVisible = (clickedButtonId: number) => {
    // Only show the timer if this isn't the last set
    if (clickedButtonId < numberOfSets - 1) {
      setIsTimerVisible(true);
      // Reset the timer when showing it
      setTimerResetKey(prev => prev + 1);
    } else {
      setIsTimerVisible(false);
    }
  };
  
  // Determine the overall lift result
  const determineLiftResult = () => {
    // Check if all sets have been completed
    const allSetsCompleted = buttonStates.every(state => state !== 0);
    
    if (!allSetsCompleted) {
      // Not all sets have been attempted
      return 0;
    }
    
    // Check if all sets were successful
    const allSetsSuccessful = buttonStates.every(state => state === 1);
    
    if (allSetsSuccessful) {
      setAreAllSetsSuccessful(true);
      return 1; // Successful
    }
    
    return 2; // Failed (some sets failed)
  };
  
  // Handle the button click
  const handleButtonClick = (clickedButtonId: number) => {
    // Update the button state
    const newButtonStates = [...buttonStates];
    const prevState = newButtonStates[clickedButtonId];
    newButtonStates[clickedButtonId] = (newButtonStates[clickedButtonId] + 1) % 3;
    
    setButtonStates(newButtonStates);
    
    // Update timer visibility and reset timer
    setWhetherTimerVisible(clickedButtonId);
    
    // Update lift result
    setLiftResult(determineLiftResult());
  };
  
  // Get displayed reps per set
  const displayedRepsPerSet = gzclp.getDisplayedRepsPerSet ? 
    gzclp.getDisplayedRepsPerSet(tier, repSchemeIndex) : 
    tier === 'T1' ? 3 : tier === 'T2' ? 10 : 15; // Default values
  
  // Create lift buttons
  const liftButtons = [];
  for (let buttonId = 0; buttonId < numberOfSets; buttonId++) {
    const reps = gzclp.getNumberOfRepsInASet ? 
      gzclp.getNumberOfRepsInASet(tier, repSchemeIndex, buttonId) : 
      displayedRepsPerSet;
    
    liftButtons.push(
      <LiftButton
        key={buttonId}
        id={buttonId}
        reps={reps}
        isClickable={isButtonClickable(buttonId)}
        buttonState={buttonStates[buttonId]}
        areAllSetsSuccessful={areAllSetsSuccessful}
        handleButtonClick={handleButtonClick}
      />
    );
  }
  
  return (
    <View style={styles.liftContainer}>
      <View style={styles.liftInfoContainer}>
        <LiftInfo
          tier={tier}
          name={name}
          weight={weight}
          sets={numberOfSets}
          reps={displayedRepsPerSet}
        />
      </View>
      
      <View style={styles.liftButtonsContainer}>
        {liftButtons}
      </View>
      
      {isTimerVisible && <Timer tier={tier} resetKey={timerResetKey} />}
    </View>
  );
}

const styles = StyleSheet.create({
  liftContainer: {
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  liftInfoContainer: {
    marginBottom: 10,
  },
  liftButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
}); 