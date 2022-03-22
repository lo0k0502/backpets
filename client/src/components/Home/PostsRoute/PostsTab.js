import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Mission from './Mission/Mission';
import ReportRoute from './Report/ReportRoute';
import PutUpForAdoptionRoute from './PutUpForAdoption/PutUpForAdoptionRoute';
import { useTheme } from 'react-native-paper';

const PostsTab = createMaterialTopTabNavigator();

export default ({ searchTextState }) => {
    const { colors } = useTheme();

    return (
        <PostsTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
            <PostsTab.Screen name='Mission' options={{ title: '任務' }}>
            {props => (
                <Mission
                    {...props}
                    searchTextState={searchTextState}
                />
            )}
            </PostsTab.Screen>
            <PostsTab.Screen name='Report' options={{ title: '通報' }}>
            {props => (
                <ReportRoute
                    {...props}
                    searchTextState={searchTextState}
                />
            )}
            </PostsTab.Screen>
            <PostsTab.Screen name='PutUpForAdoption' options={{ title: '送養' }}>
            {props => (
                <PutUpForAdoptionRoute
                    {...props}
                    searchTextState={searchTextState}
                />
            )}
            </PostsTab.Screen>
        </PostsTab.Navigator>
    );
};