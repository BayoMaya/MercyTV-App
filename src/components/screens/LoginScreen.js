import React, { Component } from 'react';
import { StyleSheet, Text, Image, ImageBackground, Dimensions, View, TextInput, TouchableOpacity, Button, BackHandler, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default class LoginScreen extends Component {
    static navigationOptions = {
      title: 'Login',
      headerLeft: null,
      headerStyle: {
        backgroundColor: '#FF538F',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: '#fff',
    };

    constructor(props){
        super(props);
        this.state={
            email:'',
            password: '',
            spinner: false
        }
    }

    async authCheckHandler() {
      try{ 
        AsyncStorage.getItem('@userID').then((value) => {
          if (value) {
            this.props.navigation.navigate('AppNav');
          } 
        });
      } catch (error) {
            alert(error.message);
      }
    }

    async componentDidMount(){
      await this.authCheckHandler(); //User Authentication Check      
      //Model Logic  
    }

    async componentWillUnmount() {

    }

    handleLogin=async()=>{
        const {email,password} = this.state;
        if (email.length > 0 && password.length > 0)
        {
         this.setState({ spinner: true });
         const formData = new FormData();
         formData.append('email', email);
         formData.append('password', password);
         fetch('https://mylagosapp.mobi/mercyland/api/user_login', {
           method: 'POST',
           headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data',
           },
           body: formData
         })
         .then((response) => response.json())
         .then((responseData) => {
            if(responseData.status==="success"){
                //save data with asyncstorage
                AsyncStorage.setItem('@userID', responseData.userid);
                AsyncStorage.setItem('@userData', JSON.stringify(responseData));
                Keyboard.dismiss();
                this.setState({ spinner: false });
                this.props.navigation.navigate('AppNav');
            } else {
                this.setState({ spinner: false });
                alert(responseData.message);
            }
         }).done();
        } else {
          alert("Please provide your login details");
        }
    }
    
    render() {
        return(
            <View style={styles.container}>
            <ImageBackground style={{width: '100%', height: '100%'}} source={require('./assets/bg-02.jpg')}>
                <View style={styles.innercontainer}> 
                <Image style={styles.logo} source={require('./assets/snack-icon.png')} />

                <TextInput style={styles.inputBox}
                onChangeText={(email) => this.setState({email})}
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Email"
                placeholderTextColor = "#002f6c"
                selectionColor="#fff"
                keyboardType="email-address"
                onSubmitEditing={()=> this.password.focus()}/>
                
                <TextInput style={styles.inputBox}
                onChangeText={(password) => this.setState({password})} 
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor = "#002f6c"
                ref={(input) => this.password = input}
                />

                <Button title="Login" onPress={this.handleLogin} />

                <Text style={styles.paragraph} onPress={() => this.props.navigation.navigate('ForgotPassword')}>{'\n'} Forgotten your password? Click here to reset {'\n \n'}</Text>
                <Text style={styles.paragraph} onPress={() => this.props.navigation.navigate('Register')}>Click here to register {'\n \n'}</Text>
                <Spinner
                  visible={this.state.spinner}
                  textContent={'Loading...'}
                  textStyle={styles.spinnerTextStyle}
                />
                </View>
            </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#455a64',
    },
    innercontainer: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 2
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
    logo: {
    height: 128,
    width: 128,
    },
    spinnerTextStyle: {
      color: '#FFF'
    },
});