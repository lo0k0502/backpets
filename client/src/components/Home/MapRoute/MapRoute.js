import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Headline, Text } from 'react-native-paper';
import { useCurrentLocation, useMissions } from '../../../hooks';
import PostCallout from './PostCallout';

export default ({ route }) => {
  const { location } = route.params ? route.params : { location: null }; // Location from post

  const { currentLatitude, currentLongitude } = useCurrentLocation();
  const { missions } = useMissions();

  const [region, setRegion] = useState({ latitude: currentLatitude, longitude: currentLongitude });

  useFocusEffect(useCallback(() => {
    setRegion(location === null ? { latitude: currentLatitude, longitude: currentLongitude } : location);
  }, [location, currentLatitude, currentLongitude]));
  
  return (
    <MapView 
      // provider='PROVIDER_GOOGLE'
      style={{
        ...StyleSheet.absoluteFillObject,
      }}
      region={{
        ...region,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
      }}
      showsUserLocation={true}
      followsUserLocation={true}
    >
      {missions.map((mission, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: mission.location.latitude,
            longitude: mission.location.longitude,
          }}
          description={mission.content}
        >
          <Callout 
            tooltip
            onPress={() => {}}
          >
            <PostCallout mission={mission} />
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}