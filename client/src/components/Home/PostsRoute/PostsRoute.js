import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import PostsTab from './PostsTab';
import Post from './Post';

const PostsStack = createStackNavigator();

export default () => {
    return (
        <PostsStack.Navigator screenOptions={{ headerShown: false }} >
            <PostsStack.Screen name='PostsTab'>
            {props => <PostsTab {...props} />}
            </PostsStack.Screen>
            <PostsStack.Screen 
                name='Post' 
                options={{ ...TransitionPresets.SlideFromRightIOS }}
            >
            {props => <Post {...props} />}
            </PostsStack.Screen>
        </PostsStack.Navigator>
    );
};