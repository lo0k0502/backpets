import React, { useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Mission from './Mission/Mission';
import ReportRoute from './Report/ReportRoute';
import PutUpForAdoptionRoute from './PutUpForAdoption/PutUpForAdoptionRoute';
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setSearchText } from '../../../redux/userSlice';

const PostsTab = createMaterialTopTabNavigator();

export default () => {
    const user = useSelector(selectUser);
    const { colors } = useTheme();
    const dispatch = useDispatch();

    useFocusEffect(useCallback(() => {
        return () => {
            if (user.searchText) dispatch(setSearchText(''));
        };
    }, []));

    return (
        <PostsTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
            <PostsTab.Screen name='Mission' options={{ title: '任務' }} component={Mission} />
            <PostsTab.Screen name='Report' options={{ title: '通報' }} component={ReportRoute} />
            <PostsTab.Screen name='PutUpForAdoption' options={{ title: '送養' }} component={PutUpForAdoptionRoute} />
        </PostsTab.Navigator>
    );
};