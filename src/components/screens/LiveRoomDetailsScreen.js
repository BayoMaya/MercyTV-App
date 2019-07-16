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

export default class LiveRoomDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
       title: 'Meet The Prophet',
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
      data: [],
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
  }

  render() {
    return (
            <View style={styles.container}>
                <Text style={styles.title}>Live Room With The Prophet</Text>
                <Text style={styles.paragraph}>You get to meet and have a personal communication with the Prophet</Text>
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
  title: {
    margin: 24,
    marginTop: 0,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
  },
});
