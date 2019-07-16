import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import LogoHeader from '../LogoHeader';
//import { Icon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
       title: 'Account Settings',
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
      fullname:'',
      email:'',
      phone:'',
      password: '',
      spinner: false
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
      //this.makeRemoteRequest(); 
  }

  handleAccountUpdate=async()=>{
        const {fullname,email,phone,password} = this.state;

         this.setState({ spinner: true });
         const formData = new FormData();
         formData.append('UserID', this.state.userID);
         formData.append('UserName', this.state.userName);
         formData.append('UserTOKEN', this.state.loginToken);
         formData.append('UserDEVICE', '');
         formData.append('UserAppVersion', '1.0');
         formData.append('fullname', fullname);
         formData.append('email', email);
         formData.append('phone', phone);
         formData.append('password', password);
         formData.append('action', 'update');
         fetch('https://mylagosapp.mobi/mercyland/api/user_accountupdate', {
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
            this.setState({ spinner: false });
            alert(responseData.message); 
         }).done();
  }

  render() {
    return (
            <View style={styles.container}>
                <TextInput style={styles.inputBox}
                onChangeText={(fullname) => this.setState({fullname})}
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Full name"
                placeholderTextColor = "#002f6c"
                selectionColor="#fff"
                keyboardType="default"
                ref="fullname" 
                />

                <TextInput style={styles.inputBox}
                onChangeText={(email) => this.setState({email})}
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Email"
                placeholderTextColor = "#002f6c"
                selectionColor="#fff"
                keyboardType="email-address"
                ref="email" 
                />

                <TextInput style={styles.inputBox}
                onChangeText={(phone) => this.setState({phone})}
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Phone"
                placeholderTextColor = "#002f6c"
                selectionColor="#fff"
                keyboardType="default"
                ref="phone" 
                />
                
                <TextInput style={styles.inputBox}
                onChangeText={(password) => this.setState({password})} 
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor = "#002f6c"
                />

                <Button title="Save Changes" onPress={this.handleAccountUpdate} />

                <Spinner
                  visible={this.state.spinner}
                  textContent={'Loading...'}
                  textStyle={styles.spinnerTextStyle}
                />
            </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBox: {
        width: 300,
        backgroundColor: '#eeeeee', 
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10
    },
    spinnerTextStyle: {
      color: '#FFF'
    },
});
