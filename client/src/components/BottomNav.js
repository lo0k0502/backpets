import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import HomeRoute from './HomeRoute';
import MapRoute from './MapRoute';
import StoreRoute from './StoreRoute';

const styles = StyleSheet.create({
  bar: {
    height: 54,
    margin: 10,
    backgroundColor: '#14f1e5', 
    borderTopEndRadius: 35, 
    borderTopStartRadius: 35, 
    borderBottomEndRadius: 35, 
    borderBottomStartRadius: 35, 
    overflow: 'hidden',
  },
});

const BottomNav = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'home', title: 'Home', icon: 'home', color: '#ff8000' },
        { key: 'map', title: 'Map', icon: 'map', color: '#42f587' },
        { key: 'store', title: 'Store', icon: 'store', color: 'dodgerblue' },
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
        sceneAnimationEnabled
        activeColor="black"
        inactiveColor="gray"
        barStyle={styles.bar}
        />
    );
};

export default BottomNav;