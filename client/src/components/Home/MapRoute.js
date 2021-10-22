import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, Button } from 'react-native';
import MapView, { Marker, MarkerAnimated } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let currentLatitude = 0;
  let currentLongitude = 0;

  useEffect(() =>
  	(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })
  )

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } 
  else if (location) {
    //text = JSON.stringify(location);
    currentLatitude = Number(location.coords.latitude);
    currentLongitude = Number(location.coords.longitude);
  }
  
  return (
    <View 
      style = {
        {
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }
      }
    >
      
    <MapView 
      style = {{
        ...StyleSheet.absoluteFillObject,
      }}

      initialRegion = {{
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
      }}

      showsUserLocation={true}
      followsUserLocation={true}
      onPress = { (e) => 
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
  );
}