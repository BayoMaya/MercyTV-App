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

import OpenTok, { Publisher, Subscriber } from "react-native-opentok"; 
import type { Ref } from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LiveRoomScreenCopy extends Component {
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
    };
  }

  _setupLiveRoomMedia = async () => {
    try {
      //await OpenTok.setApiKey(opentoxAPI);
      await OpenTok.connect('1_MX40NjM0NDA1Mn5-MTU2MDE2MzI1OTIzMX5VNDJqblpZTnA3SjFqVUZiTkpKbXR5MWZ-UH4', this.state.openToxToken);
      this.setState({ 'loading': false });
    } catch (error) {
      alert(error.message);
    }
  };

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
    //this._setupLiveRoomMedia();
    await OpenTok.setApiKey('46344052');
    await OpenTok.connect('1_MX40NjM0NDA1Mn5-MTU2MDE2MzI1OTIzMX5VNDJqblpZTnA3SjFqVUZiTkpKbXR5MWZ-UH4', this.state.openToxToken);
    OpenTok.on(OpenTok.events.ON_SIGNAL_RECEIVED, e => console.error(e));
  }

  async componentDidMount(){
      await this.authCheckHandler(); //User Authentication Check
      //Screen Model Logic                 
      this.setState({ 'loading': false });
      OpenTok.on(OpenTok.events.ON_SESSION_DID_FAIL_WITH_ERROR, e => console.error(e));
      this.makeRemoteRequest(); 
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
                async()=>{
                await OpenTok.setApiKey('46344052');
                await OpenTok.connect('1_MX40NjM0NDA1Mn5-MTU2MDE2MzI1OTIzMX5VNDJqblpZTnA3SjFqVUZiTkpKbXR5MWZ-UH4', responseData.opentoktoken);
                OpenTok.on(OpenTok.events.ON_SIGNAL_RECEIVED, e => alert(e));
                this.setState({ 'openToxToken': responseData.opentoktoken });
                }
      }).done();
      } catch (error) {
          alert("Connection to server failed");
      }  
  };

  ref: Ref<typeof Publisher>;

  render() {
    if(this.state.loading){
          return(
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
    }
    return (
      <View style={styles.container}>
        <Button
          onPress={async () => {
            const isSent = await OpenTok.sendSignal(this.state.openToxSessionId, 'message', 'a');
            alert(isSent);
          }}
          title="Send signal"
        />

        <Button
          onPress={() => {
            if (typeof this.ref !== 'string') this.ref.switchCamera();
          }}
          title="Switch camera"
        />

        <Publisher
          sessionId={this.state.openToxSessionId}
          style={{ height: 100, width: 200, backgroundColor: 'black' }}
          cameraDirection="front" 
          video={ true } 
          ref={ref => { this.ref = ref; }}
          onPublishStart={() => { alert('Streaming Started')}}
          onPublishStop={() => { alert('Streaming Stopped')}}
          onPublishError={() => { alert('Streaming Error')}}
        />

        <Subscriber
          sessionId={this.state.openToxSessionId}
          style={{ height: 100, width: 200, backgroundColor: 'grey' }}
          onSubscribeStart={() => { alert('Watching Started')}}
          onSubscribeStop={() => { alert('Watching Stopped')}}
          onSubscribeError={() => { alert('Watching Error')}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});