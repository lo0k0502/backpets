import React, { useState } from 'react';
import { TextInput as NativeTextInput, StyleSheet } from 'react-native';
import { getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync, launchImageLibraryAsync, MediaTypeOptions, getPendingResultAsync } from 'expo-image-picker';
import { TextInput, Dialog, Button, Card, HelperText } from 'react-native-paper';
import { AddPost, uploadImage } from '../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';

const styles = StyleSheet.create({
    innerPropNav: {
        paddingTop: 8,
        paddingBottom: 8,
        height: 200,
    },
    imageButton: { 
        height: 40, 
        // alignSelf: 'center', 
        marginVertical: 10, 
    },
    photoCard: { 
        width: 300, 
        height: 200, 
        alignSelf: 'center',
    },
});

export default ({ visible, close, refresh }) => {
    const user = useSelector(selectUser);
    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons. 

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    const [titleErrorMsg, setTitleErrorMsg] = useState('');
    const [contentErrorMsg, setContentErrorMsg] = useState('');
    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');

    // Close the dailog with configuration
    const handleClose = () => {
        refresh();
        close();
        setTitle('');
        setContent('');
        setPhotoUrl('');
    };

    const checkTitle = (text) => {
        setTitle(text);
        setTitleErrorMsg(text ? '' : 'Must not be null!!');
    };

    const checkContent = (text) => {
        setContent(text);
        setContentErrorMsg(text ? '' : 'Must not be null!!');
    };

    // Change image
    const handleChangeImg = async () => {
        setIsImgLoading(true);

        // Check if user has granted us to access their media library. If no, ask once.
        const currentPermission = await getMediaLibraryPermissionsAsync();
        if (!currentPermission.granted) {
            let permissionResult = await requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission denied!', 'We need your media library permission to add an image to this post!', [{ text: 'Got it!' }]);
                setIsImgLoading(false);
                return;
            }
        }

        // Launch image picker
        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [ 3, 2 ],
            quality: 1,
        });

        // Check if data gets lost, if so, use getPendingResultAsync function.
        if (!result) result = await getPendingResultAsync();
        if (!result) return setIsImgLoading(false);

        // If the final result is not cancelled, change the current photo url to the result photo's local url.
        if (!result.cancelled) setPhotoUrl(result.uri);


        setIsImgLoading(false);
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            if (!title) setTitleErrorMsg('Must not be null!');
            if (!content) setContentErrorMsg('Must not be null!');
            return;
        }
        
        // Start posting
        setIsLoading(true);
        
        try {
            let sendPhotoUrl = photoUrl;

            // Check if the photo is added, if so, upload it to the database first.
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
                formData.append('image', {
                    uri: photoUrl,
                    name: filename,
                    type,
                });
                
                const { data: { imgUrl } } = await uploadImage(formData);
                sendPhotoUrl = imgUrl;
            }

            // Add the post
            await AddPost({
                userId: user.info?._id.toString(),
                title,
                content,
                photoUrl: sendPhotoUrl,
            });

            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.message) {
                console.log('while uploading photo:', error.response.data.message)
                setPhotoUrlErrorMsg(error.response.data.message);
            }
        }

        setIsLoading(false);
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
                    selectionColor='#666'
                    render={(innerProps) => (
                        <NativeTextInput
                            {...innerProps}
                            style={[
                            innerProps.style,
                            innerProps.multiline
                                ? styles.innerPropNav
                                : null,
                            ]}
                        />
                    )}
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
                    style={ styles.imageButton }
                    onPress={handleChangeImg}
                >
                    {photoUrl ? 'Change Image' : 'Add Image'}
                </Button>
                <HelperText 
                    type='error' 
                >
                    {photoUrlErrorMsg}
                </HelperText>
                {photoUrl ? <Card.Cover source={{ uri: photoUrl }} style={ styles.photoCard } /> : null}
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