// src/components/staff/OrderScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Staff Home Screen</Text>
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

export default OrderScreen;
