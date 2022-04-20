import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { Image, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button, Dialog, Divider, IconButton, Subheading, useTheme } from 'react-native-paper';
import { SERVERURL } from '../../../api/API';
import { constants, isEmptyObject } from '../../../utils';

export default ({
    visible,
    close,
    coupon,
}) => {
    const { colors } = useTheme();

    const handleClose = () => {
        close();
    };

    return (
        <Dialog
            style={{
                backgroundColor: colors.boneColor,
            }}
            visible={visible}
            onDismiss={handleClose}
        >
            {
                isEmptyObject(coupon) ? null : (
                    <View
                        style={{
                            height: '90%',
                            padding: '5%',
                            paddingTop: '10%',
                        }}
                    >
                        <IconButton
                            icon={constants.backIcon}
                            onPress={handleClose}
                        />
                        <View style={{ alignSelf: 'center', margin: 10 }}>
                            <QRCode
                                value={`${SERVERURL}/coupon/${coupon._id}`}
                                size={200}
                                logo={require('../../../../assets/B.png')}
                            />
                        </View>
                        <Subheading style={{ alignSelf: 'center' }}>
                            <MaterialCommunityIcons name='clock-outline' size={18} />
                            截止時間: {moment(coupon.due_time).format('YYYY-MM-DD HH:mm')}
                        </Subheading>
                        <Divider style={{ backgroundColor: colors.primary, height: 1, marginVertical: 5 }} />
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Subheading>
                                {'商品名稱: '}
                            </Subheading>
                            <Subheading style={{ width: '70%' }}>
                                {coupon.product.product_name}
                            </Subheading>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Subheading>
                                {'商品簡介: '}
                            </Subheading>
                            <Subheading style={{ width: '70%' }}>
                                {coupon.product.description}
                            </Subheading>
                        </View>
                        <Subheading>
                            公司名稱: {coupon.product.company_name}
                        </Subheading>
                        <Subheading>
                            公司電話: {coupon.product.company_telephone}
                        </Subheading>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Subheading>
                                {'公司地址: '}
                            </Subheading>
                            <Subheading style={{ width: '70%' }}>
                                {coupon.product.company_address}
                            </Subheading>
                        </View>
                    </View>
                )
            }
        </Dialog>
    );
};