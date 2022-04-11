import React, { useState } from 'react';
import {
    ScrollView,
    View,
    TextInput as NativeTextInput,
    RefreshControl,
} from 'react-native';
import {
    Avatar,
    Button,
    Dialog,
    Divider,
    HelperText,
    List,
    Portal,
    Subheading,
    TextInput,
} from 'react-native-paper';
import { addPutUpForAdoption } from '../../../../api';
import { SERVERURL } from '../../../../api/API';
import { useUpdateEffect } from '../../../../hooks';
import { constants } from '../../../../utils';
import SelectButton from '../../SelectButton';

export default ({
    visible,
    close,
    allPutUpForAdoptions,
    refreshAllPutUpForAdoptions,
    isFetchingAllPutUpForAdoptions,
    selfPets,
    refreshSelfPets,
    isFetchingSelfPets,
}) => {
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

        setPetId('');
        setContent('');
        setCounty(constants.countys[0]);
        setDistrict(constants.area_data[county][0]);
        setPhone('');
    };

    const checkPhone = (text) => {
        setPhone(text);
        setPhoneErrorMsg(text ? '' : '不可為空!!');
    };

    const handleSubmit = async () => {
        // Start posting
        setIsLoading(true);
        
        try {
            // Add the put up for adoption
            await addPutUpForAdoption({
                petId,
                content,
                county,
                district,
                phone,
            });

            refreshAllPutUpForAdoptions();
            handleClose();// Close the dialog
        } catch (error) {
            console.log('While adding putUpForAdoption:', error);
        }

        setIsLoading(false);
    };

    useUpdateEffect(() => {
        refreshAllPutUpForAdoptions();
        refreshSelfPets();
    }, null, [petsDialog]);

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>發佈送養貼文</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', paddingHorizontal: 20 }}>
                    <Portal>
                        <Dialog visible={petsDialog} onDismiss={() => setPetsDialog(false)}>
                            <Dialog.Title>請選擇一個寵物</Dialog.Title>
                            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                                <ScrollView
                                    style={{
                                        height: '80%',
                                        padding: 20,
                                    }}
                                    refreshControl={(
                                        <RefreshControl
                                            refreshing={isFetchingSelfPets}
                                            onRefresh={refreshSelfPets}
                                        />
                                    )}
                                >
                                    <List.Section style={{ marginTop: 0 }}>
                                        {
                                            !isFetchingAllPutUpForAdoptions ? (
                                                allPutUpForAdoptions.length ? (
                                                    selfPets.map(pet => (
                                                        <ListItem
                                                            key={pet._id}
                                                            pet={pet}
                                                            disabled={allPutUpForAdoptions.find(putUpForAdoption => putUpForAdoption.petId === pet._id)}
                                                            onPress={() => {
                                                                setPetId(pet._id);
                                                                setPetsDialog(false);
                                                            }}
                                                        />
                                                    ))
                                                ) : null
                                            ) : null
                                        }
                                    </List.Section>
                                </ScrollView>
                            </Dialog.ScrollArea>
                            <Dialog.Actions>
                                <Button
                                    disabled={isLoading}
                                    onPress={() => setPetsDialog(false)}
                                    contentStyle={{ paddingHorizontal: 10 }}
                                >
                                    取消
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Button 
                        mode='contained'
                        dark
                        disabled={isLoading}
                        style={{ marginVertical: 10, elevation: 0 }}
                        onPress={() => setPetsDialog(true)}
                    >
                        {petId ? '更改寵物' : '選擇寵物(必要)'}
                    </Button>
                    {
                        petId ? (
                            <>
                                <HelperText>送養寵物:</HelperText>
                                <List.Item
                                    title={chosenPet.name}
                                    left={() => <Avatar.Image source={{ uri: `${SERVERURL}/image/${chosenPet.photoId}` }} style={{ backgroundColor: 'white' }} />}
                                />
                            </>
                        ) : null
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
                        || !petId
                        || !phone
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