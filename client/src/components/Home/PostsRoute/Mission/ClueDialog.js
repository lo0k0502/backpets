import { getMediaLibraryPermissionsAsync, getPendingResultAsync, launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, TextInput as NativeTextInput, View } from 'react-native';
import MapView from 'react-native-maps';
import { Button, Card, Dialog, Divider, HelperText, Text, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { addClue, uploadImage } from '../../../../api';
import { useCurrentLocation } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';

export default ({ visible, close, missionId }) => {
    const user = useSelector(selectUser);
    const { currentLatitude, currentLongitude } = useCurrentLocation();
    
    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons. 

    const [content, setContent] = useState('');
    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
    });
    const [changingLocation, setChangingLocation] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('');

    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');
    const [contentErrorMsg, setContentErrorMsg] = useState('');

    useEffect(() => {
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });
    }, [currentLatitude, currentLongitude]);

    // Close the dailog with configuration
    const handleClose = () => {
        close();

        setContent('');
    };

    const checkContent = (text) => {
        setContent(text);
        setContentErrorMsg(text ? '' : '不可為空!!');
    };

    // Change image
    const handleChangeImg = async () => {
        setIsImgLoading(true);

        // Check if user has granted us to access their media library. If no, ask once.
        if (!(await getMediaLibraryPermissionsAsync()).granted) {
            if (!(await requestMediaLibraryPermissionsAsync()).granted) {
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
        if (!result.cancelled) setPhotoUrl(result.uri);


        setIsImgLoading(false);
    };

    const handleSubmit = async () => {        
        // Start posting
        setIsLoading(true);
        
        try {
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

            // Add the clue
            await addClue({
                userId: user.info._id.toString(),
                missionId,
                content,
                photoId: data.photoId,
                location: {
                    latitude: mapViewRegion.latitude, 
                    longitude: mapViewRegion.longitude, 
                },
            });

            setIsLoading(false);

            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.message) {
                console.log('while uploading photo:', error.response.data.message)
                setPhotoUrlErrorMsg(error.response.data.message);
            }
        }
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>回報線索</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', padding: 20 }}>
                    <TextInput
                        mode='outlined'
                        label='說明(必要)'
                        error={contentErrorMsg}
                        disabled={isImgLoading || isLoading}
                        value={content}
                        multiline
                        maxLength={50}
                        right={<TextInput.Affix text={`${content.length}/50`} />}
                        render={(innerProps) => (
                            <NativeTextInput
                                {...innerProps}
                                style={[
                                    innerProps.style,
                                    innerProps.multiline ? {
                                        paddingTop: 8,
                                        paddingBottom: 8,
                                        height: 200,
                                    } : null,
                                ]}
                            />
                        )}
                        onChangeText={checkContent}
                    />
                    <HelperText type='error'>
                        {contentErrorMsg}
                    </HelperText>
                    <Divider />
                    <HelperText type='info'>
                        位置(必要)
                    </HelperText>
                    <View style={[ { width: '100%', height: 200 }, !changingLocation && { opacity: 0.7 } ]}>
                        <Image
                            source={require('../../../../../assets/icons8-marker-48.png')}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: 36,
                                height: 45,
                                zIndex: 100,
                                transform: [
                                    { translateX: -18 },
                                    { translateY: -45 },
                                ],
                            }}
                            width={10}
                            height={10}
                        />
                        <MapView
                            style={{ flex: 1 }}
                            showsUserLocation={!(isImgLoading || isLoading) && changingLocation}
                            scrollEnabled={!(isImgLoading || isLoading) && changingLocation}
                            region={mapViewRegion}
                            onRegionChangeComplete={setMapViewRegion}
                        />
                    </View>
                    <Button
                        mode='contained'
                        dark
                        style={{ marginVertical: 10, elevation: 0 }}
                        onPress={() => setChangingLocation(state => !state)}
                    >
                        {changingLocation ? '確定位置' : '更改位置'}
                    </Button>
                    <Text>{'緯度: ' + mapViewRegion.latitude.toString()}</Text>
                    <Text>{'經度: ' + mapViewRegion.longitude.toString()}</Text>
                    <Divider />
                    <Button 
                        mode='contained'
                        icon='plus'
                        dark
                        disabled={isImgLoading || isLoading}
                        loading={isImgLoading}
                        style={{ marginVertical: 10, elevation: 0 }}
                        onPress={handleChangeImg}
                    >
                        {photoUrl ? '更改圖片' : '新增圖片(必要)'}
                    </Button>
                    <HelperText type='error'>
                        {photoUrlErrorMsg}
                    </HelperText>
                    {photoUrl ? (
                        <Card.Cover
                            source={{ uri: photoUrl }}
                            style={{ 
                                width: 300,
                                height: 200,
                                alignSelf: 'center',
                            }}
                        />
                    ) : null}
                    <View style={{ height: 50 }} />
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button
                    disabled={isImgLoading || isLoading}
                    onPress={handleClose}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    取消
                </Button>
                <Button
                    mode='contained'
                    dark
                    disabled={
                        isImgLoading
                        || isLoading
                        || !content
                        || !photoUrl
                    }
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