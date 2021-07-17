import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { UserRegister } from '../../api';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 50,
        marginTop: -50,
        marginBottom: 50,
    },
    input: {
        width: '60%',
        margin: 20,
    },
    helpertext: { 
        marginTop: -20, 
    },
    btn: {
        width: '60%',
        height: 50,
        marginTop: 50,
        elevation: 5,
    },
});

const Register = ({ navigation }) => {
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

        let validAddress = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
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
        if (!username || !email || !password) {
            if (!username) setUsernameErrorMsg('Must not be null!');
            if (!email) setEmailErrorMsg('Must not be null!');
            if (!password) setPasswordErrorMsg('Must not be null!');
            if (!confirmPassword) setConfirmPasswordErrorMsg('Must not be null!');
            return;
        }
        if (usernameErrorMsg || emailErrorMsg || passwordErrorMsg || confirmPasswordErrorMsg) return;

        try {
            setIsLoading(true);

            const result = await UserRegister({
                username,
                password,
                email,
                photoUrl: '',
            });
            if (result) navigation.goBack();
            
            setIsLoading(false);
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setIsLoading(false);
            setErrorMsg(error.response.data.message);
        }
    };

    return (
        <View style={styles.root}>
            <Text style={styles.title}>
                Register
            </Text>
            <HelperText
                type='error'
                style={{ 
                    fontSize: 16, 
                    marginBottom: -20,
                }}
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
                onChangeText={(text) => checkUsername(text)}
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
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
                style={styles.input} 
                onChangeText={(text) => checkEmail(text)}
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
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
                onChangeText={(text) => checkPassword(text)}
                right={
                    <TextInput.Icon 
                        name={passwordSecure ? 'eye-off' : 'eye'} 
                        onPress={() => setPasswordSecure(!passwordSecure)}
                    />
                }
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
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
                onChangeText={(text) => checkConfirmPassword(text)}
                right={
                    <TextInput.Icon 
                        name={confirmPasswordSecure ? 'eye-off' : 'eye'} 
                        onPress={() => setConfirmPasswordSecure(!confirmPasswordSecure)}
                    />
                }
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
            >
                {confirmPasswordErrorMsg}
            </HelperText>
            <Button 
                mode='contained'
                color='dodgerblue'
                loading={isLoading}
                style={styles.btn}
                contentStyle={{ width: '100%', height: '100%', }}
                onPress={handleSubmit}
            >
                Sign Up
            </Button>
        </View>
    );
};

export default Register;