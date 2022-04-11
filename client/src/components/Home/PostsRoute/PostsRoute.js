import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PostsTab from './PostsTab';
import Search from './Search';
import AppSearchbar from '../AppSearchbar';
import Appbar from '../Appbar';
import Clue from '../Clue';
import { useNavigationState } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { updateSearchHistory } from '../../../redux/userReducer';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { constants } from '../../../utils';

const PostsStack = createStackNavigator();

export default (props) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const currentRouteState = useNavigationState(state => state.routes.find(route => route.name === constants.pageNames[2]).state);
    const currentRoute = currentRouteState?.routes[currentRouteState?.routes.length - 1];

    const addSearchHistory = async (text) => {
        try {
            unwrapResult(await dispatch(updateSearchHistory({ searchHistory: text })));
        } catch (error) {
            console.log('While updating search history: ', error);
        }
    };

    return (
        <>
            {
                currentRouteState ? (
                    (
                        currentRoute.name !== 'Clue'
                        && !(currentRoute.name === 'PostsTab' && !searchText)
                    ) ? (
                        <AppSearchbar
                            {...props}
                            routeName={currentRoute?.name}
                            value={searchText}
                            outlineColor='transparent'
                            activeOutlineColor={colors.background2}
                            onChangeText={setSearchText}
                            searchFunction={() => {
                                addSearchHistory(searchText);
                                if (currentRoute?.name === 'Search') props.navigation.navigate('PostsTab');
                            }}
                            onPressOut={() => {
                                if (currentRoute?.name !== 'Search') props.navigation.navigate('Search');
                            }}
                            onBackPress={() => {
                                setSearchText('');
                                props.navigation.pop(1);
                            }}
                            onMenuPress={props.navigation.toggleDrawer}
                            onClearButtonPress={() => {
                                if (currentRoute?.name !== 'Search') props.navigation.navigate('Search');
                                setSearchText('');
                            }}
                        />
                    ) : <Appbar routeName={currentRoute?.name} {...props} />
                ) : (
                    <Appbar routeName={currentRoute?.name} {...props} />
                )
            }
            <PostsStack.Navigator screenOptions={{ headerShown: false }}>
                <PostsStack.Screen name='PostsTab'>
                {props => <PostsTab {...props} searchTextState={[searchText, setSearchText]} />}
                </PostsStack.Screen>
                <PostsStack.Screen name='Search'>
                {props => (
                    <Search
                        {...props}
                        searchTextState={[searchText, setSearchText]}
                        onItemPress={item => {
                            setSearchText(item);
                            addSearchHistory(item);
                            props.navigation.navigate('PostsTab');
                        }}
                    />
                )}
                </PostsStack.Screen>
                <PostsStack.Screen name='Clue'>
                {props => <Clue {...props} />}
                </PostsStack.Screen>
            </PostsStack.Navigator>
        </>
    );
};