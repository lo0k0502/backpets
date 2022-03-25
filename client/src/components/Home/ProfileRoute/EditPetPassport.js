import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Avatar, Button, HelperText, TextInput } from 'react-native-paper';
import { SERVERURL } from '../../../api/API';
import { usePet } from '../../../hooks';
import { backIcon } from '../../../utils/constants';

export default ({ route, navigation }) =>  {
    const { petId } = route.params;
    const { pet } = usePet(petId);

    const [isLoading, setIsLoading] = useState(false);// Whether it is during editing profile, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons.

    const [photoUrl, setPhotoUrl] = useState('');
    const [name, setName] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [photoUrlErrorMsg, setphotoUrlErrorMsg] = useState('');
    const [nameErrorMsg, setNameErrorMsg] = useState('');

    useFocusEffect(useCallback(() => {
        setName(pet.name || '');
    }, [pet]));

    const checkName = (text) => {
        setName(text);
        setNameErrorMsg(text ? '' : '不可為空!');
    };

    // Change image
    const handleChangeImg = async () => {
        setIsImgLoading(true);

        // Check if user has granted us to access their media library. If no, ask once.
        if (!(await getMediaLibraryPermissionsAsync()).granted) {
            if (!(await requestMediaLibraryPermissionsAsync()).granted) {
                Alert.alert('權限不足!', '我們需要您的許可來存取您的媒體庫!', [{ text: '知道了!' }]);
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

    return (
        <>
            <Appbar style={{ backgroundColor: 'white' }}>
                <Appbar.Action icon={backIcon} onPress={navigation.goBack} />
                <Appbar.Content />
                <Appbar.Action icon='dots-vertical' onPress={() => {}} />
            </Appbar>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    alignItems: 'center',
                }}
            >
                <HelperText type='error' style={{ fontSize: 20 }}>
                    {errorMsg}
                </HelperText>
                <Avatar.Image
                    source={{
                        uri: photoUrl ? photoUrl : (
                            pet.photoId ? `${SERVERURL}/image/${pet.photoId}` : null
                        )
                    }}
                    size={100}
                    style={{ backgroundColor: 'white' }}
                />
                <HelperText type='error'>
                    {photoUrlErrorMsg}
                </HelperText>
                <Button 
                    mode='contained'
                    disabled={isImgLoading || isLoading}
                    loading={isImgLoading}
                    uppercase={false}
                    dark
                    style={{
                        height: 40, 
                        margin: 10,
                    }}
                    onPress={handleChangeImg}
                >
                    更改大頭照
                </Button>
                <TextInput
                    mode='outlined'
                    label='帳號名稱'
                    error={nameErrorMsg}
                    disabled={isImgLoading || isLoading}
                    value={name}
                    style={{
                        width: '60%',
                        margin: 20,
                    }}
                    maxLength={20}
                    right={<TextInput.Affix text={`${name.length}/20`} />}
                    onChangeText={checkName}
                />
                <HelperText type='error'>
                    {nameErrorMsg}
                </HelperText>
            </View>
        </>
    );
};