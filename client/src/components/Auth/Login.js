import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable, Text, Alert } from 'react-native';
import { TextInput, Button, Divider, HelperText } from 'react-native-paper';
import * as Google from 'expo-google-app-auth';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { loginUser, googleLogin } from '../../redux/userReducer';

import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';
import { fetchUserByEmail, UserRegister } from '../../api';
import genPassword from '../../utils/randomPassword';
import { useEffect } from 'react';


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

const Login = ({ navigation, setIsLogin, isLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const[isLoading, setIsLoading] = useState(false);
    const[loginLoading, setLoginLoading] = useState(false);
    const[googleLoginLoading, setGoogleLoginLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isLogin) {
            navigation.navigate('Home');
        }
    }, []);

    const checkUsername = (text) => {
        setUsername(text);
        setUsernameErrorMsg(text ? '' : 'Must not be null!');
    };

    const checkPassword = (text) => {
        setPassword(text);
        setPasswordErrorMsg(text ? '' : 'Must not be null!');
    };

    const handleLogin = async () => {
        if (!username) return setUsernameErrorMsg('Must not be null!');
        if (!password) return setPasswordErrorMsg('Must not be null!');

        try {
            setIsLoading(true);
            setLoginLoading(true);

            const result = await dispatch(loginUser({ username, password }));
            unwrapResult(result);
            setIsLogin(true);
            navigation.push('Home');

            setIsLoading(false);
            setLoginLoading(false);
            setUsername('');
            setPassword('');
        } catch (error) {
            setIsLoading(false);
            setLoginLoading(false);
            setErrorMsg(error.message);
        }
    };

    const handleGoogleLogin = () => {
        const config = {
            androidClientId: GOOGLE_ANDROID_CLIENT_ID,
            iosClientId: GOOGLE_IOS_CLIENT_ID,
            scopes: ['profile', 'email'],
        };

        try {
            setIsLoading(true);
            setGoogleLoginLoading(true);

            Google
                .logInAsync(config)
                .then(async ({ type, user }) => {
                    if (type === 'success') {
                        const { email, familyName, givenName, photoUrl } = user;

                        const result = await dispatch(googleLogin({ 
                            username: familyName + givenName,
                            email,
                            photoUrl, 
                        }));
                        unwrapResult(result);
                        Alert.alert('Safety alert', 
                            'Your password is now set to 10 zeroes, we highly recommend you to change your password immediately!!', 
                            [{ text: 'Yes' }],
                        );

                        setIsLogin(true);
                        setIsLoading(false);
                        setGoogleLoginLoading(false);
                        navigation.push('Home');
                    }
                })
                .catch(error => console.log(error));
        } catch (error) {
            setIsLoading(false);
            setGoogleLoginLoading(false);
        }
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
                loading={loginLoading}
                style={styles.loginbtn}
                contentStyle={{ width: '100%', height: '100%', }}
                onPress={handleLogin}
            >
                Login
            </Button>
            <Button
                mode='contained'
                icon={require('../../../assets/GoogleIconG.png')}
                disabled={isLoading}
                loading={googleLoginLoading}
                style={styles.googleloginbtn}
                contentStyle={{ width: '100%', height: '100%', }}
                onPress={handleGoogleLogin}
            >
                Google Login
            </Button>
            <Divider style={styles.divider} />
            <View style={styles.signupmsg}>
                <Text>
                    Don't have an account?
                </Text>
                <Pressable 
                    style={styles.signupbtn}
                    onPress={() => navigation.push('Register')}
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