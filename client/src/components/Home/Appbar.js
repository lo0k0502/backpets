import React from 'react';
import { Appbar } from 'react-native-paper';
import { constants, routeNametoTitle } from '../../utils';

export default ({ route, navigation, routeName }) => {
    const _routeName = routeName || route.name;

    const onBackIconPress = () => {
        if (navigation.canGoBack()) return navigation.goBack();
        return navigation.popToTop();
    };

    return (
        <Appbar style={{ backgroundColor: 'white' }}>
        {
            (
                _routeName === constants.pageNames[0]
                || _routeName === constants.pageNames[2]
                || _routeName === constants.pageNames[3]
                || _routeName === constants.pageNames[4]
                || _routeName === 'Profile'
                || _routeName === 'BottomNavigation'
            ) ? (
                <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
            ) : (
                <Appbar.Action icon={constants.backIcon} onPress={onBackIconPress} />
            )
        }
            <Appbar.Content
                title={routeNametoTitle(_routeName)}
            />
        {
            (
                _routeName === constants.pageNames[2]
                || _routeName === constants.pageNames[3]
                || _routeName === constants.pageNames[4]
                || _routeName === 'BottomNavigation'
            ) ? (
                <Appbar.Action icon='magnify' onPress={() => navigation.navigate('Search')} />
            ) : null
        }
        </Appbar>
    );
};