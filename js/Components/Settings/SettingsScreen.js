import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';

import MenuItem from 'gzclp/js/Components/Common/MenuItem';


export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Settings',
    headerLeft: <Button
      title='Done'
      color='#fff'
      onPress={() => {
        navigation.state.params.refreshHomeScreen();
        navigation.goBack(null);
      }}
    />
  });

  // Remove stored data and reset program state to initial values
  async handleResetButtonPress() {
    try {
      await gzclp.deleteSavedProgramState();
      gzclp.resetProgramState();
    } catch (error) {
      console.log("Error removing data");
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <ScrollView>
        <MenuItem
          menuItemText='Edit Sessions'
          onPress={() => navigate('EditSessions')}
          hasNavArrow={true}
        />
        <MenuItem
          menuItemText='Increments'
          onPress={() => navigate('Increments')}
          hasNavArrow={true}
        />

        <View style={{marginTop: 22}}>
          <MenuItem
            menuItemText='Reset Everything'
            onPress={() => this.handleResetButtonPress()}
            hasNavArrow={false}
          />
        </View>
      </ScrollView>
    )
  }
}
