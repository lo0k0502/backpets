import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Platform } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { UserRegister } from '../../api';

const styles = StyleSheet.create({
    input: {
        width: '100%',
    },
});

export default ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSecure, setPasswordSecure] = useState(true);
    const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);

    const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkUsername = (text) => {
        setUsername(text);
        setUsernameErrorMsg(text ? '' : 'Must not be null!');
    };

    const checkEmail = (text) => {
        setEmail(text);
        setEmailErrorMsg(text ? '' : 'Must not be null!');
        if (!text) return;

        let validAddress = /^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.[A-z]+$/;
        setEmailErrorMsg(validAddress.test(text) ? '' : 'Email address invalid!');
    };

    const checkPassword = (text) => {
        setPassword(text);
        setPasswordErrorMsg(text ? '' : 'Must not be null!');
        if (!text) return;

        setPasswordErrorMsg(text.length >= 8 ? '' : 'Must be at least 8 letters!');
    };

    const checkConfirmPassword = (text) => {
        setConfirmPassword(text);
        setConfirmPasswordErrorMsg(text ? '' : 'Must not be null!');
        if (!text) return;
        
        setConfirmPasswordErrorMsg(text === password ? '' : 'Not the same as password!');
    };

    const handleSubmit = async () => {
        if (!username 
            || !email 
            || !password 
            || usernameErrorMsg 
            || emailErrorMsg 
            || passwordErrorMsg 
            || confirmPasswordErrorMsg) {
            if (!username) setUsernameErrorMsg('Must not be null!');
            if (!email) setEmailErrorMsg('Must not be null!');
            if (!password) setPasswordErrorMsg('Must not be null!');
            if (!confirmPassword) setConfirmPasswordErrorMsg('Must not be null!');
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
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{ fontSize: 50 }}>Register</Text>
            <KeyboardAvoidingView 
                // behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                behavior='padding'
                style={{
                    width: '50%',
                    alignItems: 'center',
                }}
            >
                <HelperText
                    type='error'
                >
                    {errorMsg}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    placeholder='Username'
                    placeholderTextColor='gray'
                    error={usernameErrorMsg}
                    disabled={isLoading}
                    value={username}
                    style={styles.input} 
                    selectionColor='#666'
                    theme={{ colors: { primary: '#ff8000' } }}
                    onChangeText={checkUsername}
                />
                <HelperText 
                    type='error' 
                >
                    {usernameErrorMsg}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    placeholder='E-mail'
                    placeholderTextColor='gray'
                    error={emailErrorMsg}
                    disabled={isLoading}
                    value={email}
                    style={{ width: '100%' }} 
                    selectionColor='#666'
                    theme={{ colors: { primary: '#ff8000' } }}
                    onChangeText={checkEmail}
                />
                <HelperText 
                    type='error' 
                >
                    {emailErrorMsg}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    placeholder='Password'
                    placeholderTextColor='gray'
                    error={passwordErrorMsg}
                    disabled={isLoading}
                    secureTextEntry={passwordSecure}
                    value={password}
                    style={styles.input} 
                    selectionColor='#666'
                    theme={{ colors: { primary: '#ff8000' } }}
                    onChangeText={checkPassword}
                    right={
                        <TextInput.Icon 
                            name={passwordSecure ? 'eye-off' : 'eye'} 
                            onPress={() => setPasswordSecure(!passwordSecure)}
                        />
                    }
                />
                <HelperText 
                    type='error' 
                >
                    {passwordErrorMsg}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    placeholder='ConfirmPassword'
                    placeholderTextColor='gray'
                    error={confirmPasswordErrorMsg}
                    disabled={isLoading}
                    secureTextEntry={confirmPasswordSecure}
                    value={confirmPassword}
                    style={styles.input} 
                    selectionColor='#666'
                    theme={{ colors: { primary: '#ff8000' } }}
                    onChangeText={checkConfirmPassword}
                    right={
                        <TextInput.Icon 
                            name={confirmPasswordSecure ? 'eye-off' : 'eye'} 
                            onPress={() => setConfirmPasswordSecure(!confirmPasswordSecure)}
                        />
                    }
                />
                <HelperText 
                    type='error' 
                >
                    {confirmPasswordErrorMsg}
                </HelperText>
                <Button 
                    mode='contained'
                    color='#ff8000'
                    dark
                    loading={isLoading}
                    style={{
                        width: '60%',
                        height: 50,
                        elevation: 5,
                    }}
                    contentStyle={{ width: '100%', height: '100%' }}
                    onPress={handleSubmit}
                >
                    Sign Up
                </Button>
            </KeyboardAvoidingView>
        </View>
    );
};