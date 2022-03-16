import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Platform } from 'react-native';
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper';
import { UserRegister } from '../../api';
import { useStateWithValidation } from '../../hooks'

const styles = StyleSheet.create({
    input: {
        width: '100%',
    },
});

export default ({ navigation }) => {
    const { colors } = useTheme();

    const [username, setUsername, isUsernameValid] = useStateWithValidation('');
    const [email, setEmail, isEmailValid] = useStateWithValidation('', value => /^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.[A-z]+$/.test(value));
    const [password, setPassword, isPasswordValid] = useStateWithValidation('', value => value.length >= 8);
    const [confirmPassword, setConfirmPassword, isConfirmPasswordValid] = useStateWithValidation('', value => value === password);
    const [passwordSecure, setPasswordSecure] = useState(true);
    const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);

    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!username 
            || !email 
            || !password) {
            if (!username) setUsername('');
            if (!email) setEmail('');
            if (!password) setPassword('');
            return;
        }

        try {
            setIsLoading(true);

            const result = await UserRegister({
                username,
                password,
                email,
            });
            if (result) navigation.goBack();
            
            setIsLoading(false);
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setErrorMsg('');
        } catch (error) {
            setIsLoading(false);
            setErrorMsg(error.response.data.message);
        }
    };

    return (
        <View 
            style={{
                flex: 1,
                backgroundColor: colors.background2,
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >
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
                    label='帳號名稱'
                    error={!isUsernameValid}
                    disabled={isLoading}
                    value={username}
                    style={styles.input}
                    maxLength={20}
                    right={<TextInput.Affix text={`${username.length}/20`} />}
                    onChangeText={text => setUsername(text)}
                />
                <HelperText type='error'>
                    {!isUsernameValid ? '不可為空!' : null}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    label='E-mail'
                    keyboardType='email-address'
                    error={!isEmailValid}
                    disabled={isLoading}
                    value={email}
                    style={{ width: '100%' }} 
                    onChangeText={text => setEmail(text)}
                />
                <HelperText type='error'>
                    {!isEmailValid ? '無效的電子郵件!' : null}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    label='密碼'
                    error={!isPasswordValid}
                    disabled={isLoading}
                    secureTextEntry={passwordSecure}
                    value={password}
                    style={styles.input} 
                    onChangeText={text => setPassword(text)}
                    right={
                        <TextInput.Icon 
                            name={passwordSecure ? 'eye-off' : 'eye'} 
                            onPress={() => setPasswordSecure(!passwordSecure)}
                        />
                    }
                />
                <HelperText type='error'>
                    {!isPasswordValid ? '必須為8個以上的英文字母或數字!' : null}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    label='確認密碼'
                    error={!isConfirmPasswordValid}
                    disabled={isLoading}
                    secureTextEntry={confirmPasswordSecure}
                    value={confirmPassword}
                    style={styles.input}
                    onChangeText={text => setConfirmPassword(text)}
                    right={
                        <TextInput.Icon 
                            name={confirmPasswordSecure ? 'eye-off' : 'eye'} 
                            onPress={() => setConfirmPasswordSecure(!confirmPasswordSecure)}
                        />
                    }
                />
                <HelperText type='error'>
                    {!isConfirmPasswordValid ? '與新密碼不相符!' : null}
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
                    註冊
                </Button>
            </KeyboardAvoidingView>
        </View>
    );
};