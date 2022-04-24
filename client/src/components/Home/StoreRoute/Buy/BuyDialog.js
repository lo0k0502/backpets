import React, { useState } from 'react';
import { Image, ScrollView } from 'react-native';
import { Dialog, HelperText } from 'react-native-paper';
import { SERVERURL } from '../../../../api/API';
import DialogActions from '../../../common/DialogActions';
import PostSubheading from '../../../common/PostSubheading';

export default ({
    visible,
    close,
    product,
    showSnackbar = () => {},
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        close();
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            await new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });

            showSnackbar('購買成功!');
            handleClose();
        } catch (error) {
            console.log('While buying: ', error);
        }

        setIsLoading(false);
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>購買商品</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView
                    style={{ height: '80%', paddingHorizontal: 20 }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <HelperText type='error' style={{ fontSize: 18 }}>
                        ※購買證明有效期限: 1個月
                    </HelperText>
                    <Image
                        source={{ uri: product.photoId ? `${SERVERURL}/image/${product.photoId}` : null }}
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
                    <PostSubheading label='價格'>
                        {product.price} TWD
                    </PostSubheading>
                </ScrollView>
            </Dialog.ScrollArea>
            <DialogActions
                cancelBtnLabel='取消'
                submitBtnLabel='購買'
                cancelBtnDisabled={isLoading}
                submitBtnDisabled={
                    isLoading
                    || !product.remaining_quantity
                }
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleClose}
            />
        </Dialog>
    );
};