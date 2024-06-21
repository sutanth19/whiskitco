import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../services/firebaseConfig';

// Helper function to generate a random password
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Function to send email to the new staff member
const sendEmailToStaff = (email, password) => {
  fetch('http://localhost:3000/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: email,
      subject: 'Your Staff Account Credentials',
      text: `Welcome! Your account has been created. Your password is: ${password}`,
    }),
  })
    .then(response => {
      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.log('Error sending email');
      }
    })
    .catch(error => {
      console.log('Error sending email:', error);
    });
};

const AddStaffScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(false);

  const handleCreateStaff = async () => {
    try {
      let finalPassword = password;
      if (autoGeneratePassword) {
        finalPassword = generateRandomPassword();
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, finalPassword);
      const user = userCredential.user;

      await setDoc(doc(db, 'staff', user.uid), {
        email,
        status: true,
        joinDate: new Date().toISOString(),
      });

      sendEmailToStaff(email, finalPassword);

      Alert.alert('Success', 'Staff created successfully');
      navigation.navigate('StaffScreen', { refresh: true });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Staff</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.switchContainer}>
        <Text>Auto-generate Password</Text>
        <Switch
          value={autoGeneratePassword}
          onValueChange={setAutoGeneratePassword}
        />
      </View>
      {!autoGeneratePassword && (
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleCreateStaff}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddStaffScreen;
