import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    View,
} from 'react-native';
import {
    Avatar,
    Button,
    Dialog,
    Divider,
    HelperText,
    RadioButton,
    Subheading,
    Switch,
    TextInput,
    useTheme,
} from 'react-native-paper';
import {
    getMediaLibraryPermissionsAsync,
    getPendingResultAsync,
    launchImageLibraryAsync,
    MediaTypeOptions,
    requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { addPet, uploadImage } from '../../../api';
import { selectUser } from '../../../redux/userSlice';
import { constants } from '../../../utils';
import TagsView from '../../common/TagsView';

export default ({ visible, close, refreshSelfPets }) => {
    const user = useSelector(selectUser);
    const { colors } = useTheme();

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons.

    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [feature, setFeature] = useState('');
    const [gender, setGender] = useState('男');
    const [tags, setTags] = useState(constants.animalTagsArray.map(tagName => ({ name: tagName, selected: false })));
    const [ligated, setLigated] = useState(false);
    const [age, setAge] = useState('');
    const [microchip, setMicrochip] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const [breedErrorMsg, setBreedErrorMsg] = useState('');
    const [featureErrorMsg, setFeatureErrorMsg] = useState('');
    const [ageErrorMsg, setAgeErrorMsg] = useState('');
    const [photoUrlErrorMsg, setPhotoUrlErrorMsg] = useState('');

    const handleClose = () => {
        close();

        setName('');
        setBreed('');
        setFeature('');
        setGender('男');
        setTags(constants.animalTagsArray.map(tagName => ({ name: tagName, selected: false })));
        setLigated(false);
        setAge('');
        setMicrochip('');
        setPhotoUrl('');

        setNameErrorMsg('');
        setBreedErrorMsg('');
        setFeatureErrorMsg('');
        setAgeErrorMsg('');
        setPhotoUrlErrorMsg('');
    };

    const checkName = (text) => {
        setName(text);
        setNameErrorMsg(text ? '' : '不可為空!!');
    };

    const checkBreed = (text) => {
        setBreed(text);
        setBreedErrorMsg(text ? '' : '不可為空!!');
    };

    const checkFeature = (text) => {
        setFeature(text);
        setFeatureErrorMsg(text ? '' : '不可為空!!');
    };

    const checkAge = (text) => {
        const isDigits = /^\d*$/.test(text);
        if (!isDigits) return setAgeErrorMsg('請輸入整數!');

        setAge(text);
        setAgeErrorMsg(text ? '' : '不可為空!!');
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
            aspect: [1, 1],
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

            if (!(mediatype === 'jpg' || mediatype === 'jpeg' || mediatype === 'png')) {
                setIsLoading(false);
                return;
            }

            formData.append('image', {
                uri: photoUrl,
                name: filename,
                type: 'image/jpeg',
            });
            
            const { data } = await uploadImage(formData);

            // Add the pet
            await addPet({
                name,
                userId: user.info._id,
                tag: tags.find(tag => tag.selected).name,
                breed,
                feature,
                gender,
                photoId: data.photoId,
                ligated,
                age: parseInt(age, 10),
                microchip,
            });

            setIsLoading(false);

            refreshSelfPets();
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
            <Dialog.Title>新增寵物護照</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', paddingHorizontal: 20 }}>
                    <TextInput 
                        mode='outlined'
                        label='寵物名稱(必要)'
                        disabled={isImgLoading || isLoading}
                        error={nameErrorMsg}
                        value={name}
                        maxLength={10}
                        right={<TextInput.Affix text={`${name.length}/10`} />}
                        onChangeText={checkName}
                    />
                    <HelperText type='error'>
                        {nameErrorMsg}
                    </HelperText>
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
                    <TextInput 
                        mode='outlined'
                        label='特徵(必要)'
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
                    <HelperText>
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
                    <Divider />
                    <HelperText>
                        請選擇一個標籤(必要)
                    </HelperText>
                    <TagsView maxLimit={1} onExceedMaxLimit={handleExceedMaxTagLimit} tagsState={[tags, setTags]} />
                    <Divider />
                    <HelperText>
                        是否結紮(必要)
                    </HelperText>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Subheading style={{ marginLeft: 10 }}>{ligated ? '是' : '否'}</Subheading>
                        <Switch
                            value={ligated}
                            onValueChange={setLigated}
                            color={colors.primary}
                        />
                    </View>
                    <Divider />
                    <HelperText></HelperText>
                    <TextInput 
                        mode='outlined'
                        label='寵物年齡(必要)'
                        keyboardType='decimal-pad'
                        disabled={isImgLoading || isLoading}
                        error={ageErrorMsg}
                        value={age}
                        maxLength={3}
                        right={<TextInput.Affix text={`${age.length}/3`} />}
                        onChangeText={checkAge}
                    />
                    <HelperText type='error'>
                        {ageErrorMsg}
                    </HelperText>
                    <TextInput 
                        mode='outlined'
                        label='寵物晶片號碼(非必要)'
                        disabled={isImgLoading || isLoading}
                        value={microchip}
                        maxLength={20}
                        right={<TextInput.Affix text={`${microchip.length}/20`} />}
                        onChangeText={setMicrochip}
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
                        {photoUrl ? '更改大頭照' : '新增大頭照(必要)'}
                    </Button>
                    <HelperText type='error'>
                        {photoUrlErrorMsg}
                    </HelperText>
                    {photoUrl ? (
                        <Avatar.Image
                            source={{ uri: photoUrl }}
                            size={100}
                            style={{
                                backgroundColor: 'white',
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
                        || !name
                        || !breed
                        || !feature
                        || !tags.find(tag => tag.selected)
                        || !age
                        || !photoUrl
                    }
                    loading={isLoading}
                    onPress={handleSubmit}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    新增
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};