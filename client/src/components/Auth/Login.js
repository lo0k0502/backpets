import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Image, Pressable, Text } from 'react-native';
import { TextInput, Button, Divider, HelperText } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import * as Google from 'expo-google-app-auth';
import { useFocusEffect } from '@react-navigation/native';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';

import { loginUser, googleLogin } from '../../redux/userReducer';
import { unwrapResult } from '@reduxjs/toolkit';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    img: {
        width: '30%',
        height: '30%',
        marginBottom: 10,
    },
    input: {
        width: '50%',
        color: 'black',
        backgroundColor: 'white',
    },
    loginbtn: {
        width: '50%',
        height: 50,
        color: 'white',
        backgroundColor: 'dodgerblue',
        borderRadius: 10,
        elevation: 5,
    },
    googleloginbtn: {
        width: '50%',
        height: 50,
        color: 'white',
        backgroundColor: 'green',
        borderRadius: 10,
        elevation: 5,
        marginTop: 10,
    },
    divider: {
        width: '90%',
        borderColor: 'lightgray',
        borderWidth: 1,
        margin: 10,
    },
    signupmsg: {
        flexDirection: 'row',
    },
    signupbtn: {
        marginLeft: 3,
        marginRight: 3,
    },
});

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [loginLoading, setLoginLoading] = useState(false);
    const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

    const dispatch = useDispatch();

    const checkUsername = (text) => {
        setUsername(text);
        setUsernameErrorMsg(text ? '' : 'Must not be null!');
    };

    const checkPassword = (text) => {
        setPassword(text);
        setPasswordErrorMsg(text ? '' : 'Must not be null!');
    };

    useFocusEffect(useCallback(() => {
        setErrorMsg('');
        setUsernameErrorMsg('');
        setPasswordErrorMsg('');
    }, []));

    const handleLogin = async () => {
        if (!username || !password || usernameErrorMsg || passwordErrorMsg) {
            if (!username) setUsernameErrorMsg('Must not be null!');
            if (!password) setPasswordErrorMsg('Must not be null!');
            return;
        }

        setLoginLoading(true);

        try {
            const result = await dispatch(loginUser({ username, password }));
            const unwrapedResult = unwrapResult(result);

            if (unwrapedResult) {
                console.log('Logged in, going to Home...');
                navigation.navigate('Home');
                setUsername('');
                setPassword('');
                setErrorMsg('');
            }
        } catch (error) {
            console.log('While logging in:', error.message);
            setErrorMsg(error.message);
        }
        
        setLoginLoading(false);
    };

    const handleGoogleLogin = async () => {
        setGoogleLoginLoading(true);
        setUsernameErrorMsg('');
        setPasswordErrorMsg('');
        
        try {
            const { type, user } = await Google.logInAsync({ 
                androidClientId: GOOGLE_ANDROID_CLIENT_ID, 
                iosClientId: GOOGLE_IOS_CLIENT_ID, 
                scopes: ['profile', 'email'], 
            });
            console.log(type, user)
            if (type === 'success') {
                const { email, familyName, givenName, photoUrl } = user;
    
                const result = await dispatch(googleLogin({ 
                    username: familyName + givenName,
                    email,
                    photoUrl, 
                }));
                const unwrapedResult = unwrapResult(result);

                if (unwrapedResult) {
                    console.log('Logged in, going to Home...');
                    navigation.navigate('Home');
                    setUsername('');
                    setPassword('');
                    setErrorMsg('');
                }
            }
        } catch (error) {
            console.log('While google logging in:', error.message);
            setErrorMsg(error.message);
        }

        setGoogleLoginLoading(false);
    };

    return (
        <View style={styles.root}>
            <Image 
                source={require('../../../assets/rsz_black-cat-icon-6.png')} 
                style={styles.img}
            />
            <HelperText type='error'>
                {errorMsg}
            </HelperText>
            <TextInput 
                mode='outlined'
                placeholder='Username'
                placeholderTextColor='gray'
                outlineColor='black'
                underlineColor='black'
                error={usernameErrorMsg}
                disabled={loginLoading || googleLoginLoading}
                value={username}
                style={styles.input}
                onChangeText={(text) => checkUsername(text)}
            />
            <HelperText type='error'>
                {usernameErrorMsg}
            </HelperText>
            <TextInput 
                mode='outlined'
                placeholder='Password'
                placeholderTextColor='gray'
                outlineColor='black'
                underlineColor='black'
                error={passwordErrorMsg}
                disabled={loginLoading || googleLoginLoading}
                secureTextEntry
                value={password}
                style={styles.input}
                onChangeText={(text) => checkPassword(text)}
            />
            <HelperText type='error'>
                {passwordErrorMsg}
            </HelperText>
            <Button 
                mode='contained'
                disabled={loginLoading || googleLoginLoading}
                loading={loginLoading}
                style={styles.loginbtn}
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
                style={styles.googleloginbtn}
                contentStyle={{ width: '100%', height: '100%', }}
                onPress={handleGoogleLogin}
            >
                Google Login
            </Button> */}
            <Divider style={styles.divider} />
            <View style={styles.signupmsg}>
                <Text>
                    Don't have an account?
                </Text>
                <Pressable 
                    style={styles.signupbtn}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={{ color: 'dodgerblue' }}>
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

export default Login;