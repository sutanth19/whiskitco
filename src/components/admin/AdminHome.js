import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './HomeScreen/HomeScreen';
import ItemScreen from './ItemScreen/ItemScreen';
import StaffScreen from './StaffScreen/StaffScreen';
import AddStaffScreen from './StaffScreen/AddStaffScreen'; 
import StaffDetailsScreen from './StaffScreen/StaffDetailsScreen'; 
import FeedbackScreen from './FeedbackScreen/FeedbackScreen';
import ReportScreen from './ReportScreen/ReportScreen';
import SettingsScreen from '../shared/SettingsScreen';
import PersonalDetailsScreen from '../shared/PersonalDetailsScreen';
import ChangePasswordScreen from '../shared/ChangePasswordScreen';

// Creating a bottom tab navigator instance
const Tab = createBottomTabNavigator();
// Creating a stack navigator instance
const Stack = createStackNavigator();

// Defining AdminTabs component which sets up the bottom tab navigator with different screens for admin
const AdminTabs = () => (
  //Sets up a bottom tab navigator with screenOptions for customizing tab icons and colors.
  <Tab.Navigator
    screenOptions={({ route }) => ({
      //Determines which icon to display based on the route name.
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Item':
            iconName = 'archive';
            break;
          case 'Staff':
            iconName = 'users';
            break;
          case 'Feedback':
            iconName = 'comments';
            break;
          case 'Report':
            iconName = 'file-text';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#000',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Item" component={ItemScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Staff" component={StaffScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Report" component={ReportScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

// Defining AdminHome component which sets up the stack navigator including AdminTabs and other screens
const AdminHome = ({ handleSignOut }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminTabs"
      component={AdminTabs}
      options={({ navigation }) => ({
        headerRight: () => (
          <Icon
            name="cog"
            size={25}
            color="#000"
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate('Settings', { handleSignOut })}
          />
        ),
      })}
    />
    <Stack.Screen name="Settings" component={SettingsScreen} initialParams={{ handleSignOut }} />
    <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="AddStaff" component={AddStaffScreen} />
    <Stack.Screen name="StaffDetails" component={StaffDetailsScreen} />
    <Stack.Screen name="StaffScreen" component={StaffScreen} />
  </Stack.Navigator>
);

export default AdminHome;
