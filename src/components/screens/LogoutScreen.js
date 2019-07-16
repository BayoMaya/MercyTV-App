import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class LogoutScreen extends Component {
    static navigationOptions = {
      title: 'Logout',
      headerLeft: null
    };

    constructor(props){
        super(props);
    }

    async componentWillMount() {
        try {
        await AsyncStorage.setItem('@userID', '');
        await AsyncStorage.setItem('@userData', '');
        await AsyncStorage.removeItem('@userID');
        await AsyncStorage.removeItem('@userData');
        alert("Logout successful!");
        this.props.navigation.navigate('AuthNav');
        } catch (error) {
          alert("Failed: " + error);
        }
    }

    componentDidMount(){
      async () => {
        try {
        await AsyncStorage.setItem('@userID', '');
        await AsyncStorage.setItem('@userData', '');
        await AsyncStorage.removeItem('@userID');
        await AsyncStorage.removeItem('@userData');
        await AsyncStorage.clear();
        this.props.navigation.navigate('AuthNav');
          //setTimeout(() => {
          //  this.props.navigation.navigate('Login');
          //}, 1000);
        } catch (error) {
          alert("Failed: " + error);
        }
      }
    }
    
    render() {
        return(
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
}

export default LogoutScreen;