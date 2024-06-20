import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import PasswordReset from '../components/auth/PasswordReset';
import AdminHome from '../components/admin/AdminHome';
import StaffHome from '../components/staff/StaffHome';
import CustomerHome from '../components/customer/CustomerHome';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ user, userType, handleSignOut, handleAuthentication }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {user ? (
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {({ navigation }) => {
          switch (userType) {
            case 'admin':
              return <AdminHome handleSignOut={() => handleSignOut(navigation)} />;
            case 'staff':
              return <StaffHome handleSignOut={() => handleSignOut(navigation)} />;
            case 'customer':
              return <CustomerHome handleSignOut={() => handleSignOut(navigation)} />;
            default:
              return null;
          }
        }}
      </Stack.Screen>
    ) : (
      <>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {({ navigation }) => (
            <Login
              handleAuthentication={handleAuthentication}
              toggleForm={() => navigation.navigate('SignUp')}
              navigateToPasswordReset={() => navigation.navigate('PasswordReset')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="SignUp" options={{ headerShown: false }}>
          {({ navigation }) => (
            <SignUp
              handleAuthentication={handleAuthentication}
              toggleForm={() => navigation.navigate('Login')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="PasswordReset" options={{ headerShown: false }}>
          {({ navigation }) => (
            <PasswordReset toggleForm={() => navigation.navigate('Login')} />
          )}
        </Stack.Screen>
      </>
    )}
  </Stack.Navigator>
);

export default AppNavigator;
