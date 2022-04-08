import React from 'react';
import { Appbar } from 'react-native-paper';
import { constants } from '../../utils';
import { backIcon } from '../../utils/constants';

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
                _routeName === 'PostsRoute'
                || _routeName === 'PostsTab'
                || _routeName === 'Profile'
            ) ? (
                <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
            ) : (
                <Appbar.Action icon={backIcon} onPress={onBackIconPress} />
            )
        }
            <Appbar.Content
                title={constants.routeNametoTitle(_routeName)}
            />
        {
            (
                _routeName === 'PostsRoute'
                || _routeName === 'PostsTab'
            ) ? (
                <Appbar.Action icon='magnify' onPress={() => navigation.navigate('Search')} />
            ) : null
        }
        </Appbar>
    );
};