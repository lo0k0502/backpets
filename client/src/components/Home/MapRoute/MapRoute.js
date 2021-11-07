import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useCurrentLocation, usePosts } from '../../../hooks';
import Post from '../HomeRoute/Post';

export default () => {
  const { currentLatitude, currentLongitude } = useCurrentLocation();
  const { posts } = usePosts();
  
  return (
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
      {posts.map(post => (
        <Marker
          coordinate={{
            latitude: post.location.latitude,
            longitude: post.location.longitude,
          }}
          title={post.title}
          key={post._id}
        />
      ))}
    </MapView>
  );
}