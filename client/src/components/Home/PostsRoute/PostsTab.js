import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MissionRoute from './Mission/Mission';
import ReportRoute from './Report/ReportRoute';
import PutUpForAdoptionRoute from './PutUpForAdoption/PutUpForAdoptionRoute';
import { useTheme } from 'react-native-paper';
import PostsAppbar from './PostsAppbar';
import TagsView from './TagsView';
import { tagsArray } from '../../../utils/constants';

const PostsTab = createMaterialTopTabNavigator();

export default ({ navigation }) => {
    const { colors } = useTheme();

    const [searchText, setSearchText] = useState('');
    const [tags, setTags] = useState(tagsArray.map(tagName => ({ name: tagName, selected: false })));

    return (
        <>
            <PostsAppbar
                navigation={navigation}
                searchTextState={[searchText, setSearchText]}
                tagsState={[tags, setTags]}
            />
            <TagsView tagsState={[tags, setTags]} />
            <PostsTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
                <PostsTab.Screen name='Mission' options={{ title: '任務' }}>
                {props => <MissionRoute {...props} />}
                </PostsTab.Screen>
                <PostsTab.Screen name='Report' options={{ title: '通報' }}>
                {props => <ReportRoute {...props} />}
                </PostsTab.Screen>
                <PostsTab.Screen name='PutUpForAdoption' options={{ title: '認養' }}>
                {props => <PutUpForAdoptionRoute {...props} />}
                </PostsTab.Screen>
            </PostsTab.Navigator>
        </>
    );
};