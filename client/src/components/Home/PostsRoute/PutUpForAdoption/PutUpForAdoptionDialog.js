import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import {
    Avatar,
    Dialog,
    Divider,
    HelperText,
    List,
    Subheading,
    TextInput,
} from 'react-native-paper';
import { addPutUpForAdoption, editPutUpForAdoption } from '../../../../api';
import { SERVERURL } from '../../../../api/API';
import { usePet, useUpdateEffect } from '../../../../hooks';
import { constants, isEmptyObject } from '../../../../utils';
import DialogActions from '../../../common/DialogActions';
import SelectPet from '../../../common/SelectPet';
import TextArea from '../../../common/TextArea';
import SelectButton from '../../SelectButton';
import { Skeleton } from '../../Skeleton';

export default ({
    visible,
    close,
    putUpForAdoption,
    setPutUpForAdoption = () => {},
    allPutUpForAdoptions,
    refreshAllPutUpForAdoptions,
    isFetchingAllPutUpForAdoptions,
    selfPets,
    refreshSelfPets,
    isFetchingSelfPets,
}) => {
    const { pet, isFetching: isFetchingPet } = usePet(putUpForAdoption.petId);

    const [petsDialog, setPetsDialog] = useState(false);

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.

    const [petId, setPetId] = useState('');
    const [content, setContent] = useState('');
    const [county, setCounty] = useState(constants.countys[0]);
    const [district, setDistrict] = useState(constants.area_data[county][0]);
    const [phone, setPhone] = useState('');

    const [countyMenu, setCountyMenu] = useState(false);
    const [districtMenu, setDistrictMenu] = useState(false);

    const [phoneErrorMsg, setPhoneErrorMsg] = useState('');

    const chosenPet = selfPets.find(pet => pet._id === petId);

    const handleClose = () => {
        close();

        setPutUpForAdoption({});

        setPetId('');
        setContent('');
        setCounty(constants.countys[0]);
        setDistrict(constants.area_data[constants.countys[0]][0]);
        setPhone('');

        setPhoneErrorMsg('');
    };

    const checkPhone = (text) => {
        setPhone(text);
        setPhoneErrorMsg(text ? '' : '不可為空!!');
    };

    const handleSubmit = async () => {
        // Start posting
        setIsLoading(true);
        
        try {
            if (isEmptyObject(putUpForAdoption)) {
                // Add the put up for adoption
                await addPutUpForAdoption({
                    petId,
                    content,
                    county,
                    district,
                    phone,
                });
            } else {
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
            }

            refreshAllPutUpForAdoptions();
            handleClose();// Close the dialog
        } catch (error) {
            console.log('While adding putUpForAdoption:', error);
        }

        setIsLoading(false);
    };

    useUpdateEffect(() => {
        if (isEmptyObject(putUpForAdoption) || !petsDialog) return;
        refreshAllPutUpForAdoptions();
        refreshSelfPets();
    }, null, [petsDialog]);

    useEffect(() => {
        if (isEmptyObject(putUpForAdoption)) return;

        setContent(putUpForAdoption.content);
        setCounty(putUpForAdoption.county);
        setDistrict(putUpForAdoption.district);
        setPhone(putUpForAdoption.phone);
    }, [putUpForAdoption]);

    useEffect(() => {
        if (isEmptyObject(pet)) return;
        setPetId(pet._id);
    }, [pet]);

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>{isEmptyObject(putUpForAdoption) ? '發布' : '編輯'}送養貼文</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', paddingHorizontal: 20 }}>
                    {
                        isEmptyObject(putUpForAdoption) ? (
                            <SelectPet
                                petId={petId}
                                mode='putUpForAdoption'
                                petsDialog={petsDialog}
                                setPetsDialog={setPetsDialog}
                                selfPets={selfPets}
                                isFetchingSelfPets={isFetchingSelfPets}
                                refreshSelfPets={refreshSelfPets}
                                isFetchingPosts={isFetchingAllPutUpForAdoptions}
                                posts={allPutUpForAdoptions}
                                onPetPress={_pet => {
                                    setPetId(_pet._id);
                                    setPetsDialog(false);
                                }}
                                disabled={isLoading}
                            />
                        ) : null
                    }
                    <HelperText>送養寵物:</HelperText>
                    {
                        isFetchingPet ? (
                            <Skeleton mode='item' />
                        ) : (
                            petId ? (
                                <List.Item
                                    title={chosenPet.name}
                                    left={() => (
                                        <Avatar.Image
                                            source={{ uri: `${SERVERURL}/image/${chosenPet.photoId}` }}
                                            style={{ backgroundColor: 'white' }}
                                        />
                                    )}
                                />
                            ) : null
                        )
                    }
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
                    <TextArea
                        label='補充(非必要)'
                        disabled={isLoading}
                        value={content}
                        maxLength={50}
                        onChangeText={setContent}
                    />
                    <View style={{ height: 50 }} />
                </ScrollView>
            </Dialog.ScrollArea>
            <DialogActions
                cancelBtnLabel='取消'
                submitBtnLabel={isEmptyObject(putUpForAdoption) ? '發布' : '編輯'}
                cancelBtnDisabled={isLoading}
                submitBtnDisabled={
                    isLoading
                    || !petId
                    || !phone
                }
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleClose}
            />
        </Dialog>
    );
};

const ListItem = ({ pet, disabled = false, onPress }) => {
    return (
        <>
            <List.Item
                title={pet.name}
                description={disabled ? '無法選擇: 已存在此寵物的送養貼文' : null}
                descriptionStyle={{ color: 'red' }}
                style={disabled && { backgroundColor: '#eee', opacity: 0.7 }}
                disabled={disabled}
                left={() => <Avatar.Image source={{ uri: `${SERVERURL}/image/${pet.photoId}` }} style={{ backgroundColor: 'white' }} />}
                onPress={onPress}
            />
            <Divider />
        </>
    );
};