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

import { OTSession, OTPublisher, OTSubscriber } from 'opentok-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LiveRoomScreenOLD extends Component {
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
    this.openToxApiKey= '46344052';
    this.openToxSessionId= '1_MX40NjM0NDA1Mn5-MTU2MDE2MzI1OTIzMX5VNDJqblpZTnA3SjFqVUZiTkpKbXR5MWZ-UH4';
    this.openToxToken= 'T1==cGFydG5lcl9pZD00NjM0NDA1MiZzaWc9N2VhYTQ4MGU0Yjk2N2IxNWNhYjYwZjhhNWZlY2U5YjRiODA5OTQ4OTpzZXNzaW9uX2lkPTFfTVg0ME5qTTBOREExTW41LU1UVTJNREUyTXpJMU9USXpNWDVWTkRKcWJscFpUbkEzU2pGcVZVWmlUa3BLYlhSNU1XWi1VSDQmY3JlYXRlX3RpbWU9MTU2MzI0MTkwNCZyb2xlPXB1Ymxpc2hlciZub25jZT0xNTYzMjQxOTA0LjQxNzM2MDE5Mzc0JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';
    this.sessionOptions = {
      connectionEventsSuppressed: true, // default is false
      androidZOrder: 'onTop', // Android only - valid options are 'mediaOverlay' or 'onTop'
      androidOnTop: 'publisher',  // Android only - valid options are 'publisher' or 'subscriber'
      useTextureViews: true,  // Android only - default is false
      isCamera2Capable: true, // Android only - default is false
    };
    //this.otSessionRef = React.createRef();
    this.sessionEventHandlers = {
      streamCreated: event => {
        alert('Stream created!');
      },
      streamDestroyed: event => {
        console.log('Stream destroyed!');
      },
      sessionConnected: event => {
        alert('Session connected');
      }
    };
    this.publisherProperties = {
      videoTrack: true,
      audioTrack: true,
      videoSource: 'camera', //Or 'screen'
      publishAudio: true,
      publishVideo: true,
      cameraPosition: 'front'
    };
    this.publisherEventHandlers = {
      streamCreated: event => {
        alert('Publisher stream created!');
      },
      streamDestroyed: event => {
        console.log('Publisher stream destroyed!');
      }
    };
    this.subscriberProperties = {
      subscribeToAudio: true,
      subscribeToVideo: true,
    };
    this.subscriberEventHandlers = {
      error: (error) => {
        console.log('There was an error with the subscriber');
      },
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
      //this.initTwilio();
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
                /**async()=>{
                await OpenTok.setApiKey('46344052');
                await OpenTok.connect('1_MX40NjM0NDA1Mn5-MTU2MDE2MzI1OTIzMX5VNDJqblpZTnA3SjFqVUZiTkpKbXR5MWZ-UH4', responseData.opentoktoken);
                OpenTok.on(OpenTok.events.ON_SIGNAL_RECEIVED, e => alert(e));
                //await TwilioVoice.initWithToken(responseData.twiliotoken);

                //TwilioVoice.addEventListener('deviceReady', function() {
                //  //Connected
                //  alert("Twilio ready");
                //  this.setState({ twilioStatus: "Ready" });
                //});
                this.setState({ 'loading': false }); //Loaded, Now render
                this.setState({ 'openToxToken': responseData.opentoktoken });
                this.setState({ 'twilioToken': responseData.twiliotoken }); 
                }**/
      }).done();
      } catch (error) {
          alert("Connection to server failed");
      }  
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
          <OTSession apiKey={this.openToxApiKey} sessionId={this.openToxSessionId} token={this.openToxToken} options={this.sessionOptions} eventHandlers={this.sesssionEventHandlers}>
            <OTPublisher style={{ width: 100, height: 200 }} properties={this.publisherProperties} eventHandlers={this.publisherEventHandlers} />
            <OTSubscriber style={{ width: 100, height: 200 }} properties={this.subscriberProperties} eventHandlers={this.subscriberEventHandlers} />
          </OTSession>
      </View>
    );
  }
}
