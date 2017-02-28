import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GameOfLife from './GameOfLife';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginVertical: 60, padding: 15 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#212121', textAlign: 'center' }}>
            Conway's Game of Life
          </Text>
        </View>
        <View style={{ flex: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#212121', padding: 5, borderRadius: 5, shadowRadius: 10, shadowColor: '#212121', shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0 }  }}>
            <GameOfLife />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Exponent.registerRootComponent(App);
