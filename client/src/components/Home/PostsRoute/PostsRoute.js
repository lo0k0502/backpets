import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PostsTab from './PostsTab';
import Search from './Search';
import AppSearchbar from '../AppSearchbar';
import Appbar from '../Appbar';
import Clue from '../Clue';

const PostsStack = createStackNavigator();

export default () => {
    const [searchText, setSearchText] = useState('');

    return (
        <>
            <PostsStack.Navigator
                screenOptions={{
                    header: props => {
                        const { navigation, route } = props;
                        return (
                            searchText || props.route.name === 'Search' ? (
                                <AppSearchbar
                                {...props}
                                searchTextState={[searchText, setSearchText]}
                                autoFocus={route.name === 'Search'}
                                searchFunction={route.name === 'Search' ? (() => navigation.navigate('PostsTab')) : () => {}}
                                />
                            ) : (
                                route.name === 'PostsTab' || route.name === 'Clue' ? (
                                    <Appbar {...props} />
                                ) : null
                            )
                        );
                    }
                }}
            >
                <PostsStack.Screen name='PostsTab'>
                {props => <PostsTab {...props} searchTextState={[searchText, setSearchText]} />}
                </PostsStack.Screen>
                <PostsStack.Screen name='Search'>
                {props => <Search {...props} searchTextState={[searchText, setSearchText]} />}
                </PostsStack.Screen>
                <PostsStack.Screen name='Clue'>
                {props => <Clue {...props} />}
                </PostsStack.Screen>
            </PostsStack.Navigator>
        </>
    );
};