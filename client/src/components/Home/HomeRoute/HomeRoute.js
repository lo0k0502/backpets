import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets, TransitionSpecs } from '@react-navigation/stack';

import Appbar from './Appbar';
import Home from './Home';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';
import DrawerContent from './DrawerContent';
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