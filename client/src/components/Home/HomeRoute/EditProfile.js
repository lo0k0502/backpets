import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Avatar, Button, HelperText, IconButton, TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync, MediaTypeOptions, getPendingResultAsync, getMediaLibraryPermissionsAsync } from 'expo-image-picker';

import { tokenRefresh, updateProfile } from '../../../redux/userReducer';
import { deleteAvatar, uploadAvatar } from '../../../api';
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
    imgchangebtn: { 
        width: 100, 
        height: 40, 
        backgroundColor: 'dodgerblue',
        margin: 10, 
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
    const [isImgLoading, setIsImgLoading] = useState(false);

    const [photoUrl, setPhotoUrl] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    
    const [errorMsg, setErrorMsg] = useState('');
    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');
    const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    const [emailErrorMsg, setEmailErrorMsg] = useState('');

    const dispatch = useDispatch();

    const fetch = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('userInfo'));
        setUsername(user.result.username);
        setEmail(user.result.email);
        setPhotoUrl(user.result.photoUrl);
        
        await dispatch(tokenRefresh({ 
            accessToken: user.accessToken, 
            refreshToken: user.refreshToken, 
        }));
    };

    useFocusEffect(useCallback(() => {
        fetch();
    }, [navigation]));

    const handleChangeImg = async () => {
        setIsImgLoading(true);
        let permissionResult = await requestMediaLibraryPermissionsAsync();
        if (permissionResult.canAskAgain) permissionResult = await requestMediaLibraryPermissionsAsync();
        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [ 1, 1 ],
            quality: 1,
        });
        if (!result) result = getPendingResultAsync();

        if (!result.cancelled) {
            setPhotoUrl(result.uri);
        }

        setIsImgLoading(false);
    };

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
        if (!username
            || !email
            || usernameErrorMsg
            || photoUrlErrorMsg
            || emailErrorMsg) {
            if (!username) setUsernameErrorMsg('Must not be null!');
            if (!email) setEmailErrorMsg('Must not be null!');
            return;
        }
        const { result } = JSON.parse(await AsyncStorage.getItem('userInfo'));
        if (username === result.username && email === result.email && photoUrl === result.photoUrl) {
            setErrorMsg('Please change at least one profile!!');
            return;
        }

        setIsLoading(true);

        try {
            let sendPhotoUrl = photoUrl;
            if (photoUrl !== result.photoUrl) {
                let formData = new FormData();
                const filename = photoUrl.split('/').pop();
                const mediatype = filename.split('.').pop();
                let type = null;
                switch (mediatype) {
                    case 'jpg': 
                        type = 'image/jpeg';
                        break;
                    case 'jpeg': 
                        type = 'image/jpeg';
                        break;
                    case 'png': 
                        type = 'image/jpeg';
                        break;
                    default:
                        setIsLoading(false);
                        setPhotoUrlErrorMsg('Selected file is not an image');
                        return;
                }
                formData.append('avatar', {
                    uri: photoUrl,
                    name: filename,
                    type,
                });
    
                const { data } = await uploadAvatar(formData);
                if (data) {
                    sendPhotoUrl = data.imgUrl;
                    if (result.photoUrl.split('/')[2] === '192.168.1.103:5001')
                        await deleteAvatar(result.photoUrl.split('/').pop());
                }
            }

            const res = await dispatch(updateProfile({ 
                photoUrl: sendPhotoUrl,
                username: result.username, 
                newUsername: username, 
                email, 
            }));
            unwrapResult(res);
            Alert.alert('Success!!', `Profile Successfully Updated!!\nGoing back...`, [
                { text: 'OK', onPress: () => navigation.pop(1) }
            ]);
        } catch (error) {
            setIsLoading(false);
            if (error.message) {
                console.log('Updating:', error.message);
                setErrorMsg(error.message);
            }
            if (error.response.data.message) {
                console.log('while uploading photo:', error.response.data.message)
                setPhotoUrlErrorMsg(error.response.data.message);
            }
        }

        setIsLoading(false);
    };
    
    return (
        <View style={styles.root}>
            <Text style={styles.title}>
                Edit Profile
            </Text>
            <HelperText
                type='error'
                style={{ 
                    fontSize: 20, 
                }}
            >
                {errorMsg}
            </HelperText>
            {photoUrl ? <Avatar.Image source={{ uri: photoUrl }} size={100} style={{ backgroundColor: 'white' }} /> : null}
            <HelperText 
                type='error' 
                style={styles.helpertext}
            >
                {photoUrlErrorMsg}
            </HelperText>
            <Button 
                mode='contained'
                disabled={isImgLoading || isLoading}
                loading={isImgLoading}
                uppercase={false}
                color='dodgerblue'
                style={styles.imgchangebtn}
                contentStyle={{ width: '100%', height: '100%' }}
                onPress={handleChangeImg}
            >
                Change
            </Button>
            <TextInput
                mode='outlined'
                placeholder='Username'
                placeholderTextColor='gray'
                error={usernameErrorMsg}
                disabled={isImgLoading || isLoading}
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
                disabled={isImgLoading || isLoading}
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
                disabled={isImgLoading || isLoading}
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