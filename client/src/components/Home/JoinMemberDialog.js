import React from 'react';
import { Dialog, Headline, Paragraph, Subheading, Text, Title, useTheme } from 'react-native-paper';
import DialogActions from '../common/DialogActions';

export default ({ visible, close }) => {
    const { colors } = useTheme();

    const handleClose = () => {
        close();
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>升級付費會員</Dialog.Title>
            <Dialog.Content>
                <Subheading style={{ color: colors.primary }}>升級付費會員有什麼好處?</Subheading>
                <Paragraph>1. 簽到點數加倍</Paragraph>
                <Paragraph>2. 任務發布的次數增加</Paragraph>
                <Paragraph>3. 可使用獸醫聊天室功能</Paragraph>
            </Dialog.Content>
            <DialogActions
                cancelBtnLabel='取消'
                submitBtnLabel='升級'
                onSubmit={handleClose}
                onCancel={handleClose}
            />
        </Dialog>
    );
};