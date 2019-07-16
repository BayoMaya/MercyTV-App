import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  Platform, PermissionsAndroid,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import TwilioVoice from 'react-native-twilio-programmable-voice';
import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
import type { Ref } from 'react';

import LogoHeader from '../LogoHeader';
//import { Icon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const openToxApiKey = '46344052';
const opentoksessionId = '1_MX40NjM0NDA1Mn5-MTU2MDE2MzI1OTIzMX5VNDJqblpZTnA3SjFqVUZiTkpKbXR5MWZ-UH4';
const opentokcodetoken = 'T1==cGFydG5lcl9pZD00NjM0NDA1MiZzaWc9N2VhYTQ4MGU0Yjk2N2IxNWNhYjYwZjhhNWZlY2U5YjRiODA5OTQ4OTpzZXNzaW9uX2lkPTFfTVg0ME5qTTBOREExTW41LU1UVTJNREUyTXpJMU9USXpNWDVWTkRKcWJscFpUbkEzU2pGcVZVWmlUa3BLYlhSNU1XWi1VSDQmY3JlYXRlX3RpbWU9MTU2MzI0MTkwNCZyb2xlPXB1Ymxpc2hlciZub25jZT0xNTYzMjQxOTA0LjQxNzM2MDE5Mzc0JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';
const twiliocodetoken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6InNjb3BlOmNsaWVudDpvdXRnb2luZz9hcHBTaWQ9QVBmNjRjNzAwMDE4ZmI0YTU0YjI5NDVhYmQyZWU4ZTczOCZhcHBQYXJhbXM9JmNsaWVudE5hbWU9UHJvcGhldEplcmVtaWFoT21vdG9GdWZleWluIHNjb3BlOmNsaWVudDppbmNvbWluZz9jbGllbnROYW1lPVByb3BoZXRKZXJlbWlhaE9tb3RvRnVmZXlpbiIsImlzcyI6IkFDN2YyMzUyODUxNmZhZTc3MzMzNTQzNDY4ZWFjNjQ3MWEiLCJleHAiOjE1NjMyNDgwNjh9.8TM-PrSPxt7Sx93CWQbrM6sqUegyMN8U_n7mKQoCLLY';

