import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../services/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const AddStaffScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const generatePassword = () => {
    const generatedPassword = Math.random().toString(36).slice(-8);
    setPassword(generatedPassword);
  };

  const handleCreateStaff = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Email is required.');
      return;
    }

    if (!password) {
      generatePassword();
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'staff', user.uid), {
        email,
        name: 'New Staff',
        phoneNumber: '',
        joinDate: new Date().toISOString(),
        status: true,
      });

      // Send email to the new staff member (this requires an email-sending service)
      sendEmailToStaff(email, password);

      Alert.alert('Success', 'Staff created successfully');
      navigation.navigate('StaffScreen'); // Navigate back to StaffScreen
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const sendEmailToStaff = (email, password) => {
    // Implement the email-sending logic here
    // This can be done using an email-sending API or Firebase Functions
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
    }).then(response => {
      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.log('Error sending email');
      }
    }).catch(error => {
      console.log('Error sending email:', error);
    });
  };

  return (
    <LinearGradient colors={['#e0e0e0', '#ffffff']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Staff</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            editable={false} // Make password field non-editable since it is auto-generated
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? "eye" : "eye-slash"} size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCreateStaff}>
          <Text style={styles.buttonText}>Create Staff</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingRight: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddStaffScreen;
