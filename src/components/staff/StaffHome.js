// src/components/staff/StaffHome.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './HomeScreen';
import SettingsScreen from '../shared/SettingsScreen';
import PersonalDetailsScreen from '../shared/PersonalDetailsScreen';
import ChangePasswordScreen from '../shared/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StaffHome = ({ handleSignOut }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StaffTabs"
        options={({ navigation }) => ({
          headerRight: () => (
            <Icon
              name="cog"
              size={25}
              color="#000"
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('Settings')}
            />
          ),
        })}
      >
        {() => (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;

                switch (route.name) {
                  case 'Home':
                    iconName = 'home';
                    break;
                  default:
                    iconName = 'circle';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#000',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                display: 'flex',
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen name="Settings">
        {() => <SettingsScreen handleSignOut={handleSignOut} />}
      </Stack.Screen>
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default StaffHome;
