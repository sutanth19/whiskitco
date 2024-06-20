import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SettingsScreen = ({ route, navigation }) => {
  const { handleSignOut } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <View style={styles.buttonContainer}>
        <Button title="Personal Details" onPress={() => navigation.navigate('PersonalDetails')} />
        <Button title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
        <Button title="Logout" onPress={handleSignOut} />
      </View>
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
  buttonContainer: {
    width: '80%',
    justifyContent: 'space-around',
    height: 150,
  },
});

export default SettingsScreen;
