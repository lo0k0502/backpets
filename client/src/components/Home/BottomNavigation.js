import React from 'react';
import { useTheme } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PostsRoute from './PostsRoute/PostsRoute';
import MapRoute from './MapRoute/MapRoute';
import Store from './StoreRoute/StoreRoute';
import ProfileRoute from './ProfileRoute/ProfileRoute';
import AdoptionRoute from './AdoptionRoute/AdoptionRoute';

const Tabs = createMaterialBottomTabNavigator();

export default () => {
    const { colors } = useTheme();

    return (
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
                    title: '個人資料',
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
                name='Store'
                options={{
                    title: '商店',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name='store-outline' color={color} size={20} />,
                }}
            >
            {props => <Store {...props} />}
            </Tabs.Screen>
            <Tabs.Screen
                name='Adoption'
                options={{
                    title: '領養',
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name='home-heart' color={color} size={20} />,
                }}
            >
            {props => <AdoptionRoute {...props} />}
            </Tabs.Screen>
        </Tabs.Navigator>
    );
};