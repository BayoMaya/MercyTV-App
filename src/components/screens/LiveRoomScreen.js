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

import { NodePlayerView, NodeCameraView } from 'react-native-nodemediaclient';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const settings = {
  camera: { cameraId: 1, cameraFrontMirror: true },
  audio: { bitrate: 32000, profile: 1, samplerate: 44100 },
  video: {
    preset: 24,
    bitrate: 400000,
    profile: 2,
    fps: 30,
    videoFrontMirror: true
  }
};

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
      isPublishing: false,
      isPublish: false,
      publishBtnTitle: 'Start Publish',
      publishingState: false,
      hasPermission: false,
      flashenable: false,
      isStopwatchStart: false,
      resetStopwatch: false,
    };
    this.startStopStopWatch = this.startStopStopWatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
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
      this.checkPermissions();       
  }

  async componentWillUnmount() {
    //this.vb.stop();
  }

  checkPermissions = async () => {
    console.log("Checking Permissions Android");
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ]);
      let hasAllPermissions = true;
      Object.keys(granted).forEach(key => {
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        if (granted[key] !== "granted") {
          console.log("Does not have permission for: ", granted[key]);
          hasAllPermissions = false;
        }
      });
      console.log("hasAllPermissions: ", hasAllPermissions);
      this.setState({ hasPermission: hasAllPermissions });
    } catch (err) {
      console.warn(err);
    }
  };

  onPressPublishBtn = async () => {
    const { isPublishing: publishingState, hasPermission } = this.state;
    if (Platform.OS === "android") {
      if (!hasPermission) {
        this.checkPermissions();
        return;
      }
    }

    if (publishingState) {
      this.vb.stop();
    } else {
      this.vb.start();
    }

    this.setState({ isPublishing: !publishingState });
  };

  startStopStopWatch() {
    this.setState({isStopwatchStart: !this.state.isStopwatchStart, resetStopwatch: false});
  }
  resetStopwatch() {
    this.setState({isStopwatchStart: false, resetStopwatch: true});
  }

  getFormattedTime(time) {
      this.currentTime = time;
  }

  render() {
    if(this.state.userID == '1' || this.state.userID == '2'){
    return (
    <View style={styles.container} >  
      <NodeCameraView 
        style={{ height: 400, flex: 1 }}
        ref={(vb) => { this.vb = vb }}
        outputUrl = {"rtmp://live.mux.com/app/73e2fab0-376f-6a55-976b-b3e71d27b7d0"}
        camera={{ cameraId: 1, cameraFrontMirror: true }}
        audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
        video={{ preset: 12, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
        autopreview={true} 
      /> 
      <Stopwatch laps msecs 
            start={this.state.isStopwatchStart} //To start
            reset={this.state.resetStopwatch} //To reset
            options={timerOptions} //options for the styling
            getTime={this.getFormattedTime} 
      />
      <Button  
        onPress={() => {
          if (this.state.isPublish) {
              this.setState({ publishBtnTitle: 'Start Publish', isPublish: false });
              this.setState({isStopwatchStart: false, resetStopwatch: true});
              this.vb.stop(); 
          } else {
              this.setState({ publishBtnTitle: 'Stop Publish', isPublish: true });
              this.setState({isStopwatchStart: true, resetStopwatch: false});
              this.vb.start(); this.startStopStopWatch;
          }
        }}
        title={this.state.publishBtnTitle}
        color="#841584" 
      /> 
      <Button title="Reverse Camera" onPress={() => { this.vb.switchCamera(); this.state.flashenable = false; color="#FF538F"}} />
      <Button title="Switch Flashlight" onPress={() => { this.state.flashenable = !this.state.flashenable; this.vb.flashEnable(this.state.flashenable); }} />
    </View>
    );
    }
    return (
            <View style={styles.container} > 
                <NodePlayerView 
                  style={{ height: 200 }}
                  ref={(vp) => { this.vp = vp }}
                  inputUrl={"https://stream.mux.com/X6j6XwDfFGdC1Z21q2JEZfex00cOJFP1B.m3u8"}
                  scaleMode={"ScaleAspectFit"}
                  bufferTime={300}
                  maxBufferTime={1000}
                  autoplay={true} 
                /> 
            </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  text: {
    fontSize: 17,
    color: '#FF538F',
  },
  /**nodePlayerView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  nodeCameraView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  playBtn: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#333",
    borderColor: "#333",
    borderWidth: 3,
    borderRadius: 2,
    height: 50,
    width: deviceWidth / 2,
    paddingVertical: 10,
    paddingHorizontal: 30,
    elevation: 4,
    marginVertical: 10
  }**/
});

const timerOptions = {
  container: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    width: 220,
  },
  text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 7,
  }
};