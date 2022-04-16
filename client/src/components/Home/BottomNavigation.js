import React, { memo, useContext } from 'react';
import { useTheme } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PostsRoute from './PostsRoute/PostsRoute';
import MapRoute from './MapRoute/MapRoute';
import StoreRoute from './StoreRoute/StoreRoute';
import ProfileRoute from './ProfileRoute/ProfileRoute';
import AdoptionRoute from './AdoptionRoute/AdoptionRoute';
import { initialContext } from '../../context';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import { constants } from '../../utils';
import PrimaryAppbar from './PrimaryAppbar';
import BottomNavigationContainer from './BottomNavigationContainer';

const Tabs = createMaterialBottomTabNavigator();

export default memo((props) => {
    const user = useSelector(selectUser);
    const { colors } = useTheme();

    const { initialLocalState } = useContext(initialContext);

    return (
        <BottomNavigationContainer userId={user.info?._id}>
            <PrimaryAppbar
                {...props}
                searchText={user.searchText}
                initialLocalState={initialLocalState}
            />
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
        </BottomNavigationContainer>
    );
});