import React from 'react';
import { StyleSheet, View, PermissionsAndroid, Button } from 'react-native';
import MapView, { Marker, MarkerAnimated, PROVIDER_GOOGLE } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';

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
        ...StyleSheet.absoluteFillObject,
    },     
});

const hasLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Success");
            MapRoute
        } else {
            console.log("Denied");
        }
    } catch (err) {
        console.warn(err);
    }
}

const MapRoute = () => {

    // if (hasLocationPermission) {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             console.log(position);
    //         },
    //         (error) => {
    //             // See error code charts below.
    //             console.log(error.code, error.message);
    //         },
    //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //     );
    // }
    
    // const currentLatitude = 
    // navigator.geolocation.getCurrentPosition(())
    //     const currentLongitude = ;
    
    return (
        
        <View style={styles.root}>
            <MapView 
            provider = { PROVIDER_GOOGLE }
            style = { styles.map }
            initialRegion = {{
                latitude: 23.5582878215,
                longitude: 120.471845313,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.003,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
            onPress = {(e) => 
                <Marker
                coordinate = {{
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,

                }} 
                />}
            >
                <Marker draggable
                coordinate = {{
                    latitude: 23.560043,
                    longitude: 120.469031,
                }} 
                title = {'花花'}
                />
                
            </MapView>
        </View>
    )
};

const AskingPermission = () => {
    return (
        <View style = { styles.root }>
            <Button title = "request Permissions" 
            onPress={hasLocationPermission}
            />
        </View>
    )
}

export default AskingPermission;