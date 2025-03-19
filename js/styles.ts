import { StyleSheet, Dimensions } from 'react-native';

const DEVICE_W = Dimensions.get('window').width;

export const layoutConstants = {
  HORIZONTAL_PADDING: 15,
  VERTICAL_PADDING: 12,
  SCREEN_BOTTOM_MARGIN: 20
};

const BUTTON_MARGIN = 8;
const BUTTON_SIZE = (DEVICE_W - (2 * layoutConstants.HORIZONTAL_PADDING)) / 5 - BUTTON_MARGIN;

export const colors = {
  primaryColor: '#fa375a',   // Pinky red (original primaryColour)
  lightGrey: '#f0f0f0',
  mediumGrey: '#909090',
  darkGrey: '#555',
  failed: '#999',
  inactiveLiftButton: '#f0f0f0',
  underlayColor: '#f5f5f5',
  negativeRed: '#ff3d3d',
  positiveGreen: '#4cd964'
};

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingBottom: layoutConstants.SCREEN_BOTTOM_MARGIN,
  },
  contentContainer: {
    flex: 1,
    padding: layoutConstants.HORIZONTAL_PADDING,
  },
  header: {
    backgroundColor: colors.primaryColor
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  genericContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: layoutConstants.HORIZONTAL_PADDING,
    paddingVertical: layoutConstants.VERTICAL_PADDING,
    marginBottom: 1,
  },
  
  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: layoutConstants.VERTICAL_PADDING,
    marginBottom: layoutConstants.VERTICAL_PADDING / 2,
  },
  paragraph: {
    marginTop: layoutConstants.VERTICAL_PADDING,
  },
  
  menuHeading: {
    paddingHorizontal: layoutConstants.HORIZONTAL_PADDING,
    marginBottom: 8,
    marginTop: 20,
    color: colors.darkGrey,
  },
  
  navArrow: {
    marginLeft: 15,
  },
  
  nextSessionTitle: {
    color: colors.primaryColor,
    marginBottom: 5,
    fontSize: 17,
    fontWeight: 'bold',
  },
  completedSessionTitle: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  
  // Lift button styles
  liftContainer: {
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  liftInfoContainer: {
    paddingHorizontal: layoutConstants.HORIZONTAL_PADDING,
    paddingTop: layoutConstants.VERTICAL_PADDING,
  },
  liftName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  liftDetails: {
    marginVertical: 5,
  },
  liftButtonsContainer: {
    marginHorizontal: layoutConstants.HORIZONTAL_PADDING,
    marginBottom: layoutConstants.VERTICAL_PADDING,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  individualLiftButtonContainer: {
    marginRight: BUTTON_MARGIN,
    marginTop: BUTTON_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  liftButtonClickable: {
    backgroundColor: 'white',
    borderColor: colors.primaryColor,
    borderWidth: 1.25,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonNotClickable: {
    backgroundColor: colors.inactiveLiftButton,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonSuccessful: {
    backgroundColor: colors.primaryColor,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonAllSuccessful: {
    backgroundColor: colors.positiveGreen,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonFailed: {
    backgroundColor: colors.failed,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Button borders
  liftButtonBorderSuccessful: {
    borderColor: colors.primaryColor,
    borderWidth: 1.5,
    width: BUTTON_SIZE + 5,
    height: BUTTON_SIZE + 5,
    borderRadius: (BUTTON_SIZE + 5) / 2,
    position: 'absolute',
  },
  liftButtonBorderFailed: {
    borderColor: colors.failed,
    borderWidth: 1.5,
    width: BUTTON_SIZE + 5,
    height: BUTTON_SIZE + 5,
    borderRadius: (BUTTON_SIZE + 5) / 2,
    position: 'absolute',
  },
  liftButtonBorderAllSuccessful: {
    borderColor: colors.positiveGreen,
    borderWidth: 1.5,
    width: BUTTON_SIZE + 5,
    height: BUTTON_SIZE + 5,
    borderRadius: (BUTTON_SIZE + 5) / 2,
    position: 'absolute',
  },
  
  // Button text styles
  liftButtonTextClickable: {
    color: colors.primaryColor,
  },
  liftButtonTextNotClickable: {
    color: colors.mediumGrey,
  },
  liftButtonTextSuccessful: {
    color: '#fff',
  },
  liftButtonTextFailed: {
    color: '#fff',
  },
  
  // Timer styles
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkGrey,
    paddingHorizontal: layoutConstants.HORIZONTAL_PADDING,
    paddingVertical: 2,
  },
  timerNumbers: {
    width: 50,
    color: 'white',
    fontSize: 18,
  },
  timerText: {
    color: 'white',
  },
  
  // Button styles
  button: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
}); 