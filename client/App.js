import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Login from './src/components/Auth/Login';
import BottomNavigation from './src/components/Home/BottomNavigation';
import Register from './src/components/Auth/Register';
import DeleteUser from './src/components/DevOptions/DeleteUser';
import { Button } from 'react-native-paper';

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
    <View>
      <Button onPress={() => navigation.navigate('DeleteUser')}>
        DeleteUser
      </Button>
      <Button>
        AllUsers
      </Button>
    </View>
  );
};

const LoginDrawer = () => {
  return (
    <Drawers.Navigator>
      <Drawers.Screen name='Login' component={Login} />
      <Drawers.Screen name='DevOptions' component={DevOptions} />
    </Drawers.Navigator>
  );
};

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        style='auto' 
        backgroundColor='white' 
        animated
        networkActivityIndicatorVisible
        translucent
      />
      <NavigationContainer>
        <Stacks.Navigator initialRouteName={isLogin ? 'Home' : 'Drawer'}>
          <Stacks.Screen name='LoginDrawer' component={LoginDrawer} options={{ title: 'Login' }} />
          <Stacks.Screen name='Register' component={Register} />
          <Stacks.Screen name='DeleteUser' component={DeleteUser} />
          <Stacks.Screen name='Home' component={BottomNavigation} />
        </Stacks.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}