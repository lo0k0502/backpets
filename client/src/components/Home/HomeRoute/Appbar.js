import React from 'react';
import { Appbar } from 'react-native-paper';

export default ({ scene: { route, descriptor: { navigation } } }) => {
    const isHome = route.name === 'Home';

    return (
        <Appbar style={{ backgroundColor: 'white' }}>
            {isHome ? <Appbar.Action icon='menu' onPress={navigation.toggleDrawer} />
                : <Appbar.Action icon='arrow-left' onPress={navigation.goBack} />}
            <Appbar.Content 
                title={isHome ? 'ProjectP!!!' : route.name} 
                subtitle={isHome ? 'P!!!' : ''} 
            />
        </Appbar>
    );
};