import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Avatar, Button, HelperText, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { 
    requestMediaLibraryPermissionsAsync, 
    launchImageLibraryAsync, 
    MediaTypeOptions, 
    getPendingResultAsync, 
    getMediaLibraryPermissionsAsync 
} from 'expo-image-picker';

import { updateProfile } from '../../../../redux/userReducer';
import { deleteImage, uploadImage } from '../../../../api';
import { unwrapResult } from '@reduxjs/toolkit';
import { selectUser } from '../../../../redux/userSlice';
import { SERVERURL } from '../../../../api/API';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 40,
        marginBottom: 50,
    },
    imgchangebtn: {
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

    const [photoUrl, setphotoUrl] = useState('');
    const [username, setUsername] = useState(user.info?.username);
    const [email, setEmail] = useState(user.info?.email);
    
    const [errorMsg, setErrorMsg] = useState('');
    const [photoUrlErrorMsg, setphotoUrlErrorMsg] = useState('');
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
                Alert.alert('權限不足!', '我們需要您的許可來存取您的媒體庫!', [{ text: '知道了!' }]);
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
        if (!result.cancelled) setphotoUrl(result.uri);

        setIsImgLoading(false);
    };

    const checkUsername = (text) => {
        setUsername(text);
        setUsernameErrorMsg(text ? '' : '不可為空!');
    };

    const checkEmail = (text) => {
        setEmail(text);
        setEmailErrorMsg(text ? '' : '不可為空!');
        if (!text) return;

        let validAddress = /^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.[A-z]+$/;
        setEmailErrorMsg(validAddress.test(text) ? '' : '無效的電子郵件!');
    };

    const handleSubmit = async () => {
        if (!username
            || !email
            || usernameErrorMsg
            || photoUrlErrorMsg
            || emailErrorMsg) {
            if (!username) setUsernameErrorMsg('不可為空!');
            if (!email) setEmailErrorMsg('不可為空!');
            return;
        }

        // Start editing profile
        setIsLoading(true);

        const previousProfile = user;
        try {
            let sendPhotoId;

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
                        setphotoUrlErrorMsg('選取的檔案並非圖檔!');
                        return;
                    }
                }
                formData.append('image', {
                    uri: photoUrl,
                    name: filename,
                    type: mediatype,
                });
    
                const { data } = await uploadImage(formData);
                
                sendPhotoId = data.photoId;

                // If the previous avatar is in our database and it's not the default avatar, delete it.
                if (previousProfile.info?.photoId !== '61a2dbeb3a662969fc731434') {
                    await deleteImage(previousProfile.info?.photoId);
                }
            }

            if (!sendPhotoId) throw new Error('SendPhotoId is Null!!');

            // Update profile
            unwrapResult(await dispatch(updateProfile({
                userId: previousProfile.info?._id,
                photoId: sendPhotoId,
                newUsername: username,
                email,
            })));
            setErrorMsg('');
            setphotoUrlErrorMsg('');
            setUsernameErrorMsg('');
            setEmailErrorMsg('');
            setIsLoading(false);
            Alert.alert('修改成功!!', `回到上一頁...`, [
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
                setphotoUrlErrorMsg(error.response.data.message);
            }
        }

        setIsLoading(false);
    };
    
    return (
        <View style={styles.root}>
            <HelperText
                type='error'
                style={{ 
                    fontSize: 20, 
                }}
            >
                {errorMsg}
            </HelperText>
            <Avatar.Image source={{ uri: photoUrl ? photoUrl : user.info?.photoId ? `${SERVERURL}/image/${user.info?.photoId}` : null }} size={100} style={{ backgroundColor: 'white' }} />
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
                onPress={handleChangeImg}
            >
                更改大頭照
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
                更改
            </Button>
        </View>
    );
};