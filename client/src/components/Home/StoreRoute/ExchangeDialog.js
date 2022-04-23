import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { Image, ScrollView } from 'react-native';
import { Dialog, HelperText, Subheading, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SERVERURL } from '../../../api/API';
import { exchangeProduct } from '../../../redux/userReducer';
import { selectUser } from '../../../redux/userSlice';
import DialogActions from '../../common/DialogActions';
import PostSubheading from '../../common/PostSubheading';

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
                    <PostSubheading label='商品名稱'>
                        {product.product_name}
                    </PostSubheading>
                    <PostSubheading label='商品簡介'>
                        {product.description}
                    </PostSubheading>
                    <PostSubheading label='庫存數量'>
                        {product.remaining_quantity}
                    </PostSubheading>
                    <PostSubheading label='公司名稱'>
                        {product.company_name}
                    </PostSubheading>
                    <PostSubheading label='公司電話'>
                        {product.company_telephone}
                    </PostSubheading>
                    <PostSubheading label='公司地址'>
                        {product.company_address}
                    </PostSubheading>
                    <PostSubheading label='所需點數'>
                        {product.points}
                    </PostSubheading>
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