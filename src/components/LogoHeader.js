import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

export default class LogoHeader extends React.Component {
  render() {
    return (
      <Image
        source={require('./screens/assets/snack-icon.png')}
        style={{ width: 30, height: 30 }}
      />
    );
  }
}
