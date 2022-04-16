import React, { memo, useContext, useState } from 'react';
import { Portal, Snackbar, useTheme } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PostsRoute from './PostsRoute/PostsRoute';
import MapRoute from './MapRoute/MapRoute';
import StoreRoute from './StoreRoute/StoreRoute';
import ProfileRoute from './ProfileRoute/ProfileRoute';
import AdoptionRoute from './AdoptionRoute/AdoptionRoute';
import Context, { initialContext } from '../../context';
import { useSelfClues } from '../../hooks';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import { constants, isPageInitialWithSearchbar } from '../../utils';
import Appbar from './Appbar';
import AppSearchbar from './AppSearchbar';
import { useNavigationState } from '@react-navigation/native';

const Tabs = createMaterialBottomTabNavigator();

export default memo((props) => {
    const user = useSelector(selectUser);
    const { colors } = useTheme();
    const state = useNavigationState(state => state);
    const bottomNavigationState = state.routes.find(route => route.name === 'BottomNavigation').state;
    const currentBottomNavigationRouteName = bottomNavigationState && bottomNavigationState.routes[bottomNavigationState.index].name;
    const profileRouteState = bottomNavigationState?.routes.find(route => route.name === 'ProfileRoute').state;
    const currentProfileRouteName = profileRouteState && profileRouteState.routes[profileRouteState.index].name;
    console.log('state')
    const { initialLocalState } = useContext(initialContext);

    const [snackbar, setSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [snackbarAction, setSnackbarAction] = useState({});

    const selfCluesHook = useSelfClues(user.info?._id);

    return (
        <Context.Provider
            value={{
                ...selfCluesHook,
                getSelfClueByClueId: clueId => selfCluesHook.selfClues.find(_clue => _clue._id === clueId) || {},
                showSnackbar: (text, action) => {
                    setSnackbarText(text);
                    setSnackbarAction(action);
                    setSnackbar(true);
                },
            }}
        >
            {
                state.index === 0 ? (
                    !!user.searchText || isPageInitialWithSearchbar(
                        bottomNavigationState ? bottomNavigationState.index : (
                            constants.pageNames.findIndex(routeName => routeName === initialLocalState.initialRoute)
                        )
                    ) ? (
                        <AppSearchbar
                            {...props}
                            outlineColor='transparent'
                            activeOutlineColor={colors.background2}
                        />
                    ) : (
                        <Appbar
                            {...props}
                            routeName={
                                bottomNavigationState && (
                                    bottomNavigationState.index === 0 ? (
                                        currentProfileRouteName || 'Profile'
                                    ) : currentBottomNavigationRouteName
                                )
                            }
                        />
                    )
                ) : null
            }
            <Tabs.Navigator
                shifting
                initialRouteName={initialLocalState.initialRoute}
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
                    name={constants.pageNames[0]}
                    options={{
                        title: '個人檔案',
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name='account-circle-outline' color={color} size={20} />,
                    }}
                    component={ProfileRoute}
                />
                <Tabs.Screen
                    name={constants.pageNames[1]}
                    options={{
                        title: '地圖',
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name='map' color={color} size={20} />,
                    }}
                    component={MapRoute}
                />
                <Tabs.Screen
                    name={constants.pageNames[2]}
                    options={{
                        title: '貼文',
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name='note-text-outline' color={color} size={20} />,
                    }}
                    component={PostsRoute}
                />
                <Tabs.Screen
                    name={constants.pageNames[3]}
                    options={{
                        title: '商店',
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name='store-outline' color={color} size={20} />,
                    }}
                    component={StoreRoute}
                />
                <Tabs.Screen
                    name={constants.pageNames[4]}
                    options={{
                        title: '領養',
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name='home-heart' color={color} size={20} />,
                    }}
                    component={AdoptionRoute}
                />
            </Tabs.Navigator>
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
});