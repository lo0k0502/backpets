import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform, View, Text } from 'react-native';
import Login from './src/components/Login';
import BottomNav from './src/components/BottomNav';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  statusbar: {
    flex: 1,
  },
});

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        style="auto" 
        backgroundColor="white" 
        animated
        networkActivityIndicatorVisible
        translucent
      />
      <BottomNav />
    </SafeAreaView>
  );
}