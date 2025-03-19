import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../js/styles';

interface LiftButtonProps {
  id: number;
  reps: number;
  isClickable: boolean;
  buttonState: number;
  areAllSetsSuccessful: boolean;
  handleButtonClick: (id: number) => void;
}

export default function LiftButton({
  id,
  reps,
  isClickable,
  buttonState,
  areAllSetsSuccessful,
  handleButtonClick,
}: LiftButtonProps) {
  const isClicked = buttonState !== 0;
  const isSuccessful = buttonState === 1;
  
  // If button is clicked, display a tick or cross depending on
  // whether lift is successful or failed. Otherwise display number of reps
  const buttonText = isClicked ? (isSuccessful ? '✓' : '✕') : reps;
  
  // Apply style depending on whether button is inactive, active, or clicked
  // And, if clicked, successful or unsuccessful
  let buttonStyle, textStyle;
  
  if (isClicked) {
    if (isSuccessful) {
      buttonStyle = styles.liftButtonSuccessful;
      textStyle = styles.liftButtonTextSuccessful;
    } else {
      buttonStyle = styles.liftButtonFailed;
      textStyle = styles.liftButtonTextFailed;
    }
  } else if (isClickable) {
    buttonStyle = styles.liftButtonClickable;
    textStyle = styles.liftButtonTextClickable;
  } else {
    buttonStyle = styles.liftButtonNotClickable;
    textStyle = styles.liftButtonTextNotClickable;
  }
  
  if (areAllSetsSuccessful) {
    buttonStyle = styles.liftButtonAllSuccessful;
  }
  
  return (
    <View style={styles.individualLiftButtonContainer}>
      <TouchableOpacity
        activeOpacity={1}
        style={buttonStyle}
        onPress={() => {
          if (isClickable) {
            handleButtonClick(id);
          }
        }}
      >
        <Text style={textStyle}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  individualLiftButtonContainer: {
    margin: 5,
    position: 'relative',
  },
  liftButtonClickable: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  liftButtonNotClickable: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  liftButtonSuccessful: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6ffe6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  liftButtonFailed: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  liftButtonAllSuccessful: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccffcc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  liftButtonTextClickable: {
    color: colors.primaryColor,
    fontSize: 16,
    fontWeight: '500',
  },
  liftButtonTextNotClickable: {
    color: '#999',
    fontSize: 16,
  },
  liftButtonTextSuccessful: {
    color: '#00b300',
    fontSize: 20,
    fontWeight: 'bold',
  },
  liftButtonTextFailed: {
    color: '#e60000',
    fontSize: 20,
    fontWeight: 'bold',
  }
}); 