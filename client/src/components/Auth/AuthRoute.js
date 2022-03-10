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
        icon='account-off'
        uppercase={false}
        onPress={() => navigation.navigate('DeleteUser')}
        style={{ margin: 10, }}
      >
        Delete User
      </Button>
      <Button 
        mode='outlined' 
        icon='account-multiple'
        uppercase={false}
        onPress={() => navigation.navigate('AllUsers')}
        style={{ margin: 10, }}
      >
        All Users
      </Button>
      <Button 
        mode='contained' 
        uppercase={false}
        onPress={() => navigation.goBack()}
        dark
        style={{ margin: 10, }}
      >
        Go Back
      </Button>
    </View>
  );
};

// Contains the login route and the development options route.
const LoginDrawer = ({ checkUnLogin, setSignInState }) => {
  return (
    <Drawers.Navigator screenOptions={{ headerShown: false }}>
      <Drawers.Screen name='Login' options={{ title: '登入' }}>
      {props => <Login {...props} checkUnLogin={checkUnLogin} setSignInState={setSignInState} />}
      </Drawers.Screen>
      <Drawers.Screen name='DevOptions'>
      {props => <DevOptions {...props} />}
      </Drawers.Screen>
    </Drawers.Navigator>
  );
};

// Contains authorization related routes.
const AuthRoute = ({ setSignInState }) => {
  const { colors } = useTheme();

  return (
    <AuhtStacks.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background2 } }}>
      <AuhtStacks.Screen name='LoginDrawer' options={{ headerShown: false }}>
      {props => <LoginDrawer {...props} setSignInState={setSignInState} />}
      </AuhtStacks.Screen>
      <AuhtStacks.Screen name='Register' options={{ title: '註冊' }}>
      {props => <Register {...props} />}
      </AuhtStacks.Screen>
      <AuhtStacks.Screen name='ForgetPassword' options={{ title: '忘記密碼' }}>
      {props => <ForgetPassword {...props} />}
      </AuhtStacks.Screen>
    </AuhtStacks.Navigator>
  );
};

export default AuthRoute;