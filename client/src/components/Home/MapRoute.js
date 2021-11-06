import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, PermissionsAndroid, Button } from 'react-native';
import MapView, { Marker, MarkerAnimated } from 'react-native-maps';
import { useCurrentLocation } from '../../hooks';
import Constants from 'expo-constants';

export default () => {
  const { currentLatitude, currentLongitude } = useCurrentLocation();
  
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