import React from 'react';
import { Badge, Text, useTheme } from 'react-native-paper';

/**
 * @param {{
 *  mode: 'light' | 'dark',
 *  style: {},
 *  size: Number,
 * }}
 */
export default ({
    mode = 'dark',
    style = {},
    size = 20,
}) => {
    const light = mode === 'light';

    const { colors } = useTheme();

    return (
        <Badge
            style={[{
                backgroundColor: light ? 'white' : colors.primary,
                alignSelf: 'center',
            }, style]}
            size={size}
        >
            <Text
                style={{
                    color: light ? colors.primary : 'white',
                    fontSize: size - 2,
                }}
            >
                B
            </Text>
        </Badge>
    );
};