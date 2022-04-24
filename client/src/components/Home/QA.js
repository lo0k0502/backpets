import React from 'react';
import { Dimensions } from 'react-native';
import { Divider, Paragraph, Subheading, useTheme } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';
import { constants } from '../../utils';

export default () => {
    const { colors } = useTheme();

    return (
        <FlatGrid
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            itemDimension={Dimensions.get('window').width * 0.8}
            data={constants.QAs}
            renderItem={({ item, index }) => (
                <>
                    <Subheading style={{ color: colors.primary }}>{index + 1}. {item.question}</Subheading>
                    <Paragraph>{item.answer}</Paragraph>
                    <Divider />
                </>
            )}
        />
    );
};