export default class LiveRoomScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
       title: 'Live Room',
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
      openToxApiKey: '46344052', //OpenTox
      openToxSessionId: '1_MX40NjM0NDA1Mn5-MTU2MDE2MzI1OTIzMX5VNDJqblpZTnA3SjFqVUZiTkpKbXR5MWZ-UH4', //OpenTox
      openToxToken: 'T1==cGFydG5lcl9pZD00NjM0NDA1MiZzaWc9N2VhYTQ4MGU0Yjk2N2IxNWNhYjYwZjhhNWZlY2U5YjRiODA5OTQ4OTpzZXNzaW9uX2lkPTFfTVg0ME5qTTBOREExTW41LU1UVTJNREUyTXpJMU9USXpNWDVWTkRKcWJscFpUbkEzU2pGcVZVWmlUa3BLYlhSNU1XWi1VSDQmY3JlYXRlX3RpbWU9MTU2MzI0MTkwNCZyb2xlPXB1Ymxpc2hlciZub25jZT0xNTYzMjQxOTA0LjQxNzM2MDE5Mzc0JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9', //OpenTox
      twilioToken: '', //Twilio
      twilioStatus: 'Loading', //Twilio
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

  async componentWillMount() {

  }

  async componentDidMount(){
      await this.authCheckHandler(); //User Authentication Check
      //Screen Model Logic                 
      //this.makeRemoteRequest(); 
      this.initTwilio();
  }

  initTwilio = async () => {
    if (Platform.OS === 'android') {
        await this.checkMicrophonePermission();
    }
    await TwilioVoice.initWithToken(twiliocodetoken);
    TwilioVoice.addEventListener('deviceReady', () => {
        alert("Twilio connected");
        this.setState({ 'twilioStatus': "Ready" });
    });
    if (Platform.OS === 'ios') { //required for ios
        TwilioVoice.configureCallKit({
            appName: 'MercyTV',
        });
    }
    TwilioVoice.addEventListener('deviceNotReady', function(data) {
       //Not connected
       alert(data);
       this.setState({ twilioStatus: "Error connecting" });
    });
    TwilioVoice.addEventListener('callRejected', function(data) {
      // Call rejected
      this.setState({ twilioStatus: "Call rejected" });
    });
    TwilioVoice.addEventListener('deviceDidReceiveIncoming', function(data) {
      // Incoming calls
      this.setState({ twilioStatus: "Incoming call" });
    });
      // to catch incoming call when the app was in the background
    TwilioVoice.getActiveCall()
      .then(incomingCall => {
      if (incomingCall){
        _deviceDidReceiveIncoming(incomingCall);
      }
    });
  };

  handleMakeCall=async()=>{
      // start a call
      TwilioVoice.connect({To: ''});
  }

  handleStopCall=async()=>{
      // end a call
      TwilioVoice.disconnect();
  }

  handleAcceptCall=async()=>{
      // accept incoming call
      TwilioVoice.accept();
  }

  handleRejectCall=async()=>{
      // reject a call
      TwilioVoice.reject();
  }

  handleIgnoreCall=async()=>{
      // ignore a call
      TwilioVoice.ignore();
  }

  makeRemoteRequest = () => {
      try{ 
      const formData = new FormData();
      formData.append('UserID', this.state.userID);
      formData.append('UserName', this.state.userName);
      formData.append('UserTOKEN', this.state.loginToken);
      formData.append('UserDEVICE', '');
      formData.append('UserAppVersion', '1.0');
      fetch('https://mylagosapp.mobi/mercyland/api/account_mediaaccesstoken', {
           method: 'POST',
           headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data'
           },
           body: formData
      })
      .then((response) => response.json())
      .then((responseData) => {
                //this.initTelephony.bind(this);
                async()=>{
                await TwilioVoice.initWithToken(responseData.twiliotoken);
                await OpenTok.setApiKey('46344052');
                await OpenTok.connect('1_MX40NjM0NDA1Mn5-MTU2MDE2MzI1OTIzMX5VNDJqblpZTnA3SjFqVUZiTkpKbXR5MWZ-UH4', responseData.opentoktoken);
                OpenTok.on(OpenTok.events.ON_SIGNAL_RECEIVED, e => alert(e));

                TwilioVoice.addEventListener('deviceReady', function() {
                  //Connected
                  alert("Twilio ready");
                  this.setState({ twilioStatus: "Ready" });
                });
                this.setState({ 'loading': false }); //Loaded, Now render
                this.setState({ 'openToxToken': responseData.opentoktoken });
                this.setState({ 'twilioToken': responseData.twiliotoken });
                }
      }).done();
      } catch (error) {
          alert("Connection to server failed");
      }  
  };

  async requestMicrophonePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          'title': 'Microphone Permission',
          'message': 'App needs access to you microphone ' +
                     'so you can talk with other users.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the microphone")
      } else {
        console.log("Microphone permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  checkMicrophonePermission(){
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then((result)=>{
      if(!result){
        this.requestMicrophonePermission();
      }
    });
  }

  render() {
    //if(this.state.loading){
    //      return(
    //        <View style={styles.container}>
    //          <ActivityIndicator size="large" color="#0000ff" />
    //        </View>
    //      )
    //}
    return (
      <View style={styles.container}>
        <View style={{ flex: 2, alignItems: 'stretch', flexDirection: 'column' }}>
          <OTSession apiKey={openToxApiKey} sessionId={opentoksessionId} token={opentokcodetoken}>
            <OTPublisher style={{ width: 100, height: 200 }} />
            <OTSubscriber style={{ width: 100, height: 200 }} />
          </OTSession>
        </View>
        //<View style={styles.footer}>
        //  <Text style={styles.paragraph}>{this.state.twilioStatus}</Text>
        //  <Button title="Call" onPress={this.handleMakeCall} />
        //  <Button title="Hang Up" onPress={this.handleStopCall} />
        //</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  //footer: {
  //  flex: 1,
  //  flexDirection: 'column',
  //  alignItems: 'center'
  //},
  //paragraph: {
  //  fontSize: 18,
  //  color: 'black',
  //  alignItems: 'center'
  //},
});