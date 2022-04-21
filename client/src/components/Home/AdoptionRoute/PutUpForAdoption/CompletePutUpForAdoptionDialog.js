import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Dialog, HelperText, TextInput } from 'react-native-paper';
import { completePutUpForAdoption } from '../../../../api';
import DialogActions from '../../../common/DialogActions';

export default ({
    visible,
    close = () => {},
    putUpForAdoptionId,
    refreshAllPutUpForAdoptions = () => {},
    refreshSelfPets = () => {},
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    
    const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    
    const handleClose = () => {
        close();

        setUsername('');
        setEmail('');
    };

    const checkUsername = (text) => {
        setUsername(text);
        setUsernameErrorMsg(!text ? '不可為空' : '');
    };

    const checkEmail = (text) => {
        setEmail(text);
        setEmailErrorMsg(/^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.[A-z]+$/.test(text) ? '' : '無效的電子郵件');
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            await completePutUpForAdoption(
                putUpForAdoptionId,
                {
                    adoptedUsername: username,
                    adoptedUserEmail: email,
                },
            );

            refreshAllPutUpForAdoptions();
            refreshSelfPets();
            handleClose();
        } catch (error) {
            console.log('While completing putUpForAdoption: ', error);
        }

        setIsLoading(false);
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>完成送養</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', paddingHorizontal: 20 }}>
                    <TextInput
                        mode='outlined'
                        label='領養者用戶名稱(必要)'
                        disabled={isLoading}
                        error={usernameErrorMsg}
                        value={username}
                        maxLength={20}
                        right={<TextInput.Affix text={`${username.length}/20`} />}
                        onChangeText={checkUsername}
                    />
                    <HelperText type='error'>
                        {usernameErrorMsg}
                    </HelperText>
                    <TextInput
                        mode='outlined'
                        label='領養者電子郵件(必要)'
                        keyboardType='email-address'
                        error={emailErrorMsg}
                        disabled={isLoading}
                        value={email}
                        style={{ width: '100%' }} 
                        onChangeText={checkEmail}
                    />
                    <HelperText type='error'>
                        {emailErrorMsg}
                    </HelperText>
                </ScrollView>
            </Dialog.ScrollArea>
            <DialogActions
                cancelBtnLabel='取消'
                submitBtnLabel='完成送養'
                cancelBtnDisabled={isLoading}
                submitBtnDisabled={
                    isLoading
                    || !username
                    || !email
                    || usernameErrorMsg
                    || emailErrorMsg
                }
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleClose}
            />
        </Dialog>
    );
};