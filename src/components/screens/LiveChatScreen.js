import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import type { Ref } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LiveChatScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
       title: 'Live Chat',
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
      onlineusers: [],
      messages: [{"chatID":"0","userID":"0","userName":"Admin","userAdmin":"0","chatMessage":"Welcome to our chatroom","time":"16:04:36","date":"15-07-2019","userPhoto":"http:\/\/mylagosapp.mobi\/mercyland\/view\/uploads\/avatar.png","time_ago":"3 hours ago "}],
      chatmsg: '',
      lastmessageid: '',
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
      this.getChatMessages();
      setInterval(() => {
        // Your code
        this.getChatMessages();
        //this.getChatroomUsers;
      }, 6000);
      this.setState({ 'loading': false }); //Loaded, Now render
  }

  componentWillUnmount() {
    //clearInterval(this._interval);
  }

  async sendMessage() {
    // send chat message to our server, with sender name. await
    try {
    if (this.state.chatmsg.length > 0)
        {
         const formData = new FormData();
         formData.append('UserID', this.state.userID);
         formData.append('UserName', this.state.userName);
         formData.append('UserTOKEN', this.state.loginToken);
         formData.append('UserDEVICE', '');
         formData.append('UserAppVersion', '1.0');
         formData.append('message', this.state.chatmsg);
         formData.append('action', 'post_chat');
         fetch('https://mylagosapp.mobi/mercyland/api/livechat', {
           method: 'POST',
           headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data',
           'LoginToken': this.state.loginToken,
           'DeviceOrigin': 'Mobile App',
           },
           body: formData
         })
         .then((response) => response.json())
         .then((responseData) => {
            if(responseData.status==="success"){
                Keyboard.dismiss();
                this.setState({ chatmsg: '' });
                this.getChatMessages();
            } else {
                alert("An error occurred. Please try again");
            }
         }).done();
    } else {
      alert("Please provide your chat message");
    }
    } catch (error) {
      alert("Connection to server failed: " + error.message);
    }
  }

  getChatMessages = () => {
      const chatsFormData = new FormData();
      chatsFormData.append('UserID', this.state.userID);
      chatsFormData.append('UserName', this.state.userName);
      chatsFormData.append('UserTOKEN', this.state.loginToken);
      chatsFormData.append('UserDEVICE', '');
      chatsFormData.append('UserAppVersion', '1.0');
      chatsFormData.append('action', 'display_chat');
      chatsFormData.append('lastmessageid', this.state.lastmessageid);
      fetch('https://mylagosapp.mobi/mercyland/api/livechat', {
           method: 'POST',
           headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data',
           },
           body: chatsFormData
      })
      .then((response) => response.json())
      .then((responseData) => {
                this.setState({ 'messages': responseData });
      }).done();
  };

  /**getChatroomUsers = () => {
      const formData = new FormData();
      formData.append('UserID', this.state.userID);
      formData.append('UserName', this.state.userName);
      formData.append('UserTOKEN', this.state.loginToken);
      formData.append('UserDEVICE', '');
      formData.append('UserAppVersion', '1.0');
      formData.append('action', 'online_users');
      fetch('https://mylagosapp.mobi/mercyland/api/livechat', {
           method: 'POST',
           headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data',
           'AuthorizationToken': this.state.loginToken,
           'DeviceOrigin': 'Mobile App',
           },
           body: formData
      })
      .then((response) => response.json())
      .then((responseData) => {
                this.setState({ onlineusers: responseData });
      }).done();
  };**/

  renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <Image style={styles.avatar} source={{ uri: item.userPhoto }} />
        <View style={styles.rowText}>
          <Text style={styles.sender}>{item.userName}</Text>
          <Text style={styles.message}>{item.chatMessage}</Text>
        </View>
      </View>
    );
  };

  _keyExtractor = (item, index) => item.chatID;

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
             <FlatList 
              data={this.state.messages} 
              renderItem={this.renderItem} 
              extraData={this.state}  
              ref={ref => this.flatList = ref}
              onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
              onLayout={() => this.flatList.scrollToEnd({animated: true})}
              //keyExtractor={this._keyExtractor} 
              inverted  
             /> 
             <KeyboardAvoidingView behavior="padding">
             <View style={styles.footer}>
                <TextInput
                  value={this.state.chatmsg}
                  onChangeText={text => this.setState({chatmsg: text})}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="Type your message..."
                />
               <TouchableOpacity onPress={this.sendMessage.bind(this)}>
                <Text style={styles.send}>Send</Text>
               </TouchableOpacity>
             </View>
             </KeyboardAvoidingView>
            </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  },
  rowText: {
    flex: 1
  },
  message: {
    fontSize: 18,
    color: 'black',
  },
  sender: {
    fontWeight: 'bold',
    paddingRight: 10,
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
  },
  input: {
    paddingHorizontal: 20,
    fontSize: 18,
    flex: 1,
  },
  send: {
    alignSelf: 'center',
    color: 'lightseagreen',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 20,
  },
});