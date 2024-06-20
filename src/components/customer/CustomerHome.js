// src/components/customer/CustomerHome.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuViewScreen from './MenuViewScreen';
import MyOrderScreen from './MyOrderScreen';
import SettingsScreen from '../shared/SettingsScreen';
import PersonalDetailsScreen from '../shared/PersonalDetailsScreen';
import ChangePasswordScreen from '../shared/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomerHome = ({ handleSignOut }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerTabs"
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
                  case 'MenuView':
                    iconName = 'bars';
                    break;
                  case 'MyOrder':
                    iconName = 'shopping-cart';
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
            <Tab.Screen name="MenuView" component={MenuViewScreen} options={{ title: 'Home' , headerShown: false }}/>
            <Tab.Screen name="MyOrder" component={MyOrderScreen} options={{ title: 'My Order' , headerShown: false }} />
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

export default CustomerHome;
