import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PostsTab from './PostsTab';
import Search from './Search';
import AppSearchbar from '../AppSearchbar';
import Appbar from '../Appbar';
import Clue from '../Clue';
import { useNavigationState } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

const PostsStack = createStackNavigator();

export default (props) => {
    const { colors } = useTheme();

    const [searchText, setSearchText] = useState('');
    const currentRouteState = useNavigationState(state => state.routes.find(route => route.name === 'PostsRoute').state);
    const currentRoute = currentRouteState?.routes[currentRouteState?.routes.length - 1];

    const updateSearchHistory = async (text) => {

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
                            searchFunction={currentRoute?.name === 'Search' ? (() => props.navigation.navigate('PostsTab')) : () => {}}
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
                    ) : <Appbar {...props} />
                ) : (
                    <Appbar routeName={currentRoute?.name} {...props} />
                )
            }
            <PostsStack.Navigator screenOptions={{ headerShown: false }}>
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