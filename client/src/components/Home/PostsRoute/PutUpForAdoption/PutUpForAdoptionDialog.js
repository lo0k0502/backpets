import { getMediaLibraryPermissionsAsync, getPendingResultAsync, launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, View, TextInput as NativeTextInput, Alert } from 'react-native';
import MapView from 'react-native-maps';
import { Button, Card, Dialog, Divider, HelperText, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { addPutUpForAdoption, uploadImage } from '../../../../api';
import { useCurrentLocation } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import { animalTagsArray } from '../../../../utils/constants';
import TagsView from '../TagsView';

export default ({ visible, close, refreshPutUpForAdoptions }) => {
    const user = useSelector(selectUser);
    const { colors } = useTheme();
    const { currentLatitude, currentLongitude } = useCurrentLocation();

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons. 
    const [changingLocation, setChangingLocation] = useState(false);

    const [content, setContent] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [tags, setTags] = useState(animalTagsArray.map(tagName => ({ name: tagName, selected: false })));
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState('男');
    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
    });

    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');
    const [breedErrorMsg, setBreedErrorMsg] = useState('');

    useEffect(() => {
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });
    }, [currentLatitude, currentLongitude]);

    const handleClose = () => {
        close();

        setContent('');
        setPhotoUrl('');
        setTags(animalTagsArray.map(tagName => ({ name: tagName, selected: false })));
        setBreed('');
        setGender('');
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });

        setPhotoUrlErrorMsg('');
        setBreedErrorMsg('');
    };

    const checkBreed = (text) => {
        setBreed(text);
        setBreedErrorMsg(text ? '' : '不可為空!!');
    };

    const handleExceedMaxTagLimit = () => {
        const firstSelectedTagIndex = tags.findIndex(tag => tag.selected);

        setTags(tags => tags.map((tag, index) => {
            if (index === firstSelectedTagIndex) return { ...tag, selected: false };
            return tag;
        }));

        return false;
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
            aspect: [3, 2],
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

            // Add the put up for adoption
            await addPutUpForAdoption({
                userId: user.info._id.toString(),
                content,
                tag: tags.find(tag => tag.selected).name,
                breed,
                gender,
                photoId: data.photoId,
                location: {
                    latitude: mapViewRegion.latitude, 
                    longitude: mapViewRegion.longitude, 
                },
            });

            setIsLoading(false);

            refreshPutUpForAdoptions();
            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.message) {
                console.log('While adding:', error.response.data.message)
                setPhotoUrlErrorMsg(error.response.data.message);
            }
        }
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>發佈送養貼文</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', padding: 20 }}>
                    <TextInput
                        mode='outlined'
                        label='品種(必要)'
                        disabled={isImgLoading || isLoading}
                        error={breedErrorMsg}
                        value={breed}
                        maxLength={10}
                        right={<TextInput.Affix text={`${breed.length}/10`} />}
                        onChangeText={checkBreed}
                    />
                    <HelperText type='error'>
                        {breedErrorMsg}
                    </HelperText>
                    <HelperText type='info'>
                        性別(必要)
                    </HelperText>
                    <View style={{ flexDirection: 'column' }}>
                        <RadioButton.Group
                            value={gender}
                            onValueChange={setGender}
                        >
                            <RadioButton.Item
                                label='男'
                                value='男'
                                position='leading'
                                color={colors.primary}
                                labelStyle={{ textAlign: 'left' }}
                            />
                            <RadioButton.Item
                                label='女'
                                value='女'
                                position='leading'
                                color={colors.primary}
                                labelStyle={{ textAlign: 'left' }}
                            />
                        </RadioButton.Group>
                    </View>
                    <HelperText></HelperText>
                    <Divider />
                    <HelperText type='info'>
                        請選擇一個標籤(必要)
                    </HelperText>
                    <TagsView maxLimit={1} onExceedMaxLimit={handleExceedMaxTagLimit} tagsState={[tags, setTags]} />
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
                    <TextInput
                        mode='outlined'
                        label='補充(非必要)'
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
                        onChangeText={setContent}
                    />
                    <HelperText></HelperText>
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
                        || !breed
                        || !tags.find(tag => tag.selected)
                        || !photoUrl
                        || changingLocation
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