import React from 'react';
import { Appbar } from 'react-native-paper';
import { constants } from '../../utils';
import { backIcon } from '../../utils/constants';

export default ({ route, navigation, routeName }) => {
    const _routeName = routeName || route.name;

    const onBackIconPress = () => {
        if (navigation.canGoBack()) return navigation.goBack();
    };

    return (
        <Appbar style={{ backgroundColor: 'white' }}>
        {
            _routeName === 'PostsRoute' ? (
                <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
            ) : (
                <Appbar.Action icon={backIcon} onPress={onBackIconPress} />
            )
        }
            <Appbar.Content
                title={constants.routeNametoTitle(_routeName)}
            />
        {
            _routeName === 'PostsRoute' ? (
                <Appbar.Action icon='magnify' onPress={() => navigation.navigate('Search')} />
            ) : null
        }
        </Appbar>
    );
};