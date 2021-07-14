import React, { useState } from 'react';
import { View, StyleSheet, Image, Pressable, Text } from 'react-native';
import { TextInput, Button, Divider, HelperText } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { loginUser } from '../../redux/userReducer';
import { UserLogin } from '../../api';


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

    const[isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

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
            const result = await dispatch(loginUser({ username, password }));
            unwrapResult(result);
            navigation.navigate('Home');
            setIsLoading(false);
            setUsername('');
            setPassword('');
        } catch (error) {
            setIsLoading(false);
            setErrorMsg(error.message);
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
                style={styles.loginbtn}
                contentStyle={{ width: '100%', height: '100%', }}
                onPress={handleLogin}
            >
                Login
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