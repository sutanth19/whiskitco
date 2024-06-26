import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './src/services/firebaseConfig'; 
import { fetchUserType, createUserProfile } from './src/services/firestoreService';
import AppNavigator from './src/navigation/AppNavigator';
import Login from './src/components/auth/Login';
import SignUp from './src/components/auth/SignUp';
import PasswordReset from './src/components/auth/PasswordReset';

//Creating a stack navigator instance.
const Stack = createNativeStackNavigator();

//State Variables: Initializing state variables for user, user type, loading status, and Firebase connection status
const App = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        const docRef = doc(db, 'testCollection', 'testDoc');
        await getDoc(docRef);
        setFirebaseConnected(true);
        console.log('Connected to Firebase');
      } catch (error) {
        setFirebaseConnected(false);
        console.error('Error connecting to Firebase:', error.message);
      }
    };

    checkFirebaseConnection();

    //Check User Sessio Retrieves user data from AsyncStorage if it exists and sets the user state.
    const checkUserSession = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setUser(user);
        try {
          const userType = await fetchUserType(user.uid);
          setUserType(userType);
        } catch (error) {
          console.error('Error fetching user type:', error.message);
          setUser(null); // Reset user state if there is an error fetching user type
        }
      }
      setLoading(false);
    };

    checkUserSession();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        try {
          const userType = await fetchUserType(user.uid);
          setUserType(userType);
        } catch (error) {
          console.error('Error fetching user type:', error.message);
          setUser(null); // Reset user state if there is an error fetching user type
        }
      } else {
        await AsyncStorage.removeItem('user');
        setUser(null);
        setUserType('');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  //Handles both sign-in and sign-up logic and Displays appropriate error messages based on the error code.
  const handleAuthentication = async (isLogin, email, password, name, phoneNumber) => {
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userType = await fetchUserType(user.uid);
        setUserType(userType);
        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await createUserProfile(user.uid, {
          name,
          email,
          phone_number: phoneNumber,
          created_at: new Date().toISOString()
        }, 'customer');

        const userType = await fetchUserType(user.uid);
        setUserType(userType);
        setUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Error', 'The email address is already in use by another account.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Error', 'The email address is not valid.');
          break;
        case 'auth/operation-not-allowed':
          Alert.alert('Error', 'Email/password accounts are not enabled.');
          break;
        case 'auth/weak-password':
          Alert.alert('Error', 'The password is too weak.');
          break;
        default:
          Alert.alert('Error', error.message);
          break;
      }
    }
  };

  // Handles user sign-out, updates state, and resets navigation stack.
  const handleSignOut = async (navigation) => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      setUser(null);
      setUserType('');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Sign-out error:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home">
            {({ navigation }) => (
              <AppNavigator 
                user={user} 
                userType={userType} 
                handleSignOut={handleSignOut} 
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <Login
                  handleAuthentication={handleAuthentication}
                  navigateToPasswordReset={() => navigation.navigate('PasswordReset')}
                  toggleForm={() => navigation.navigate('SignUp')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {({ navigation }) => (
                <SignUp
                  handleAuthentication={handleAuthentication}
                  toggleForm={() => navigation.navigate('Login')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="PasswordReset">
              {({ navigation }) => (
                <PasswordReset toggleForm={() => navigation.navigate('Login')} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default App;
