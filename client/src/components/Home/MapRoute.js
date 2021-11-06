import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, PermissionsAndroid, Button } from 'react-native';
import MapView, { Marker, MarkerAnimated } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let currentLatitude = 0;
  let currentLongitude = 0;

  useFocusEffect(useCallback(() => {
  	(async () => {
      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult);
    })();
  }, []));

  if (location) {
    currentLatitude = location.coords.latitude;
    currentLongitude = location.coords.longitude;
  }
  
  return (
    <View 
      style = {{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

    <MapView 
      style={{
        ...StyleSheet.absoluteFillObject,
      }}

      region={{
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
      }}
      
      showsUserLocation={true}
      followsUserLocation={true}
    >

      <Marker
        coordinate={{
            latitude: 23.560043,
            longitude: 120.469031,
        }} 
        title='花花'
      />
        
    </MapView>
    </View>
  );
}