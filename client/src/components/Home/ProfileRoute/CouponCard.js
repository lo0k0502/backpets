import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { Image, View } from 'react-native';
import { Card, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { SERVERURL } from '../../../api/API';
import { constants } from '../../../utils';

export default ({
    coupon,
    setCouponDialog = () => {},
    setExchangeCoupon = () => {},
}) => {
    const { colors } = useTheme();
console.log(moment().valueOf())
console.log(coupon.due_time)
    return (
        <TouchableRipple
            onPress={() => {
                if (!(moment().valueOf() <= coupon.due_time)) return;
                setExchangeCoupon(coupon);
                setCouponDialog(true);
            }}
        >
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
                </View>
            </Card>          
        </TouchableRipple>
    );
};