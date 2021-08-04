import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from './Home';
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';
import DrawerContent from './DrawerContent';

const HomeDrawer = createDrawerNavigator();

const HomeRoute = ({ logoutback }) => {
    return (
        <HomeDrawer.Navigator drawerContent={props => <DrawerContent {...props} logoutback={logoutback} />}>
            <HomeDrawer.Screen name='Home' options={{ headerShown: false }}>
            {props => <Home {...props} />}
            </HomeDrawer.Screen>
            <HomeDrawer.Screen name='Profile'>
            {props => <Profile {...props} />}
            </HomeDrawer.Screen>
            <HomeDrawer.Screen name='EditProfile' options={{ title:'Edit Profile' }}>
            {props => <EditProfile {...props} />}
            </HomeDrawer.Screen>
            <HomeDrawer.Screen name='ChangePassword' options={{ title: 'Change Password' }}>
            {props => <ChangePassword {...props} />}
            </HomeDrawer.Screen>
        </HomeDrawer.Navigator>
    );
};

export default HomeRoute;