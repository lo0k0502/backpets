import React from 'react';
import { Dimensions } from 'react-native';
import { Divider, Paragraph, Subheading, Text, useTheme } from 'react-native-paper';
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
            data={constants.HelpPetProcess}
            renderItem={({ item }) => (
                <>
                    <Subheading style={{ color: colors.primary }}>{item.processTitle}</Subheading>
                    <FlatGrid
                        data={item.process}
                        itemDimension={Dimensions.get('window').width * 0.8}
                        renderItem={({ item, index }) => (
                            <Text>{index + 1}. {item}</Text>
                        )}
                    />
                    <Divider />
                </>
            )}
        />
    );
};