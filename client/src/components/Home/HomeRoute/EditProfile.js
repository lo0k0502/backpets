import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Avatar, Button, HelperText, IconButton, TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync, MediaTypeOptions, getPendingResultAsync, getMediaLibraryPermissionsAsync } from 'expo-image-picker';

import { updateProfile } from '../../../redux/userReducer';
import { deleteAvatar, uploadAvatar } from '../../../api';
import { unwrapResult } from '@reduxjs/toolkit';
import { BASE_URL } from '@env';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom: 100,
    },
    title: {
        fontSize: 40,
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
        marginTop: 20,
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
    };

    useFocusEffect(useCallback(() => {
        fetch();
    }, []));

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

        let validAddress = /^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.[A-z]+$/;
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
        const { result, refreshToken } = JSON.parse(await AsyncStorage.getItem('userInfo'));

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
                    default: {
                        setIsLoading(false);
                        setPhotoUrlErrorMsg('Selected file is not an image');
                        return;
                    }
                }
                formData.append('avatar', {
                    uri: photoUrl,
                    name: filename,
                    type,
                });
    
                const { data } = await uploadAvatar(formData);
                if (data) {
                    sendPhotoUrl = data.imgUrl;
                    if (result.photoUrl.split('/')[2] === `http://${BASE_URL}:8000`)
                        await deleteAvatar(result.photoUrl.split('/').pop());
                }
            }

            await dispatch(updateProfile({ 
                photoUrl: sendPhotoUrl,
                username: result.username, 
                newUsername: username, 
                email, 
                refreshToken,
            }));
            Alert.alert('Success!!', `Profile Successfully Updated!!\nGoing back...`, [
                { text: 'OK', onPress: () => navigation.goBack() }
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
                selectionColor='#666'
                theme={{ colors: { primary: 'dodgerblue' } }}
                onChangeText={checkUsername}
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
                selectionColor='#666'
                theme={{ colors: { primary: 'dodgerblue' } }}
                onChangeText={checkEmail}
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