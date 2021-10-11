import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Avatar, Button, HelperText, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { 
    requestMediaLibraryPermissionsAsync, 
    launchImageLibraryAsync, 
    MediaTypeOptions, 
    getPendingResultAsync, 
    getMediaLibraryPermissionsAsync 
} from 'expo-image-picker';

import { updateProfile } from '../../../redux/userReducer';
import { deleteImage, uploadImage } from '../../../api';
import { unwrapResult } from '@reduxjs/toolkit';
import { selectUser } from '../../../redux/userSlice';

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
        backgroundColor: '#ff8000',
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
        backgroundColor: '#ff8000',
        marginTop: 20,
        elevation: 5,
    },
});

export default ({ navigation }) => {
    const user = useSelector(selectUser);

    const [isLoading, setIsLoading] = useState(false);// Whether it is during editing profile, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons.

    const [photoUrl, setPhotoUrl] = useState(user.info?.photoUrl);
    const [username, setUsername] = useState(user.info?.username);
    const [email, setEmail] = useState(user.info?.email);
    
    const [errorMsg, setErrorMsg] = useState('');
    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');
    const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    const [emailErrorMsg, setEmailErrorMsg] = useState('');

    const dispatch = useDispatch();

    // Change image
    const handleChangeImg = async () => {
        setIsImgLoading(true);

        // Check if user has granted us to access their media library. If no, ask once.
        const currentPermission = await getMediaLibraryPermissionsAsync();
        if (!currentPermission.granted) {
            let permissionResult = await requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission denied!', 'We need your media library permission to change avatar!', [{ text: 'Got it!' }]);
                setIsImgLoading(false);
                return;
            }
        }

        // Launch image picker
        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [ 1, 1 ],
            quality: 1,
        });

        // Check if data gets lost, if so, use getPendingResultAsync function.
        if (!result) result = await getPendingResultAsync();
        if (!result) return setIsImgLoading(false);

        // If the final result is not cancelled, change the current photo url to the result photo's local url.
        if (!result.cancelled) setPhotoUrl(result.uri);

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

        // Start editing profile
        setIsLoading(true);

        const previousProfile = user;
        try {
            let sendPhotoUrl = photoUrl;

            // Check if the photo is changed, if so, upload it to the database first.
            if (photoUrl !== previousProfile.info?.photoUrl) {
                let formData = new FormData();
                const filename = photoUrl.split('/').pop();
                let mediatype = filename.split('.').pop();
                switch (mediatype) {
                    case 'jpg': 
                        mediatype = 'image/jpeg';
                        break;
                    case 'jpeg': 
                        mediatype = 'image/jpeg';
                        break;
                    case 'png': 
                        mediatype = 'image/png';
                        break;
                    default: {
                        setIsLoading(false);
                        setPhotoUrlErrorMsg('Selected file is not an image');
                        return;
                    }
                }
                formData.append('image', {
                    uri: photoUrl,
                    name: filename,
                    type: mediatype,
                });
    
                const { data } = await uploadImage(formData);
                if (data) {
                    sendPhotoUrl = data.imgUrl;

                    // If the previous avatar is in our database and it's not the default avatar, delete it.
                    if (previousProfile.info?.photoUrl !== 'http://172.16.88.94:8000/image/1633975665652-black-cat-icon-6.png' 
                        && /^http:\/\/\d+\.\d+\.\d+\.\d+:8000$/.test(previousProfile.info?.photoUrl.split('/')[2])) {
                        await deleteImage(previousProfile.info?.photoUrl.split('/').pop());
                    }
                }
            }

            // Update profile
            unwrapResult(await dispatch(updateProfile({ 
                userId: previousProfile.info?._id,
                photoUrl: sendPhotoUrl,
                newUsername: username, 
                email,
            })));
            setErrorMsg('');
            setPhotoUrlErrorMsg('');
            setUsernameErrorMsg('');
            setEmailErrorMsg('');
            setIsLoading(false);
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
                color='#ff8000'
                dark
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
                theme={{ colors: { primary: '#ff8000' } }}
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
                theme={{ colors: { primary: '#ff8000' } }}
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