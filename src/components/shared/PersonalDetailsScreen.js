import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const PersonalDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Personal Details</Text>
      {/* Add your personal details form here */}
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
    marginBottom: 20,
  },
});

export default PersonalDetailsScreen;
