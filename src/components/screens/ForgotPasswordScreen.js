import React, { Component } from 'react';
import { StyleSheet, Text, Image, ImageBackground, Dimensions, View, TextInput, TouchableOpacity, Button, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ForgotPasswordScreen extends Component {
    static navigationOptions = {
      title: 'Forgot Password',
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
            spinner: false
        }
    }

    handleForgotPassword=async()=>{
        const {email} = this.state;
        if (email.length > 0)
        {
         this.setState({ spinner: true });
         const formData = new FormData();
         formData.append('email', email);
         fetch('https://mylagosapp.mobi/mercyland/api/user_forgotpassword', {
           method: 'POST',
           headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data',
           },
           body: formData
         })
         .then((response) => response.json())
         .then((responseData) => {
                this.setState({ spinner: false });
                alert(responseData.message);
         }).done();
        } else {
          alert("Please provide your e-mail");
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
                />

                <Button title="Reset Password" onPress={this.handleForgotPassword} />

                <Text style={styles.paragraph} onPress={() => this.props.navigation.navigate('Login')}>{'\n'}Click here to login</Text>

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