import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {

    },
});

const MapRoute = () => {
    
    return (
        <View style={styles.root}>
            <Text>Map</Text>
        </View>
    )
};

export default MapRoute;