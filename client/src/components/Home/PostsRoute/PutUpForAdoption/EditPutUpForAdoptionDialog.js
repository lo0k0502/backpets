import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    TextInput as NativeTextInput,
} from 'react-native';
import {
    Avatar,
    Button,
    Dialog,
    Divider,
    HelperText,
    List,
    Menu,
    Subheading,
    TextInput,
} from 'react-native-paper';
import { editPutUpForAdoption } from '../../../../api';
import { SERVERURL } from '../../../../api/API';
import { usePet } from '../../../../hooks';
import { constants } from '../../../../utils';
import SelectButton from '../../SelectButton';

export default ({ putUpForAdoption, visible, close, refreshAllPutUpForAdoptions }) => {
    const { pet, isFetching: isFetchingPet } = usePet(putUpForAdoption.petId);

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.

    const [content, setContent] = useState('');
    const [county, setCounty] = useState(constants.countys[0]);
    const [district, setDistrict] = useState(constants.area_data[county][0]);
    const [phone, setPhone] = useState('');

    const [countyMenu, setCountyMenu] = useState(false);
    const [districtMenu, setDistrictMenu] = useState(false);

    const [phoneErrorMsg, setPhoneErrorMsg] = useState('');

    const handleClose = () => {
        close();

        setContent(putUpForAdoption.content || '');
        setCounty(putUpForAdoption.county || constants.countys[0]);
        setDistrict(putUpForAdoption.district || constants.area_data[county][0]);
        setPhone(putUpForAdoption.phone || '');
    };

    const checkPhone = (text) => {
        setPhone(text);
        setPhoneErrorMsg(text ? '' : '不可為空!!');
    };

    const handleSubmit = async () => {
        // Start posting
        setIsLoading(true);
        
        try {
            // Edit the put up for adoption
            await editPutUpForAdoption(
                putUpForAdoption._id,
                {
                    content,
                    county,
                    district,
                    phone,
                }
            );

            setIsLoading(false);

            refreshAllPutUpForAdoptions();
            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            console.log('While editing putUpForAdoption:', error);
        }
    };

    useEffect(() => {
        setContent(putUpForAdoption.content || '');
        setCounty(putUpForAdoption.county || constants.countys[0]);
        setDistrict(putUpForAdoption.district || constants.area_data[county][0]);
        setPhone(putUpForAdoption.phone || '');
    }, [putUpForAdoption]);

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>編輯送養貼文</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', paddingHorizontal: 20 }}>
                    <HelperText>送養寵物:</HelperText>
                    <List.Item
                        title={isFetchingPet ? '' : pet.name}
                        titleStyle={isFetchingPet && { backgroundColor: '#ddd', borderRadius: 20, width: 50, height: 10 }}
                        description={isFetchingPet ? '' : pet.breed}
                        left={() => (
                            <Avatar.Image
                                source={{ uri: pet.photoId ? `${SERVERURL}/image/${pet.photoId}` : null }}
                                style={{ backgroundColor: isFetchingPet ? '#ddd' : 'white' }}
                            />
                        )}
                    />
                    <Divider />
                    <HelperText>
                        位置(必要)
                    </HelperText>
                    <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                        <Subheading>縣市: </Subheading>
                        <SelectButton
                            stateSet={[county, setCounty]}
                            menuStateSet={[countyMenu, setCountyMenu]}
                            options={constants.countys}
                            optionOnPress={option => setDistrict(constants.area_data[option][0])}
                        />
                        <Subheading> 地區: </Subheading>
                        <SelectButton
                            stateSet={[district, setDistrict]}
                            menuStateSet={[districtMenu, setDistrictMenu]}
                            options={constants.area_data[county]}
                        />
                    </View>
                    <Divider />
                    <HelperText></HelperText>
                    <TextInput 
                        mode='outlined'
                        label='電話(必要)'
                        keyboardType='phone-pad'
                        disabled={isLoading}
                        error={phoneErrorMsg}
                        value={phone}
                        maxLength={20}
                        right={<TextInput.Affix text={`${phone.length}/20`} />}
                        onChangeText={checkPhone}
                    />
                    <HelperText type='error'>
                        {phoneErrorMsg}
                    </HelperText>
                    <TextInput
                        mode='outlined'
                        label='補充(非必要)'
                        disabled={isLoading}
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
                    <View style={{ height: 50 }} />
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button
                    disabled={isLoading}
                    onPress={handleClose}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    取消
                </Button>
                <Button
                    mode='contained'
                    dark
                    disabled={
                        isLoading
                        || !phone
                    }
                    loading={isLoading}
                    onPress={handleSubmit}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    完成
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};