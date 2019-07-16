import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, Keyboard, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DrawerNavigator from './Navigations';

export default class AccountScreen extends React.Component {
  constructor(props) {
      super(props);
      this._bootstrapAsync();
  }

    // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userID = await AsyncStorage.getItem('userID');
    if (!userID) {
       this.props.navigation.navigate('AuthNav');
    }
  };
    
  render() {
    return (
      <DrawerNavigator />
    );
  }
}