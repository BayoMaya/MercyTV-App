import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Dimensions, StatusBar }   from 'react-native';
import { createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
  createAppContainer} 
from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// You can import from local files
import Initializing from './Initializing';
import DashboardScreen from './DashboardScreen';
import LoginScreen from './LoginScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import RegisterScreen from './RegisterScreen';
import LogoutScreen from './LogoutScreen';
import LiveRoomScreen from './LiveRoomScreen';
import LiveChatScreen from './LiveChatScreen';
import LiveRoomDetailsScreen from './LiveRoomDetailsScreen';
import PaymentsScreen from './PaymentsScreen';
import SettingsScreen from './SettingsScreen';
import NotificationsScreen from './NotificationsScreen';
import AboutScreen from './AboutScreen';
import TVScreen from './TVScreen';

//Step One - Tab Navigator 
const RoomTabs = createBottomTabNavigator(
  {
    LiveRoom: {screen: LiveRoomScreen, navigationOptions: {tabBarLabel:"Live Room", tabBarIcon: ({ tintColor }) => (<Icon name="camcorder" size={20}/>)}, },
    LiveChat: {screen: LiveChatScreen, navigationOptions: {tabBarLabel:"Live Chat", tabBarIcon: ({ tintColor }) => (<Icon name="chat" size={20}/>)}, },
    Details: {screen: LiveRoomDetailsScreen, navigationOptions: {tabBarLabel:"Details", tabBarIcon: ({ tintColor }) => (<Icon name="information" size={20}/>)}, },
  }, 
  {  
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'LiveRoom') {
          iconName = `camcorder${focused ? '' : '-outline'}`;
        } else if (routeName === 'LiveChat') {
          iconName = `chat${focused ? '' : '-outline'}`;
        } else if (routeName === 'Details') {
          iconName = `information${focused ? '' : '-outline'}`;
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Icon name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      },
    }),
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showLabel: true,
      showIcon: true,
      activeTintColor: '#FF538F',
      activeBackgroundColor: '#FFFFFF',
      inactiveTintColor: '#FFFFFF',
      inactiveBackgroundColor: '#cccccc',
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#cccccc',
      },
    }
  }
);

//Step Two - Stack Navigator 
const AuthStack = createStackNavigator(
{ 
  Login: {screen: LoginScreen},
  ForgotPassword: {screen: ForgotPasswordScreen},
  Register: {screen: RegisterScreen}
},
{
  initialRouteName: 'Login',
}
);

const Home_StackNavigator = createStackNavigator({
  Home: {
    screen: DashboardScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Dashboard',
      headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
      headerStyle: {
        backgroundColor: '#FF538F',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: '#fff',
    })
  }
});

const LiveRoom_StackNavigator = createStackNavigator({
  LiveChatRoom: {
    screen: RoomTabs,
    navigationOptions: ({ navigation }) => ({
      title: 'Meet The Prophet Live',
      headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
      headerStyle: {
        backgroundColor: '#FF538F',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: '#fff',
    })
  },
});

const Payments_StackNavigator = createStackNavigator({
  Payments: {
    screen: PaymentsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Payments',
      headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
      headerStyle: {
        backgroundColor: '#FF538F',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: '#fff',
    })
  },
});

const Settings_StackNavigator = createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings',
      headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
      headerStyle: {
        backgroundColor: '#FF538F',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: '#fff',
    })
  },
});

const Notifications_StackNavigator = createStackNavigator({
  Notifications: {
    screen: NotificationsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Notifications',
      headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
      headerStyle: {
        backgroundColor: '#FF538F',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: '#fff',
    })
  },
});

const TV_StackNavigator = createStackNavigator({
  TV: {
    screen: TVScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Mercy TV',
      headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
      headerStyle: {
        backgroundColor: '#FF538F',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: '#fff',
    })
  },
});

const About_StackNavigator = createStackNavigator({
  About: {
    screen: AboutScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'About Mercy TV App',
      headerLeft: () => (<Icon name="menu" size={35} onPress={() => navigation.openDrawer()} />),
      headerStyle: {
        backgroundColor: '#FF538F',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: '#fff',
    })
  },
});

const Logout_StackNavigator = createStackNavigator(
  {
    Logout: {screen: LogoutScreen},
    Login: {screen: LoginScreen},
    ForgotPassword: {screen: ForgotPasswordScreen},
    Register: {screen: RegisterScreen}
  }
);

//Step Three - Drawer Navigator
const DrawerNavigator = createDrawerNavigator(
  {
    Home: {screen: Home_StackNavigator, navigationOptions: {drawerLabel: "Dashboard", drawerIcon: ({ tintColor }) => (<Icon name="home" size={20}/>)}},
    LiveRoomTabs: {screen: LiveRoom_StackNavigator, navigationOptions: {drawerLabel: "Live Room", drawerIcon: ({ tintColor }) => (<Icon name="podcast" size={20}/>)}},
    Payments: {screen: Payments_StackNavigator, navigationOptions: {drawerLabel: "Payments", drawerIcon: ({ tintColor }) => (<Icon name="cash" size={20}/>)}},
    Settings: {screen: Settings_StackNavigator, navigationOptions: {drawerLabel: "Account Settings", drawerIcon: ({ tintColor }) => (<Icon name="settings-outline" size={20}/>)}},
    Notifications: {screen: Notifications_StackNavigator, navigationOptions: {drawerLabel: "Notifications", drawerIcon: ({ tintColor }) => (<Icon name="bell-alert" size={20}/>)}},
    TV: {screen: TV_StackNavigator, navigationOptions: {drawerLabel: "Mercy TV", drawerIcon: ({ tintColor }) => (<Icon name="television" size={20}/>)}},
    About: {screen: About_StackNavigator, navigationOptions: {drawerLabel: "About", drawerIcon: ({ tintColor }) => (<Icon name="information" size={20}/>)}},
    Logout: {screen: Logout_StackNavigator, navigationOptions: {drawerLabel: "Logout", drawerIcon: ({ tintColor }) => (<Icon name="lock" size={20}/>)}},
  },
  {
    initialRouteName: 'Home',
  }
);

//Step Four
const MainNavigator = createSwitchNavigator(
  {
    AuthLoading: Initializing,
    AppNav: DrawerNavigator,
    AuthNav: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

export default createAppContainer(MainNavigator);