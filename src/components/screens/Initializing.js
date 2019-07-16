import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, Keyboard, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Initializing extends React.Component {
  constructor(props) {
      super(props);
      this._bootstrapAsync();
  }

    // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userID = await AsyncStorage.getItem('@userID');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (userID !== null) {
       this.props.navigation.navigate('AppNav');
    } else {
       this.props.navigation.navigate('AuthNav');
    }
    //this.props.navigation.navigate(userID ? 'AppNav' : 'AuthNav');
  };

    
    // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}