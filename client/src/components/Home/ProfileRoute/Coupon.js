import React, { useCallback, useContext, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Divider, Portal, Subheading, Title } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';
import Context from '../../../context';
import { constants } from '../../../utils';
import CouponCard from './CouponCard';
import CouponDialog from './CouponDialog';
import SelectButton from '../SelectButton';
import moment from 'moment';

export default () => {
    const { selfCoupons, refreshSelfCoupons, isFetchingSelfCoupons } = useContext(Context);

    const dueTimeStates = ['全部', '未截止', '已截止'];
    const exchangeStates = ['全部', '未兌換', '已兌換'];

    const [couponDialog, setCouponDialog] = useState(false);
    const [exchangeCoupon, setExchangeCoupon] = useState({});

    const [dueTimeState, setDueTimeState] = useState(dueTimeStates[0]);
    const [dueTimeStateMenu, setDueTimeStateMenu] = useState(false);
    const [exchangeState, setExchangeState] = useState(exchangeStates[0]);
    const [exchangeStateMenu, setExchangeStateMenu] = useState(false);

    const checkCoupon = (coupon) => (
        (
            dueTimeState === dueTimeStates[0]
            || (dueTimeState === dueTimeStates[1] && moment().valueOf() <= coupon.due_time)
            || (dueTimeState === dueTimeStates[2] && !(moment().valueOf() <= coupon.due_time))
        ) && (
            exchangeState === exchangeStates[0]
            || (exchangeState === exchangeStates[1] && !coupon.exchanged)
            || (exchangeState === exchangeStates[2] && coupon.exchanged)
        )
    );

    const passedCheckCoupons = selfCoupons.filter(checkCoupon);

    useFocusEffect(useCallback(() => {
        refreshSelfCoupons();
    }, []));

    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    padding: '2%',
                    alignItems: 'center',
                    backgroundColor: 'white',
                }}
            >
                <Subheading>截止狀態: </Subheading>
                <SelectButton
                    stateSet={[dueTimeState, setDueTimeState]}
                    menuStateSet={[dueTimeStateMenu, setDueTimeStateMenu]}
                    options={dueTimeStates}
                />
                <Subheading> 兌換狀態: </Subheading>
                <SelectButton
                    stateSet={[exchangeState, setExchangeState]}
                    menuStateSet={[exchangeStateMenu, setExchangeStateMenu]}
                    options={exchangeStates}
                />
            </View>
            <Divider />
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Portal>
                    <CouponDialog
                        visible={couponDialog}
                        close={() => {
                            refreshSelfCoupons();
                            setCouponDialog(false);
                            setExchangeCoupon({});
                        }}
                        coupon={exchangeCoupon}
                    />
                </Portal>
                {
                    isFetchingSelfCoupons ? null : (
                        passedCheckCoupons.length ? (
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
                                data={passedCheckCoupons}
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
        </>
    );
};