import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#dcc7aa',
    }
});

const HomeRoute = () => {
    
    return (
        <View style={styles.root}>
            <Text>Home</Text>
        </View>
    )
};

export default HomeRoute;