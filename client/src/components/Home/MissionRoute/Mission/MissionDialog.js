import React, { useState } from 'react';
import { TextInput as NativeTextInput, StyleSheet } from 'react-native';
import { getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync, launchImageLibraryAsync, MediaTypeOptions, getPendingResultAsync } from 'expo-image-picker';
import { TextInput, Dialog, Button, Card, HelperText, useTheme } from 'react-native-paper';
import { addMission, uploadImage } from '../../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { useCurrentLocation } from '../../../../hooks';
import { ScrollView } from 'react-native';

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

export default ({ visible, close, refreshMissions }) => {
    const user = useSelector(selectUser);
    const { colors } = useTheme();

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons. 

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [photoUrl, setphotoUrl] = useState('');

    const [titleErrorMsg, setTitleErrorMsg] = useState('');
    const [contentErrorMsg, setContentErrorMsg] = useState('');
    const [photoUrlErrorMsg, setphotoUrlErrorMsg] = useState('');

    const { currentLatitude, currentLongitude } = useCurrentLocation();

    // Close the dailog with configuration
    const handleClose = () => {
        refreshMissions();
        close();
        setTitle('');
        setContent('');
        setphotoUrl('');
        setTitleErrorMsg('');
        setContentErrorMsg('');
        setphotoUrlErrorMsg('');
    };

    const checkTitle = (text) => {
        setTitle(text);
        setTitleErrorMsg(text ? '' : '不可為空!!');
    };

    const checkContent = (text) => {
        setContent(text);
        setContentErrorMsg(text ? '' : '不可為空!!');
    };

    // Change image
    const handleChangeImg = async () => {
        setIsImgLoading(true);

        // Check if user has granted us to access their media library. If no, ask once.
        const currentPermission = await getMediaLibraryPermissionsAsync();
        if (!currentPermission.granted) {
            let permissionResult = await requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('權限不足!', '我們需要您的許可來存取您的媒體庫!', [{ text: '知道了' }]);
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
        if (!result.cancelled) setphotoUrl(result.uri);


        setIsImgLoading(false);
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            if (!title) setTitleErrorMsg('不可為空!');
            if (!content) setContentErrorMsg('不可為空!');
            return;
        }
        
        // Start posting
        setIsLoading(true);
        
        try {
            let sendPhotoId;

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
                
                const { data } = await uploadImage(formData);
                sendPhotoId = data.photoId;
            }

            // Add the post
            await addMission({
                userId: user.info?._id.toString(),
                title,
                content,
                photoId: sendPhotoId,
                location: { 
                    latitude: currentLatitude, 
                    longitude: currentLongitude, 
                },
            });

            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.message) {
                console.log('while uploading photo:', error.response.data.message)
                setphotoUrlErrorMsg(error.response.data.message);
            }
        }

        setIsLoading(false);
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>發佈任務</Dialog.Title>
            <Dialog.Content style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', paddingHorizontal: 20 }}>
                    <TextInput 
                        mode='outlined'
                        placeholder='標題'
                        placeholderTextColor='gray'
                        error={titleErrorMsg}
                        value={title}
                        onChangeText={checkTitle}
                    />
                    <HelperText
                        type='error'
                    >
                        {titleErrorMsg}
                    </HelperText>
                    <TextInput
                        mode='outlined'
                        placeholder='內文'
                        placeholderTextColor='gray'
                        error={contentErrorMsg}
                        value={content}
                        multiline
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
                        color={colors.primary}
                        dark
                        disabled={isImgLoading || isLoading}
                        loading={isImgLoading}
                        contentStyle={{ width: '100%', height: '100%' }}
                        style={ styles.imageButton }
                        onPress={handleChangeImg}
                    >
                        {photoUrl ? '更改圖片' : '新增圖片'}
                    </Button>
                    <HelperText 
                        type='error' 
                    >
                        {photoUrlErrorMsg}
                    </HelperText>
                    {photoUrl ? <Card.Cover source={{ uri: photoUrl }} style={ styles.photoCard } /> : null}
                </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
                <Button 
                    color={colors.primary} 
                    disabled={isLoading}
                    onPress={handleClose}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    取消
                </Button>
                <Button 
                    mode='contained' 
                    color={colors.primary}
                    dark
                    disabled={isLoading}
                    loading={isLoading}
                    onPress={handleSubmit}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    發佈
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};