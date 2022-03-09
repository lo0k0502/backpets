import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Text, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { SendResetPasswordEmail } from '../../api';
import { useStateWithValidation } from '../../hooks';

export default ({ navigation }) => {
    const [email, setEmail, isEmailValid] = useStateWithValidation('', value => /^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.[A-z]+$/.test(value));

    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) return setEmail('');

        setIsLoading(true);

        try {
            await SendResetPasswordEmail({ email });
            setIsLoading(false);
            setErrorMsg('');
            Alert.alert('成功!', '重設密碼的郵件已寄至您的信箱!\n回到上一頁...', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch (error) {
            console.log(error.response.data.message);
            setIsLoading(false);
            setErrorMsg(error.response.data.message);
        }
    };

    return (
        <View 
            style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
            }}
        >
            <Text style={{ fontSize: 20, marginTop: '5%' }}>請輸入您的電子郵件</Text>
            <KeyboardAvoidingView 
                // behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                behavior='padding'
                style={{
                    width: '50%',
                    alignItems: 'center',
                }}
            >
                <HelperText type='error'>
                    {errorMsg}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    placeholder='E-mail'
                    placeholderTextColor='gray'
                    error={!isEmailValid}
                    disabled={isLoading}
                    value={email}
                    style={{ width: '100%' }} 
                    selectionColor='#666'
                    onChangeText={text => setEmail(text)}
                />
                <HelperText type='error'>
                    {!isEmailValid ? '無效的電子郵件!' : null}
                </HelperText>
                <Button 
                    mode='contained'
                    dark
                    loading={isLoading}
                    style={{
                        width: '60%',
                        height: 50,
                    }}
                    contentStyle={{ width: '100%', height: '100%' }}
                    onPress={handleSubmit}
                >
                    確認
                </Button>
            </KeyboardAvoidingView>
        </View>
    );
};