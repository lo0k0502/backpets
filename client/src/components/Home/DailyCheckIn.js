import React, { useState } from 'react';
import { View } from 'react-native';
import { Dialog, Text } from 'react-native-paper';
import DialogActions from '../common/DialogActions';
import PointIcon from '../common/PointIcon';

export default ({
    visible,
    close,
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

            showSnackbar('簽到成功!');
            handleClose();
        } catch (error) {
            console.log('While checking in: ', error);
        }

        setIsLoading(false);
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>每日簽到</Dialog.Title>
            <Dialog.Content>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>今日簽到獎勵: </Text>
                        <PointIcon />
                        <Text> 30</Text>
                    </View>
                </View>
            </Dialog.Content>
            <DialogActions
                cancelBtnLabel='取消'
                submitBtnLabel='簽到'
                cancelBtnDisabled={isLoading}
                submitBtnDisabled={isLoading}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleClose}
            />
        </Dialog>
    );
};