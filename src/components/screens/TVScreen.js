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

import Video from 'react-native-video';
import { NodePlayerView } from 'react-native-nodemediaclient';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class TVScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
       title: 'Mercy TV',
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
      data: '',
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

  async componentWillUnmount() {
    this.vp.stop();
  }

  render() {
    return (
            <View style={styles.container} > 
                <NodePlayerView 
                  style={styles.backgroundVideo}
                  ref={(vp) => { this.vp = vp }}
                  inputUrl={"https://mn-nl.mncdn.com/ezcdn_3WIgfCOhdE85/3WIgfCOhdE85_1/playlist.m3u8"}
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
