import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform, View, Text, AsyncStorage } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import store from './src/redux/store';

import Login from './src/components/Auth/Login';
import BottomNavigation from './src/components/Home/BottomNavigation';
import Register from './src/components/Auth/Register';
import DeleteUser from './src/components/DevOptions/DeleteUser';
import AllUsers from './src/components/DevOptions/AllUsers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  statusbar: {
    flex: 1,
  },
});

const Stacks = createStackNavigator();
const Drawers = createDrawerNavigator();

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
        onPress={() => navigation.goBack('Login')}
        style={{ margin: 10, }}
      >
        Go Back
      </Button>
    </View>
  );
};

const LoginDrawer = () => {
  return (
    <Drawers.Navigator>
      <Drawers.Screen name='Login'>
        {props => <Login {...props} />}
      </Drawers.Screen>
      <Drawers.Screen name='DevOptions'>
        {props => <DevOptions {...props} />}
      </Drawers.Screen>
    </Drawers.Navigator>
  );
};

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(AsyncStorage.getItem('useInfo') ? true : false);
  }, [AsyncStorage.getItem('userInfo')]);

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          style='auto' 
          backgroundColor='white' 
          animated
          networkActivityIndicatorVisible
          translucent
        />
        <NavigationContainer>
          <Stacks.Navigator initialRouteName={isLogin ? 'Home' : 'LoginDrawer'}>
            <Stacks.Screen name='LoginDrawer' options={{ title: 'Login' }}>
              {props => <LoginDrawer {...props} />}
            </Stacks.Screen>
            <Stacks.Screen name='Register'>
              {props => <Register {...props} />}
            </Stacks.Screen>
            <Stacks.Screen name='DeleteUser'>
              {props => <DeleteUser {...props} />}
            </Stacks.Screen>
            <Stacks.Screen name='Home'>
              {props => <BottomNavigation {...props} />}
            </Stacks.Screen>
            <Stacks.Screen name='AllUsers'>
              {props => <AllUsers {...props} />}
            </Stacks.Screen>
          </Stacks.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}