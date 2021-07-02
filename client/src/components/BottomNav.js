import React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import HomeRoute from './HomeRoute';
import MapRoute from './MapRoute';
import StoreRoute from './StoreRoute';

const BottomNav = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'home', title: 'Home', icon: 'home' },
        { key: 'map', title: 'Map', icon: 'map' },
        { key: 'store', title: 'Store', icon: 'store' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        home: HomeRoute,
        map: MapRoute,
        store: StoreRoute,
    });

    return (
        <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting
        barStyle={{ backgroundColor: '#48609d', }}
        />
    );
};

export default BottomNav;