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
            Alert.alert('Success!', 'Reset password email sent!\nGoing back...', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch (error) {
            console.log(error.response?.data?.message);
            setIsLoading(false);
            setErrorMsg(error.response?.data?.message);
        }
    };

    return (
        <View 
            style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{ fontSize: 20 }}>Please enter your email</Text>
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
                    theme={{ colors: { primary: '#ff8000' } }}
                    onChangeText={text => setEmail(text)}
                />
                <HelperText type='error'>
                    {!isEmailValid ? 'Email is not valid!' : null}
                </HelperText>
                <Button 
                    mode='contained'
                    color='#ff8000'
                    dark
                    loading={isLoading}
                    style={{
                        width: '60%',
                        height: 50,
                        elevation: 3,
                    }}
                    contentStyle={{ width: '100%', height: '100%' }}
                    onPress={handleSubmit}
                >
                    Send
                </Button>
            </KeyboardAvoidingView>
        </View>
    );
};