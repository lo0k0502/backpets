import React, { useContext, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { Portal, Text, Title } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';
import Context from '../../../context';
import { constants } from '../../../utils';
import CouponCard from './CouponCard';
import CouponDialog from './CouponDialog';

export default () => {
    const { selfCoupons, refreshSelfCoupons, isFetchingSelfCoupons } = useContext(Context);

    const [couponDialog, setCouponDialog] = useState(false);
    const [exchangeCoupon, setExchangeCoupon] = useState({});

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Portal>
                <CouponDialog
                    visible={couponDialog}
                    close={() => setCouponDialog(false)}
                    coupon={exchangeCoupon}
                />
            </Portal>
            {
                isFetchingSelfCoupons ? null : (
                    selfCoupons.length ? (
                        <FlatGrid
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                            }}
                            contentContainerStyle={{ paddingBottom: 70 }}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={isFetchingSelfCoupons}
                                    onRefresh={refreshSelfCoupons}
                                />
                            )}
                            itemDimension={constants.boxSize}
                            data={selfCoupons}
                            renderItem={({ item }) => (
                                <CouponCard
                                    coupon={item}
                                    setExchangeCoupon={setExchangeCoupon}
                                    setCouponDialog={setCouponDialog}
                                />
                            )}
                        />
                    ) : (
                        <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有兌換券QQ</Title>
                    )
                )
            }
        </View>
    );
};