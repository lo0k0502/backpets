import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Mission from './Mission/Mission';
import ReportRoute from './Report/ReportRoute';
import PutUpForAdoptionRoute from './PutUpForAdoption/PutUpForAdoptionRoute';
import { Divider, useTheme } from 'react-native-paper';
import AppSearchbar from '../AppSearchbar';
import TagsView from './TagsView';
import { tagsArray } from '../../../utils/constants';

const PostsTab = createMaterialTopTabNavigator();

export default ({ navigation }) => {
    const { colors } = useTheme();

    const [searchText, setSearchText] = useState('');
    const [tags, setTags] = useState(tagsArray.map(tagName => ({ name: tagName, selected: false })));

    return (
        <>
            <AppSearchbar
                navigation={navigation}
                searchTextState={[searchText, setSearchText]}
                tagsState={[tags, setTags]}
            />
            <TagsView tagsState={[tags, setTags]} />
            <Divider />
            <PostsTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
                <PostsTab.Screen name='Mission' options={{ title: '任務' }}>
                {props => <Mission {...props} selectedTags={tagsArray.filter(tag => tags.find(_tag => _tag.name === tag && _tag.selected))} />}
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