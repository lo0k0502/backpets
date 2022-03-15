import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Mission from './Mission/Mission';
import ReportRoute from './Report/ReportRoute';
import PutUpForAdoptionRoute from './PutUpForAdoption/PutUpForAdoptionRoute';
import { Divider, useTheme } from 'react-native-paper';
import TagsView from './TagsView';
import { tagsArray } from '../../../utils/constants';
import Appbar from '../Appbar';

const PostsTab = createMaterialTopTabNavigator();

export default ({ navigation, route, searchTextState }) => {
    const { colors } = useTheme();

    const [tags, setTags] = useState(tagsArray.map(tagName => ({ name: tagName, selected: false })));

    return (
        <>
            <Appbar route={route} navigation={navigation} />
            <TagsView tagsState={[tags, setTags]} />
            <Divider />
            <PostsTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
                <PostsTab.Screen name='Mission' options={{ title: '任務' }}>
                {props => (
                    <Mission
                        {...props}
                        selectedTags={tagsArray.filter(tag => tags.find(_tag => _tag.name === tag && _tag.selected))}
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
                <PostsTab.Screen name='PutUpForAdoption' options={{ title: '認養' }}>
                {props => (
                    <PutUpForAdoptionRoute
                        {...props}
                        searchTextState={searchTextState}
                    />
                )}
                </PostsTab.Screen>
            </PostsTab.Navigator>
        </>
    );
};