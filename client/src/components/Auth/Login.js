import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Image, Pressable, Text } from 'react-native';
import { TextInput, Button, Divider, HelperText } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import * as Google from 'expo-google-app-auth';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import env from '../../../env';

import { loginUser, googleLogin } from '../../redux/userReducer';
import { unwrapResult } from '@reduxjs/toolkit';

const styles = StyleSheet.create({
    input: {
        width: '50%',
        color: 'black',
        backgroundColor: 'white',
    },
});

export default ({ navigation, setIsSignIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailErrorMsg, setEmailErrorMsg] = useState('');
    const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [loginLoading, setLoginLoading] = useState(false);
    const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

    const dispatch = useDispatch();

    const checkEmail = (text) => {
        setEmail(text);
        setEmailErrorMsg(text ? '' : 'Must not be null!');
    };

    const checkPassword = (text) => {
        setPassword(text);
        setPasswordErrorMsg(text ? '' : 'Must not be null!');
    };

    useFocusEffect(useCallback(() => {
        setErrorMsg('');
        setEmailErrorMsg('');
        setPasswordErrorMsg('');
    }, []));

    const handleLogin = async () => {
        if (!email || !password || emailErrorMsg || passwordErrorMsg) {
            if (!email) setEmailErrorMsg('Must not be null!');
            if (!password) setPasswordErrorMsg('Must not be null!');
            return;
        }

        setLoginLoading(true);

        try {
            if ((await Location.getForegroundPermissionsAsync()).status !== 'granted') {
                if ((await Location.requestForegroundPermissionsAsync()).status !== 'granted') {
                    setErrorMsg('We need your location permission to load the app!');
                    setLoginLoading(false);
                    return;
                }
            }
            
            unwrapResult(await dispatch(loginUser({ email, password })));

            setEmail('');
            setPassword('');
            setErrorMsg('');

            console.log('Logged in, going to Home...');
            setIsSignIn(true);
        } catch (error) {
            console.log('While logging in:', error);
            setErrorMsg(error.message);
        }
        
        setLoginLoading(false);
    };

    const handleGoogleLogin = async () => {
        setGoogleLoginLoading(true);
        setEmailErrorMsg('');
        setPasswordErrorMsg('');
        
        try {
            const { type, user } = await Google.logInAsync({ 
                androidClientId: env.GOOGLE_ANDROID_CLIENT_ID, 
                iosClientId: env.GOOGLE_IOS_CLIENT_ID, 
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
                backgroundColor: 'white',
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
            <HelperText type='error'>
                {errorMsg}
            </HelperText>
            <TextInput 
                mode='outlined'
                placeholder='Email'
                placeholderTextColor='gray'
                error={emailErrorMsg}
                disabled={loginLoading || googleLoginLoading}
                value={email}
                style={styles.input}
                selectionColor='#666'
                theme={{ colors: { primary: '#ff8000' } }}
                onChangeText={checkEmail}
            />
            <HelperText type='error'>
                {emailErrorMsg}
            </HelperText>
            <TextInput 
                mode='outlined'
                placeholder='Password'
                placeholderTextColor='gray'
                error={passwordErrorMsg}
                disabled={loginLoading || googleLoginLoading}
                secureTextEntry
                value={password}
                style={styles.input}
                selectionColor='#666'
                theme={{ colors: { primary: '#ff8000' } }}
                onChangeText={checkPassword}
            />
            <HelperText type='error'>
                {passwordErrorMsg}
            </HelperText>
            <Button 
                mode='contained'
                disabled={loginLoading || googleLoginLoading}
                loading={loginLoading}
                style={{
                    width: '50%',
                    height: 50,
                    color: 'white',
                    backgroundColor: '#ff8000',
                    borderRadius: 10,
                    elevation: 3,
                }}
                contentStyle={{ width: '100%', height: '100%', }}
                onPress={handleLogin}
            >
                Login
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
                    borderRadius: 10,
                    elevation: 5,
                    marginTop: 10,
                }}
                contentStyle={{ width: '100%', height: '100%', }}
                onPress={handleGoogleLogin}
            >
                Google Login
            </Button> */}
            <Pressable 
                style={{ marginTop: 5 }}
                onPress={() => navigation.navigate('ForgetPassword')}
            >
                <Text style={{ color: '#ff8000' }}>
                    Forget password?
                </Text>
            </Pressable>
            <Divider 
                style={{
                    width: '90%',
                    borderColor: 'lightgray',
                    borderWidth: 1,
                    margin: 10,
                }} 
            />
            <View style={{ flexDirection: 'row' }}>
                <Text>
                    Don't have an account?
                </Text>
                <Pressable 
                    style={{ marginHorizontal: 3 }}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={{ color: '#ff8000' }}>
                        Sign up
                    </Text>
                </Pressable>
            </View>
            <Button
                mode='contained'
                uppercase={false}
                style={{ marginTop: 10, }}
                onPress={() => navigation.toggleDrawer()}
            >
                Options
            </Button>
        </View>
    );
};