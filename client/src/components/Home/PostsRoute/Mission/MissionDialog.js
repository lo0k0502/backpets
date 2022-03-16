import React, { useState } from 'react';
import { TextInput as NativeTextInput, StyleSheet, ScrollView, View } from 'react-native';
import { getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync, launchImageLibraryAsync, MediaTypeOptions, getPendingResultAsync } from 'expo-image-picker';
import { TextInput, Dialog, Button, Card, HelperText, useTheme, Divider, Text } from 'react-native-paper';
import { addMission, uploadImage } from '../../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { useCurrentLocation } from '../../../../hooks';
import TagsView from '../TagsView';
import { tagsArray } from '../../../../utils/constants';
import DateTimePicker from '@react-native-community/datetimepicker';

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

    const [content, setContent] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [tags, setTags] = useState(tagsArray.map(tagName => ({ name: tagName, selected: false })));
    const [breed, setBreed] = useState('');
    const [feature, setFeature] = useState('');
    const [lostTime, setLostTime] = useState(new Date());

    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [dateTimePickerMode, setDateTimePickerMode] = useState('date');

    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');
    const [breedErrorMsg, setBreedErrorMsg] = useState('');
    const [featureErrorMsg, setFeatureErrorMsg] = useState('');
    const [lostTimeErrorMsg, setLostTimeErrorMsg] = useState('');

    const { currentLatitude, currentLongitude } = useCurrentLocation();

    // Close the dailog with configuration
    const handleClose = () => {
        close();

        setContent('');
        setPhotoUrl('');
        setTags(tagsArray.map(tagName => ({ name: tagName, selected: false })));
        setBreed('');
        setFeature('');
        setLostTime(new Date());

        setPhotoUrlErrorMsg('');
        setBreedErrorMsg('');
        setFeatureErrorMsg('');
        setLostTimeErrorMsg('');
    };

    const checkBreed = (text) => {
        setBreed(text);
        setBreedErrorMsg(text ? '' : '不可為空!!');
    };

    const checkFeature = (text) => {
        setFeature(text);
        setFeatureErrorMsg(text ? '' : '不可為空!!');
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
                content,
                tag: tags.find(tag => tag.selected).name,
                breed,
                feature,
                lost_time: lostTime.toISOString(),
                photoId: sendPhotoId,
                location: {
                    latitude: currentLatitude, 
                    longitude: currentLongitude, 
                },
            });

            setIsLoading(false);

            refreshMissions();
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
            <Dialog.Title>發佈任務</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', padding: 20 }}>
                    <TextInput 
                        mode='outlined'
                        label='品種'
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
                    <TextInput 
                        mode='outlined'
                        label='特徵'
                        disabled={isImgLoading || isLoading}
                        error={featureErrorMsg}
                        value={feature}
                        maxLength={20}
                        right={<TextInput.Affix text={`${feature.length}/20`} />}
                        onChangeText={checkFeature}
                    />
                    <HelperText type='error'>
                        {featureErrorMsg}
                    </HelperText>
                    <Divider />
                    <HelperText type='info'>
                        請選擇一個標籤
                    </HelperText>
                    <TagsView maxLimit={1} onExceedMaxLimit={handleExceedMaxTagLimit} tagsState={[tags, setTags]} />
                    <Divider style={lostTimeErrorMsg && { backgroundColor: 'red' }} />
                    <HelperText type='info'>
                        請選擇遺失日期與時間
                    </HelperText>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: colors.primary }}>日期</Text>
                            <Button
                                mode='contained'
                                dark
                                uppercase={false}
                                disabled={isImgLoading || isLoading}
                                onPress={() => {
                                    setShowDateTimePicker(true);
                                    setDateTimePickerMode('date');
                                }}
                                style={{
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                }}
                            >
                                {lostTime.getFullYear() + '/' + (lostTime.getMonth() + 1) + '/' + lostTime.getDate()}
                            </Button>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: colors.primary }}>時間</Text>
                            <Button
                                mode='contained'
                                dark
                                uppercase={false}
                                disabled={isImgLoading || isLoading}
                                onPress={() => {
                                    setShowDateTimePicker(true);
                                    setDateTimePickerMode('time');
                                }}
                                style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                }}
                            >
                                {lostTime.getHours() + '時' + lostTime.getMinutes() + '分'}
                            </Button>
                        </View>
                        {
                            showDateTimePicker ? (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={lostTime}
                                    mode={dateTimePickerMode}
                                    is24Hour
                                    display='spinner'
                                    onChange={(e, dateTime) => {
                                        setShowDateTimePicker(false);
                                        if (dateTime) {
                                            if (dateTime > new Date()) return setLostTimeErrorMsg('不可選取未來的時間!');
                                            setLostTimeErrorMsg('');
                                            setLostTime(dateTime);
                                        }
                                    }}
                                />
                            ) : null
                        }
                    </View>
                    <HelperText type='error'>
                        {lostTimeErrorMsg}
                    </HelperText>
                    <Divider style={lostTimeErrorMsg && { backgroundColor: 'red' }} />
                    <HelperText type='info'></HelperText>
                    <TextInput
                        mode='outlined'
                        label='補充'
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
                                    innerProps.multiline ? styles.innerPropNav : null,
                                ]}
                            />
                        )}
                        onChangeText={setContent}
                    />
                    <HelperText type='info'></HelperText>
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
                    <HelperText type='error'>
                        {photoUrlErrorMsg}
                    </HelperText>
                    {photoUrl ? <Card.Cover source={{ uri: photoUrl }} style={ styles.photoCard } /> : null}
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button 
                    color={colors.primary} 
                    disabled={isImgLoading || isLoading}
                    onPress={handleClose}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    取消
                </Button>
                <Button 
                    mode='contained' 
                    color={colors.primary}
                    dark
                    disabled={
                        isImgLoading
                        || isLoading
                        || !tags.find(tag => tag.selected)
                        || !breed
                        || !feature
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