import React from 'react';
import { View } from 'react-native';
import { Avatar, Paragraph, Text, useTheme } from 'react-native-paper';

export default () => {
    const { colors } = useTheme();

    return (
        <View
            style={{ flex: 1 }}
        >
            <View
                style={{
                    padding: 10,
                    flexDirection: 'row'
                }}
            >
                <Avatar.Icon icon='account' size={50} />
                <Paragraph
                    style={{
                        width: 200,
                        backgroundColor: 'white',
                        marginLeft: 10,
                        padding: 10,
                        borderRadius: 20,
                    }}
                >
                    你好!我是XXX醫生，很高興能為你解答問題，最近有什麼煩惱呢？
                </Paragraph>
            </View>
            <View
                style={{
                    width: '100%',
                    height: 60,
                    backgroundColor: 'white',
                    position: 'absolute',
                    bottom: 0,
                    padding: 10,
                }}
            >
                <View
                    style={{
                        flexGrow: 1,
                        backgroundColor: '#ddd',
                        borderRadius: 20,
                        justifyContent: 'center',
                        paddingLeft: 10
                    }}
                >
                    <Text style={{ color: colors.primary }}>
                        問點什麼...
                    </Text>
                </View>
            </View>
        </View>
    );
};