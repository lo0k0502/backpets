import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import BottomNav from './src/components/BottomNav';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
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