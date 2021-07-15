import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView from 'react-native-maps';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {

    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

const MapRoute = () => {
    
    return (
        <View style={styles.root}>
            <MapView style={styles.map}/>
        </View>
    )
};

export default MapRoute;