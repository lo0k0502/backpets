import React from 'react';
import { Subheading, Text, useTheme } from 'react-native-paper';

export default ({ label = '', children }) => {
    const { colors } = useTheme();

    return (
        <Subheading style={{ padding: 10 }}>
            <Text style={{ color: colors.primary }}>{label}: </Text>
            {children}
        </Subheading>
    );
};