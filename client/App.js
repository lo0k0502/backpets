import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, Button, TouchableHighlightComponent } from 'react-native';
import BottomNav from './src/components/BottomNav';

export default function App() {
  const [Count, setCount] = useState(0);

  const handlePress = () => {
    setCount(Count + 1);
  };

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    backgroundColor: 'dodgerblue',
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  statusbar: {
    flex: 1,
    backgroundColor: 'white',
  },
});
