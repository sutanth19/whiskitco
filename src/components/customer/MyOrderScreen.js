import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyOrderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Order Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default MyOrderScreen;
