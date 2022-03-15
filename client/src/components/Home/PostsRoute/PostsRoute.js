import React, { useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import PostsTab from './PostsTab';
import Post from './Post';
import Search from './Search';

const PostsStack = createStackNavigator();

export default ({ navigation }) => {
    const [searchText, setSearchText] = useState('');

    return (
        <>
            <PostsStack.Navigator screenOptions={{ headerShown: false }}>
                <PostsStack.Screen name='PostsTab'>
                {props => <PostsTab {...props} searchTextState={[searchText, setSearchText]} />}
                </PostsStack.Screen>
                <PostsStack.Screen
                    name='Post'
                    options={{ ...TransitionPresets.SlideFromRightIOS }}
                >
                {props => <Post {...props} />}
                </PostsStack.Screen>
                <PostsStack.Screen name='Search'>
                {props => <Search {...props} searchTextState={[searchText, setSearchText]} />}
                </PostsStack.Screen>
            </PostsStack.Navigator>
        </>
    );
};