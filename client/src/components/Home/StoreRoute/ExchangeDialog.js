import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { Image, ScrollView } from 'react-native';
import { Dialog, HelperText, Subheading, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SERVERURL } from '../../../api/API';
import { exchangeProduct } from '../../../redux/userReducer';
import { selectUser } from '../../../redux/userSlice';
import DialogActions from '../../common/DialogActions';

export default ({
    visible,
    close,
    product,
    refreshAllProducts = () => {},
    refreshSelfCoupons = () => {},
}) => {
    const user = useSelector(selectUser);
    const { colors } = useTheme();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        close();
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            unwrapResult(await dispatch(exchangeProduct({
                userId: user.info._id,
                productId: product._id,
            })));

            refreshAllProducts();
            refreshSelfCoupons();
            handleClose();
        } catch (error) {
            console.log('While exchanging: ', error);
        }

        setIsLoading(false);
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>兌換商品</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView
                    style={{ height: '80%', paddingHorizontal: 20 }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <HelperText type='error' style={{ fontSize: 18 }}>
                        ※兌換券有效期限: 1個月
                    </HelperText>
                    <Image
                        source={{ uri: `${SERVERURL}/image/${product.photoId}` }}
                        style={{ height: 300 }}
                        resizeMode='contain'
                    />
                    <Subheading style={{ padding: 10 }}>
                        <Text style={{ color: colors.primary }}>商品名稱: </Text>
                        {product.product_name}
                    </Subheading>
                    <Subheading style={{ padding: 10 }}>
                        <Text style={{ color: colors.primary }}>商品簡介: </Text>
                        {product.description}
                    </Subheading>
                    <Subheading style={{ padding: 10 }}>
                        <Text style={{ color: colors.primary }}>庫存數量: </Text>
                        {product.remaining_quantity}
                    </Subheading>
                    <Subheading style={{ padding: 10 }}>
                        <Text style={{ color: colors.primary }}>公司名稱: </Text>
                        {product.company_name}
                    </Subheading>
                    <Subheading style={{ padding: 10 }}>
                        <Text style={{ color: colors.primary }}>公司電話: </Text>
                        {product.company_telephone}
                    </Subheading>
                    <Subheading style={{ padding: 10 }}>
                        <Text style={{ color: colors.primary }}>公司地址: </Text>
                        {product.company_address}
                    </Subheading>
                    <Subheading style={{ padding: 10 }}>
                        <Text style={{ color: colors.primary }}>所需點數: </Text>
                        {product.points}
                    </Subheading>
                    <HelperText type='error' style={{ fontSize: 16 }}>
                        {!(user.info?.points >= product.points) ? '您的點數不足!' : ''}
                    </HelperText>
                </ScrollView>
            </Dialog.ScrollArea>
            <DialogActions
                cancelBtnLabel='取消'
                submitBtnLabel='兌換'
                cancelBtnDisabled={isLoading}
                submitBtnDisabled={
                    isLoading
                    || !(user.info?.points >= product.points)
                    || !product.remaining_quantity
                }
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleClose}
            />
        </Dialog>
    );
};