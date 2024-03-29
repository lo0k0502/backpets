import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Mission from './Mission/Mission';
import ReportRoute from './Report/ReportRoute';
import { useTheme } from 'react-native-paper';

const PostsTab = createMaterialTopTabNavigator();

export default () => {
    const { colors } = useTheme();

    return (
        <PostsTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
            <PostsTab.Screen name='Mission' options={{ title: '任務' }} component={Mission} />
            <PostsTab.Screen name='Report' options={{ title: '通報' }} component={ReportRoute} />
        </PostsTab.Navigator>
    );
};