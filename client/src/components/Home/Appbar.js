import React from 'react';
import { Appbar } from 'react-native-paper';
import { constants } from '../../utils';
import { backIcon } from '../../utils/constants';

export default ({ route, navigation }) => {

    const onBackIconPress = () => {
        if (navigation.canGoBack()) return navigation.goBack();
    };

    return (
        <Appbar style={{ backgroundColor: 'white' }}>
        {
            route.name === 'PostsTab' ? (
                <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
            ) : (
                <Appbar.Action icon={backIcon} onPress={onBackIconPress} />
            )
        }
            <Appbar.Content
                title={constants.routeNametoTitle(route.name)}
            />
        {
            route.name === 'PostsTab' ? (
                <Appbar.Action icon='magnify' onPress={() => navigation.navigate('Search')} />
            ) : null
        }
        </Appbar>
    );
};