import React from 'react';
import { View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Login from './Login';
import Register from './Register';
import ForgetPassword from './ForgetPassword';

const AuhtStacks = createStackNavigator();
const Drawers = createDrawerNavigator();

// Development options, will be deleted when this project is in production.
const DevOptions = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        mode='outlined' 
        icon='account-multiple'
        uppercase={false}
        onPress={() => navigation.navigate('AllUsers')}
        style={{ margin: 10 }}
      >
        All Users
      </Button>
      <Button 
        mode='outlined' 
        icon='image-multiple'
        uppercase={false}
        onPress={() => navigation.navigate('AllImages')}
        style={{ margin: 10 }}
      >
        All Images
      </Button>
    </View>
  );
};

// Contains the login route and the development options route.
const LoginDrawer = () => {
  return (
    <Drawers.Navigator screenOptions={{ headerShown: false }}>
      <Drawers.Screen
        name='Login'
        options={{ title: '登入' }}
        component={Login}
      />
      <Drawers.Screen
        name='DevOptions'
        component={DevOptions}
      />
    </Drawers.Navigator>
  );
};

// Contains authorization related routes.
const AuthRoute = () => {
  const { colors } = useTheme();

  return (
    <AuhtStacks.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background2 } }}>
      <AuhtStacks.Screen
        name='LoginDrawer'
        options={{ headerShown: false }}
        component={LoginDrawer}
      />
      <AuhtStacks.Screen
        name='Register'
        options={{ title: '註冊' }}
        component={Register}
      />
      <AuhtStacks.Screen
        name='ForgetPassword'
        options={{ title: '忘記密碼' }}
        component={ForgetPassword}
      />
    </AuhtStacks.Navigator>
  );
};

export default AuthRoute;