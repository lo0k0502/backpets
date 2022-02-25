import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Appbar from './Appbar';
import Home from './HomeTab';
import ChangePassword from './Drawer/ChangePassword';
import EditProfile from './Drawer/EditProfile';
import DrawerContent from './Drawer/DrawerContent';
import Post from './Post';

const HomeDrawer = createDrawerNavigator();
const HomeStack = createStackNavigator();

export default ({ logoutback }) => {
    return (
        <HomeDrawer.Navigator
            drawerContent={props => <DrawerContent {...props} logoutback={logoutback} />} 
            screenOptions={{ headerShown: false }}
        >
            <HomeDrawer.Screen name='HomeDrawer'>
            {props => (
                <HomeStack.Navigator
                    screenOptions={{ 
                        header: props => <Appbar {...props} />, 
                        headerShown: true,
                    }}
                >
                    <HomeStack.Screen name='Home'>
                    {props => <Home {...props} />}
                    </HomeStack.Screen>
                    <HomeStack.Screen
                        name='EditProfile' 
                    >
                    {props => <EditProfile {...props} />}
                    </HomeStack.Screen>
                    <HomeStack.Screen name='ChangePassword'>
                    {props => <ChangePassword {...props} />}
                    </HomeStack.Screen>
                    <HomeStack.Screen 
                        name='Post' 
                        options={{
                            headerShown: false,
                            ...TransitionPresets.SlideFromRightIOS
                        }}
                    >
                    {props => <Post {...props} />}
                    </HomeStack.Screen>
                </HomeStack.Navigator>
            )}
            </HomeDrawer.Screen>
        </HomeDrawer.Navigator>
    );
};