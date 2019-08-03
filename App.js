/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

//import SplashScreen from 'react-native-splash-screen';

import MainNavigator from './src/components/screens/Navigations';

class App extends Component {

  componentDidMount() {
    //setTimeout(() => {
    //  SplashScreen.hide();
    //}, 1000);
  }

  render() {
    return (
      <MainNavigator />
    );
  }
}

/**
const App = () => {
  return (
    <MainNavigator />
  );
};
**/

export default App;
