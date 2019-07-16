import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

export default class Styles extends React.Component {
  render() {
    return (
      <Image
        source={require('./screens/assets/snack-icon.png')}
        style={{ width: 30, height: 30 }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});