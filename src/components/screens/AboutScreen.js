import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Button,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import LogoHeader from '../LogoHeader';
//import { Icon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class AboutScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
       title: 'About',
       headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
       //headerTitle: <LogoHeader />,
       //headerRight: <LogoHeader />,
    }
  };

  constructor(props) {
    super(props);
    this._bootstrapAsync();
    this.state = {
      userID: '',
      userName: '',
      userData: '',
      loginToken: '',
      loading: true,
      data: 'Loading...',
    };
  }

  _bootstrapAsync = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    if (userID === null) {
       this.props.navigation.navigate('AuthNav');
    } 
  };

  async authCheckHandler() {
      try {
        await AsyncStorage.getItem('@userData').then((value) => {
          if (value) {
            //LOGGED IN USER DATA JSON.parse(retrievedItem)
            const item = JSON.parse(value);
            this.setState({ 'userData': value });
            this.setState({ 'userID': item.userid });
            this.setState({ 'userName': item.username });
            this.setState({ 'loginToken': item.logintoken });
          } else {
            this.props.navigation.navigate('AuthNav'); //Redirect To Login For NON-LOGGED IN USERS
          }
        });
      } catch (error) {
        console.error(error.message);
      }
  }

  async componentDidMount(){
      await this.authCheckHandler(); //User Authentication Check
      //Screen Model Logic                 
      this.makeRemoteRequest(); 
  }

  makeRemoteRequest = () => {
      this.setState({ loading: true });
      const formData = new FormData();
      formData.append('UserID', this.state.userID);
      formData.append('UserName', this.state.userName);
      formData.append('UserTOKEN', this.state.loginToken);
      formData.append('UserDEVICE', '');
      formData.append('UserAppVersion', '1.0');
      fetch('https://mylagosapp.mobi/mercyland/api/about', {
           method: 'POST',
           headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data',
           'LoginToken': this.state.loginToken,
           'DeviceOrigin': 'Mobile App',
           },
           body: formData
      })
      .then((response) => response.json())
      .then((responseData) => {
            if(responseData.status==="success"){
                this.setState({ 'data': responseData.content });
            } else {
                alert("Error occurred accessing the server. Please try again");
            }
      }).done();
  };

  render() {
    return (
            <View style={styles.container}>
                <Text style={styles.paragraph}>{this.state.data}</Text>
            </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
});
