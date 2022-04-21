import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { Image, View } from 'react-native';
import { Button, Card, Divider, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { SERVERURL } from '../../../api/API';
import { constants } from '../../../utils';

export default ({
    coupon,
    setCouponDialog = () => {},
    setExchangeCoupon = () => {},
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
                    source={{ uri: `${SERVERURL}/image/${coupon.product.photoId}` }}
                    style={{ height: constants.boxSize }}
                    resizeMode='contain'
                />
                <Text style={{ fontSize: 12 }}>
                    {coupon.product.product_name}
                </Text>
                <Text style={{ fontSize: 12, flexDirection: 'row' }}>
                    <MaterialCommunityIcons name='clock-outline' />
                    {
                        moment().valueOf() <= coupon.due_time ? (
                            `截止時間: ${moment(coupon.due_time).format('YYYY-MM-DD HH:mm')}`
                        ) : '已截止'
                    }
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
                    disabled={!(moment().valueOf() <= coupon.due_time) || coupon.exchanged}
                    style={{ flexGrow: 1 }}
                    theme={{ roundness: 0 }}
                    onPress={() => {
                        setExchangeCoupon(coupon);
                        setCouponDialog(true);
                    }}
                >
                    {
                        moment().valueOf() <= coupon.due_time ? (
                            coupon.exchanged ? '已兌換' : '查看QRcode'
                        ) : '已截止'
                    }
                </Button>
            </Card.Actions>
        </Card>
    );
};