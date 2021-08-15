import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Appbar from './Appbar';
import Home from './Home';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';
import DrawerContent from './DrawerContent';
import Post from './Post';

const HomeDrawer = createDrawerNavigator();

export default ({ logoutback }) => {
    return (
        <HomeDrawer.Navigator 
            drawerContent={props => <DrawerContent {...props} logoutback={logoutback} />} 
            screenOptions={{ 
                header: props => <Appbar {...props} />, 
                headerShown: true,
            }}
        >
            <HomeDrawer.Screen name='Home'>
            {props => <Home {...props} />}
            </HomeDrawer.Screen>
            <HomeDrawer.Screen name='EditProfile'>
            {props => <EditProfile {...props} />}
            </HomeDrawer.Screen>
            <HomeDrawer.Screen name='ChangePassword'>
            {props => <ChangePassword {...props} />}
            </HomeDrawer.Screen>
            <HomeDrawer.Screen name='Post'>
            {props => <Post {...props} />}
            </HomeDrawer.Screen>
        </HomeDrawer.Navigator>
    );
};