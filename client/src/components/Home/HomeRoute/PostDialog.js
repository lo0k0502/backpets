import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { TextInput, Dialog, Button, Card, HelperText } from 'react-native-paper';
import { AddPost, uploadAvatar } from '../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';

export default ({ visible, close, refresh }) => {
    const user = useSelector(selectUser);
    const [isLoading, setIsLoading] = useState(false);
    const [isImgLoading, setIsImgLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    const [titleErrorMsg, setTitleErrorMsg] = useState('');
    const [contentErrorMsg, setContentErrorMsg] = useState('');
    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');

    const checkTitle = (text) => {
        setTitle(text);
        setTitleErrorMsg(text ? '' : 'Must not be null!!');
    };

    const checkContent = (text) => {
        setContent(text);
        setContentErrorMsg(text ? '' : 'Must not be null!!');
    };

    const handleChangeImg = async () => {
        setIsImgLoading(true);
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.canAskAgain) permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [ 3, 2 ],
            quality: 1,
        });
        if (!result) result = await ImagePicker.getPendingResultAsync();
        if (!result) return;

        if (!result.cancelled) {
            setPhotoUrl(result.uri);
        }

        setIsImgLoading(false);
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            if (!title) setTitleErrorMsg('Must not be null!');
            if (!content) setContentErrorMsg('Must not be null!');
            return;
        }
        
        setIsLoading(true);
        
        try {
            let sendPhotoUrl = photoUrl;
            if (photoUrl) {
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
                        return;
                    }
                }
                formData.append('avatar', {
                    uri: photoUrl,
                    name: filename,
                    type,
                });
                
                const { data: { imgUrl } } = await uploadAvatar(formData);
                sendPhotoUrl = imgUrl;
            }

            await AddPost({
                userId: user.userInfo._id.toString(),
                title,
                content,
                photoUrl: sendPhotoUrl,
            });

            handleClose();
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.message) {
                console.log('while uploading photo:', error.response.data.message)
                setPhotoUrlErrorMsg(error.response.data.message);
            }
        }

        setIsLoading(false);
    };

    const handleClose = () => {
        refresh();
        close();
        setTitle('');
        setContent('');
        setPhotoUrl('');
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>Post</Dialog.Title>
            <Dialog.Content>
                <TextInput 
                    mode='outlined'
                    placeholder='Title'
                    placeholderTextColor='gray'
                    error={titleErrorMsg}
                    value={title}
                    selectionColor='#666'
                    theme={{ colors: { primary: '#ff8000' } }}
                    onChangeText={checkTitle}
                />
                <HelperText 
                    type='error' 
                >
                    {titleErrorMsg}
                </HelperText>
                <TextInput 
                    mode='outlined'
                    placeholder='Content'
                    placeholderTextColor='gray'
                    error={contentErrorMsg}
                    value={content}
                    multiline
                    numberOfLines={9}
                    selectionColor='#666'
                    theme={{ colors: { primary: '#ff8000' } }}
                    onChangeText={checkContent}
                />
                <HelperText 
                    type='error' 
                >
                    {contentErrorMsg}
                </HelperText>
                <Button 
                    mode='contained'
                    icon='plus'
                    color='#ff8000'
                    dark
                    disabled={isImgLoading || isLoading}
                    loading={isImgLoading}
                    contentStyle={{ width: '100%', height: '100%' }}
                    style={{ 
                        width: 150,
                        height: 40, 
                        alignSelf: 'center', 
                        marginVertical: 10, 
                    }}
                    onPress={handleChangeImg}
                >
                    Add Image
                </Button>
                <HelperText 
                    type='error' 
                >
                    {photoUrlErrorMsg}
                </HelperText>
                {photoUrl ? <Card.Cover source={{ uri: photoUrl }} style={{ width: 300, height: 200, alignSelf: 'center' }} /> : null}
            </Dialog.Content>
            <Dialog.Actions>
                <Button 
                    color='#ff8000' 
                    disabled={isLoading}
                    onPress={handleClose}
                >
                    Cancel
                </Button>
                <Button 
                    mode='contained' 
                    color='#ff8000'
                    dark
                    disabled={isLoading}
                    loading={isLoading}
                    onPress={handleSubmit}
                >
                    Post
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};