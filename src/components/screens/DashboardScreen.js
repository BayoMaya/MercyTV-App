import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  BackHandler,
  ImageBackground,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LogoHeader from '../LogoHeader';

export default class DashboardScreen extends React.Component {
  //static navigationOptions = ({ navigation }) => {
  //  return {
  //     title: 'Dashboard',
       //headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
       //headerTitle: <LogoHeader />,
       //headerRight: <LogoHeader />,
  //  }
  //};

  constructor(props) {
    super(props);
    this._bootstrapAsync();
    this.state = {
      userID: '',
      userName: '',
      userData: '',
      loginToken: '',
      loading: true,
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
      this.setState({ 'loading': false });
      this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
      
  };

  render() {
    return (
      <View style={styles.container}>
      <ImageBackground style={{width: '100%', height: '100%'}} source={require('./assets/bg.png')}>
        <View style={styles.innercontainer}> 
          <Text style={styles.texttitle}> WELCOME </Text>
          <Text style={styles.textparagraph}> {this.state.userName} </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.textsubtitle}>NEXT SESSION </Text>
          <Text style={styles.textparagraph}>24 July, 2019. 8:40 pm</Text>
        </View>
      </ImageBackground>
      </View>
    );
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
      flex: 2,
    },
    footer: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'transparent',
      alignItems: 'center',
    },
    texttitle: {
      fontSize: 21,
      color: 'white',
    },
    textsubtitle: {
      fontSize: 19,
      color: 'white',
    },
    textparagraph: {
      fontSize: 17,
      color: 'white',
    },
});