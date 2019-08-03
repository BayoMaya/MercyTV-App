import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import LogoHeader from '../LogoHeader';
import { SearchBar, List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class PaymentsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
       title: 'Payments',
       headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
       //headerTitle: <LogoHeader />,
       //headerRight: <LogoHeader />,
    }
  };

  constructor(props) {
    super(props);
    this._bootstrapAsync();
    this.arrayholder = [];
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
      this.makeRemoteRequest(); 
  }

  makeRemoteRequest = () => {
      this.setState({ loading: true });
      const formData = new FormData();
      formData.append('UserID', this.state.userID);
      formData.append('UserName', this.state.userName);
      formData.append('UserTOKEN', this.state.loginToken);
      formData.append('UserDEVICE', '');
      formData.append('UserAppVersion', '1.0');
      try {
      fetch('https://mylagosapp.mobi/mercyland/api/payments', {
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
                this.setState({ 'data': responseData });
                this.arrayholder = responseData;   
                this.setState({ loading: false });
      }).done();
      } catch (error) {
        console.warn(error);
        //throw error;
        this.setState({ loading: false });
      }
  };

  searchFilterFunction = text => {    
    const newData = this.arrayholder.filter(item => {      
      const itemData = `${item.title.toUpperCase()} ${item.details.toUpperCase()}`;
    
      const textData = text.toUpperCase();
      
      return itemData.indexOf(textData) > -1;    
    });
    this.setState({ data: newData });  
  };

  renderHeader = () => {
    return (
           <SearchBar placeholder="Type Here..." 
             lightTheme 
             round
             onChangeText={text => this.searchFilterFunction(text)}
             autoCorrect={false}  
           />
    );  
  };

  renderListEmptyComponent = () => {
    return (
      <View style={styles.row}>
          <Text style={styles.details}>No data available</Text>
      </View>
    );
  };

  renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <Image style={styles.thumbnail} source={{ uri: item.photo }} />
        <View style={styles.rowText}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.details}>{item.details}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    if(this.state.loading){
          return(
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
    }
    return (
      <FlatList
        data={this.state.data}
        extraData={this.state}  
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={this.renderListEmptyComponent}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
      />
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
  rowText: {
    flex: 1
  },
  thumbnail: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  },
  title: {
    fontWeight: 'bold',
    paddingRight: 10,
    color: 'black',
  },
  details: {
    fontSize: 18,
    color: 'black',
  },
  date: {
    fontSize: 14,
    color: 'black',
  },
});
