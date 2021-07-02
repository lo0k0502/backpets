import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'lightblue',
    }
});

const StoreRoute = () => {
    
    return (
        <View style={styles.root}>
            <Text>Store</Text>
        </View>
    )
};

export default StoreRoute;