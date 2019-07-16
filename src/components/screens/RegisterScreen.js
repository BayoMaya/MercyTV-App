import React, { Component } from 'react';
import { StyleSheet, Text, Image, ImageBackground, Dimensions, View, TextInput, TouchableOpacity, Button, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default class RegisterScreen extends Component {
    static navigationOptions = {
      title: 'Register',
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
            fullname:'',
            email:'',
            phone:'',
            password: '',
            spinner: false
        }
    }

    handleRegistration=async()=>{
        const {fullname,email,phone,password} = this.state;
        if (fullname.length > 0 && email.length > 0 && phone.length > 0 && password.length > 0)
        {
         this.setState({ spinner: true });
         const formData = new FormData();
         formData.append('fullname', this.state.fullname);
         formData.append('email', this.state.email);
         formData.append('phone', this.state.phone);
         formData.append('password', this.state.password);
         formData.append('action', 'signup');
         fetch('https://mylagosapp.mobi/mercyland/api/user_signup', {
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
                this.setState({ spinner: false });
                this.props.navigation.navigate('AppNav');
            } else {
                this.setState({ spinner: false });
                alert(responseData.message);
            }
         }).done();
        } else {
          alert("Please provide your information");
        }
    }
    
    render() {
        return(
            <View style={styles.container}>
            <ImageBackground style={{width: '100%', height: '100%'}} source={require('./assets/bg-02.jpg')}>
                <View style={styles.innercontainer}> 
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
                onSubmitEditing={()=> this.password.focus()}/>
                
                <TextInput style={styles.inputBox}
                onChangeText={(password) => this.setState({password})} 
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor = "#002f6c"
                ref={(input) => this.password = input}
                />

                <Button title="Register" onPress={this.handleRegistration} />

                <Text style={styles.paragraph} onPress={() => this.props.navigation.navigate('Login')}>{'\n'} Click here to login</Text>

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
    spinnerTextStyle: {
      color: '#FFF'
    },
});