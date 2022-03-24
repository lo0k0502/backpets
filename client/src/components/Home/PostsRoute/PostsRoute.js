import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PostsTab from './PostsTab';
import Search from './Search';
import AppSearchbar from '../AppSearchbar';
import Appbar from '../Appbar';

const PostsStack = createStackNavigator();

export default ({ route, navigation }) => {
    const [searchText, setSearchText] = useState('');

    return (
        <>
            <PostsStack.Navigator
                screenOptions={{
                    header: props => (
                        searchText || props.route.name === 'Search' ? (
                            <AppSearchbar
                              {...props}
                              searchTextState={[searchText, setSearchText]}
                              autoFocus={props.route.name === 'Search'}
                              searchFunction={props.route.name === 'Search' ? (() => props.navigation.navigate('PostsTab')) : () => {}}
                            />
                        ) : (
                            props.route.name === 'PostsTab' ? (
                                <Appbar {...props} />
                            ) : null
                        )
                    )
                }}
            >
                <PostsStack.Screen name='PostsTab'>
                {props => <PostsTab {...props} searchTextState={[searchText, setSearchText]} />}
                </PostsStack.Screen>
                <PostsStack.Screen name='Search'>
                {props => <Search {...props} searchTextState={[searchText, setSearchText]} />}
                </PostsStack.Screen>
            </PostsStack.Navigator>
        </>
    );
};