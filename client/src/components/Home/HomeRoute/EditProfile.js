import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import { updateProfile } from '../../../redux/userReducer';
import { unwrapResult } from '@reduxjs/toolkit';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 40,
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
    submitbtn: {
        width: '60%',
        height: 50,
        backgroundColor: 'dodgerblue',
        marginTop: 50,
        elevation: 5,
    },
});

const EditProfile = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [photoUrl, setPhotoUrl] = useState('1');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    
    const [errorMsg, setErrorMsg] = useState('');
    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');
    const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    const [emailErrorMsg, setEmailErrorMsg] = useState('');

    const dispatch = useDispatch();

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

    const handleSubmit = async () => {
        if (!photoUrl
            || !username
            || !email
            || photoUrlErrorMsg
            || usernameErrorMsg
            || emailErrorMsg) {
            if (!photoUrl) setPhotoUrlErrorMsg('Must not be null!');
            if (!username) setUsernameErrorMsg('Must not be null!');
            if (!email) setEmailErrorMsg('Must not be null!');
            return;
        }

        setIsLoading(true);

        try {
            console.log('updating');
            const curPhotoUrl = await JSON.parse(await AsyncStorage.getItem('userInfo')).result.photoUrl;
            const curUsername = JSON.parse(await AsyncStorage.getItem('userInfo')).result.username;
            const result = await dispatch(updateProfile({ 
                photoUrl: curPhotoUrl, 
                username: curUsername, 
                newUsername: username, 
                email, 
            }));
            unwrapResult(result);
            if (result) {
                Alert.alert('Success!!', 'Profile Successfully Updated!!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }

            setPhotoUrl('');
            setUsername('');
            setEmail('');
        } catch (error) {
            console.log('Updating:', error?.message);
            setErrorMsg(error?.message);
        }

        setIsLoading(false);
    };
    
    return (
        <View style={styles.root}>
            <Text style={styles.title}>
                Change Password
            </Text>
            <HelperText
                type='error'
                style={{ 
                    fontSize: 20, 
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
                onChangeText={text => checkUsername(text)}
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
            >
                {usernameErrorMsg}
            </HelperText>
            <TextInput
                mode='outlined'
                placeholder='Email'
                placeholderTextColor='gray'
                error={emailErrorMsg}
                disabled={isLoading}
                value={email}
                style={styles.input}
                onChangeText={text => checkEmail(text)}
            />
            <HelperText 
                type='error' 
                style={styles.helpertext}
            >
                {emailErrorMsg}
            </HelperText>
            <Button
                mode='contained'
                disabled={isLoading}
                loading={isLoading}
                style={styles.submitbtn}
                contentStyle={{ width: '100%', height: '100%' }}
                onPress={handleSubmit}
            >
                Submit
            </Button>
        </View>
    );
};

export default EditProfile;