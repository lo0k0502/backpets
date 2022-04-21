import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

export default () => {
    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
        >
            <Text>AdoptionRoute</Text>
        </ScrollView>
    );
};