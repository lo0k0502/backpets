import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { Headline, Text } from 'react-native-paper';
import { useCurrentLocation, usePosts } from '../../../hooks';
import PostCallout from './PostCallout';

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
      {posts.map((post, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: post.location.latitude,
            longitude: post.location.longitude,
          }}
          title={post.title}
          description={post.content}
        >
          <Callout 
            tooltip
            onPress={() => {}}
          >
            <PostCallout post={post} />
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}