import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
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