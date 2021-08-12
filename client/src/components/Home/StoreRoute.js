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

export default () => {
    
    return (
        <View style={styles.root}>
            <Text>Store</Text>
        </View>
    )
};