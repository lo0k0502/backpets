import React, { useState } from 'react';
import { Portal, Snackbar, useTheme } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DrawerContent from '../drawer';
import PostsRoute from './PostsRoute/PostsRoute';
import MapRoute from './MapRoute/MapRoute';
import Store from './StoreRoute/StoreRoute';
import ProfileRoute from './ProfileRoute/ProfileRoute';
import AdoptionRoute from './AdoptionRoute/AdoptionRoute';
import Feedback from './Feedback';
import Appbar from './Appbar';
import Context from '../../context';
import { useSelfClues, useSelfMissions, useSelfPets } from '../../hooks';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';

const Drawer = createDrawerNavigator();
const Tabs = createMaterialBottomTabNavigator();

export default ({ logoutback }) => {
    const user = useSelector(selectUser);
    const { colors } = useTheme();

    const [snackbar, setSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [snackbarAction, setSnackbarAction] = useState({});

    const selfMissionsHook = useSelfMissions(user.info?._id);
    const selfCluesHook = useSelfClues(user.info?._id);
    const selfPetsHook = useSelfPets(user.info?._id);

    return (
        <Context.Provider
            value={{
                ...selfMissionsHook,
                ...selfCluesHook,
                getSelfClueByClueId: clueId => selfCluesHook.selfClues.find(_clue => _clue._id === clueId) || {},
                ...selfPetsHook,
                showSnackbar: (text, action) => {
                    setSnackbarText(text);
                    setSnackbarAction(action);
                    setSnackbar(true);
                },
            }}
        >
            <Drawer.Navigator
                useLegacyImplementation={true}
                drawerContent={props => <DrawerContent {...props} logoutback={logoutback} />} 
                screenOptions={{ headerShown: false }}
            >
                <Drawer.Screen name='BottomNavigation'>
                {() => (
                    <Tabs.Navigator
                        shifting
                        initialRouteName='PostsRoute'
                        barStyle={{
                            position: 'absolute',
                            right: 10,
                            left: 10,
                            bottom: 5,
                            borderRadius: 100,
                            overflow: 'hidden',
                        }}
                        screenOptions={{ tabBarColor: colors.primary }}
                        backBehavior='initialRoute'
                    >
                        <Tabs.Screen
                            name='ProfileRoute'
                            options={{
                                title: '個人檔案',
                                tabBarIcon: ({ color }) => <MaterialCommunityIcons name='account-circle-outline' color={color} size={20} />,
                            }}
                        >
                        {props => <ProfileRoute {...props} />}
                        </Tabs.Screen>
                        <Tabs.Screen
                            name='Map'
                            options={{
                                title: '地圖',
                                tabBarIcon: ({ color }) => <MaterialCommunityIcons name='map' color={color} size={20} />,
                            }}
                        >
                        {props => <MapRoute {...props} />}
                        </Tabs.Screen>
                        <Tabs.Screen
                            name='PostsRoute'
                            options={{
                                title: '貼文',
                                tabBarIcon: ({ color }) => <MaterialCommunityIcons name='note-text-outline' color={color} size={20} />,
                            }}
                        >
                        {props => <PostsRoute {...props} />}
                        </Tabs.Screen>
                        <Tabs.Screen
                            name='StoreRoute'
                            options={{
                                title: '商店',
                                tabBarIcon: ({ color }) => <MaterialCommunityIcons name='store-outline' color={color} size={20} />,
                            }}
                        >
                        {props => <Store {...props} />}
                        </Tabs.Screen>
                        <Tabs.Screen
                            name='AdoptionRoute'
                            options={{
                                title: '領養',
                                tabBarIcon: ({ color }) => <MaterialCommunityIcons name='home-heart' color={color} size={20} />,
                            }}
                        >
                        {props => <AdoptionRoute {...props} />}
                        </Tabs.Screen>
                    </Tabs.Navigator>
                )}
                </Drawer.Screen>
                <Drawer.Screen
                    name='Feedback'
                    options={{
                        headerShown: true,
                        header: props => <Appbar {...props} />
                    }}
                >
                {props => <Feedback {...props} />}
                </Drawer.Screen>
            </Drawer.Navigator>
            <Portal>
                <Snackbar
                    visible={snackbar}
                    onDismiss={() => {
                        setSnackbar(false);
                        setSnackbarText('');
                        setSnackbarAction({});
                    }}
                    duration={5000}
                    action={snackbarAction}
                    style={{ backgroundColor: colors.primary }}
                    theme={{ colors: { surface: 'white', accent: colors.background2 } }}
                >
                    {snackbarText}
                </Snackbar>
            </Portal>
        </Context.Provider>
    );
};