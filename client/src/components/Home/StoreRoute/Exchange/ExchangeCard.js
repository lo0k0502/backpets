import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, View } from 'react-native';
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper';
import { SERVERURL } from '../../../../api/API';
import { constants } from '../../../../utils';
import PointIcon from '../../../common/PointIcon';

export default ({
    product,
    setExchangeDialog = () => {},
    setExchangeProduct = () => {},
}) => {
    const { colors } = useTheme();

    return (
        <Card
            style={{
                borderRadius: 0,
                borderBottomWidth: 5,
                borderColor: colors.primary,
                elevation: 0,
            }}
        >
            <View>
                <Image
                    source={{ uri: `${SERVERURL}/image/${product.photoId}` }}
                    style={{ height: constants.boxSize }}
                    resizeMode='contain'
                />
                <Text style={{ fontSize: 12 }}>
                    {product.product_name}
                </Text>
                <Text style={{ fontSize: 12 }}>
                    {product.description}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <PointIcon size={18} />
                    <Text> {product.points}</Text>
                </View>
                <Text style={{ fontSize: 12 }}>
                    庫存數量: {product.remaining_quantity}
                </Text>
                <Divider
                    style={{
                        backgroundColor: colors.primary,
                        width: '95%',
                        height: 1,
                        alignSelf: 'center',
                    }}
                />
            </View>
            <Card.Actions style={{ flexDirection: 'row', padding: 0 }}>
                <Button
                    dark
                    disabled={!product.remaining_quantity}
                    style={{ flexGrow: 1 }}
                    theme={{ roundness: 0 }}
                    onPress={() => {
                        setExchangeProduct(product);
                        setExchangeDialog(true);
                    }}
                >
                    我要兌換
                </Button>
            </Card.Actions>
        </Card>
    );
};