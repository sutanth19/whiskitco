import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { validateEmail } from '../../utils/validations';

const { width, height } = Dimensions.get('window');

const PasswordReset = ({ toggleForm }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    const auth = getAuth();
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length === 0) {
        Alert.alert('Error', 'This email address is not registered.');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset link sent!');
    } catch (error) {
      Alert.alert('Error', `Error resetting password: ${error.message}`);
    }
  };

  return (
    <Animatable.View animation="fadeInUp" style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Animatable.View animation="bounceIn" style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        placeholderTextColor="#A9A9A9"
      />
      </Animatable.View>
      <Animatable.View animation="bounceIn" delay={100} style={styles.inputContainer}></Animatable.View>
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleForm}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
      </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    width: width,
    height: height,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
    color: '#000',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToLoginText: {
    color: '#3498db',
    marginTop: 10,
    fontSize: 16,
  },
});

export default PasswordReset;