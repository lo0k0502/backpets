import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Image, Pressable, Text } from 'react-native';
import { TextInput, Button, Divider, HelperText, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import * as Google from 'expo-google-app-auth';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';

import { loginUser, googleLogin } from '../../redux/userReducer';
import { unwrapResult } from '@reduxjs/toolkit';

const styles = StyleSheet.create({
    input: {
        color: 'black',
        backgroundColor: 'white',
        marginBottom: 5,
    },
});

export default ({ navigation, setSignInState }) => {
    const { colors } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordSecure, setPasswordSecure] = useState(true);

    const [errorMsg, setErrorMsg] = useState('');

    const [loginLoading, setLoginLoading] = useState(false);
    const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

    const dispatch = useDispatch();

    useFocusEffect(useCallback(() => {
        setErrorMsg('');
    }, []));

    const handleLogin = async () => {
        if (!email || !password) {
            return;
        }

        setErrorMsg('1');

        setLoginLoading(true);

        setErrorMsg('2');

        try {
            if ((await Location.getForegroundPermissionsAsync()).status !== 'granted') {
                if ((await Location.requestForegroundPermissionsAsync()).status !== 'granted') {
                    setErrorMsg('權限不足!我們需要存取位置資訊來運行應用程式!');
                    setLoginLoading(false);
                    return;
                }
            }

            setErrorMsg('3');
            
            unwrapResult(await dispatch(loginUser({ email, password })));

            setErrorMsg('4');

            setEmail('');
            setPassword('');
            setErrorMsg('');

            console.log('Logged in, going to Home...');
            setSignInState(true);
        } catch (error) {
            console.log('While logging in:', error);
            setErrorMsg(error.message);
        }
        
        setLoginLoading(false);
    };

    const handleGoogleLogin = async () => {
        setGoogleLoginLoading(true);
        
        try {
            const { type, user } = await Google.logInAsync({ 
                androidClientId: GOOGLE_ANDROID_CLIENT_ID, 
                iosClientId: GOOGLE_IOS_CLIENT_ID, 
                scopes: ['profile', 'email'], 
            });
            console.log(type, user)
            if (type === 'success') {
                const { email, familyName, givenName, photoUrl } = user;
    
                unwrapResult(await dispatch(googleLogin({ 
                    username: familyName + givenName,
                    email,
                    photoUrl, 
                })));

                console.log('Logged in, going to Home...');
                navigation.navigate('Home');
                setEmail('');
                setPassword('');
                setErrorMsg('');
            }
        } catch (error) {
            console.log('While google logging in:', error.message);
            setErrorMsg(error.message);
        }

        setGoogleLoginLoading(false);
    };

    return (
        <View 
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0e5da',
            }}
        >
            <Image 
                source={require('../../../assets/rsz_black-cat-icon-6.png')} 
                style={{
                    width: '30%',
                    height: '28%',
                    marginBottom: 10,
                }}
            />
            <View style={{ width: '50%', justifyContent: 'center' }}>
                <HelperText type='error'>
                    {errorMsg}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    placeholder='Email'
                    placeholderTextColor='gray'
                    disabled={loginLoading || googleLoginLoading}
                    value={email}
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput 
                    mode='outlined'
                    placeholder='密碼'
                    placeholderTextColor='gray'
                    disabled={loginLoading || googleLoginLoading}
                    secureTextEntry={passwordSecure}
                    value={password}
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    right={
                        <TextInput.Icon 
                            name={passwordSecure ? 'eye-off' : 'eye'} 
                            onPress={() => setPasswordSecure(!passwordSecure)}
                        />
                    }
                />
                <Button 
                    mode='contained'
                    disabled={loginLoading || googleLoginLoading}
                    loading={loginLoading}
                    dark
                    style={{
                        height: 50,
                        marginVertical: 5,
                        color: 'white',
                    }}
                    contentStyle={{ width: '100%', height: '100%', }}
                    onPress={handleLogin}
                >
                    登入
                </Button>
                {/* <Button
                    mode='contained'
                    icon={require('../../../assets/GoogleIconG.png')}
                    disabled={loginLoading || googleLoginLoading}
                    loading={googleLoginLoading}
                    style={{
                        width: '50%',
                        height: 50,
                        color: 'white',
                        backgroundColor: 'green',
                        marginTop: 10,
                    }}
                    contentStyle={{ width: '100%', height: '100%', }}
                    onPress={handleGoogleLogin}
                >
                    Google Login
                </Button> */}
            </View>
            <Pressable
                style={{ marginTop: 10 }}
                onPress={() => {
                    if (loginLoading || googleLoginLoading) return;
                    navigation.navigate('ForgetPassword');
                }}
            >
                <Text style={{ color: colors.primary }}>
                    忘記密碼?
                </Text>
            </Pressable>
            <Divider 
                style={{
                    width: '90%',
                    borderColor: colors.accent,
                    borderWidth: 1,
                    margin: 10,
                }} 
            />
            <View style={{ flexDirection: 'row' }}>
                <Text>
                    還沒有帳號?
                </Text>
                <Pressable 
                    style={{ marginHorizontal: 3 }}
                    onPress={() => {
                        if (loginLoading || googleLoginLoading) return;
                        navigation.navigate('Register');
                    }}
                >
                    <Text style={{ color: colors.primary }}>
                        註冊
                    </Text>
                </Pressable>
            </View>
            <Button
                mode='contained'
                uppercase={false}
                disabled={loginLoading || googleLoginLoading}
                dark
                style={{ marginTop: 10 }}
                onPress={() => navigation.toggleDrawer()}
            >
                選項
            </Button>
        </View>
    );
};