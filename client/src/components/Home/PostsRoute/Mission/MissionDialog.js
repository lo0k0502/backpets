import React, { useEffect, useState } from 'react';
import {
    TextInput as NativeTextInput,
    ScrollView,
    View,
    Image,
    RefreshControl,
} from 'react-native';
import {
    TextInput,
    Dialog,
    Button,
    HelperText,
    useTheme,
    Divider,
    Text,
    Portal,
    List,
    Avatar,
} from 'react-native-paper';
import { addMission } from '../../../../api';
import { useCurrentLocation, useUpdateEffect } from '../../../../hooks';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView from 'react-native-maps';
import { SERVERURL } from '../../../../api/API';
import SelectDateTime from '../../../common/SelectDateTime';
import TextArea from '../../../common/TextArea';
import SelectLocation from '../../../common/SelectLocation';
import DialogActions from '../../../common/DialogActions';

export default ({
    visible,
    close,
    allMissions,
    refreshAllMissions,
    isFetchingAllMissions,
    selfPets,
    refreshSelfPets,
    isFetchingSelfPets,
}) => {
    const [petsDialog, setPetsDialog] = useState(false);

    const { colors } = useTheme();
    const { currentLatitude, currentLongitude } = useCurrentLocation();

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [changingLocation, setChangingLocation] = useState(false);

    const [petId, setPetId] = useState('');
    const [content, setContent] = useState('');
    const [lostTime, setLostTime] = useState(new Date());
    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
    });

    const chosenPet = selfPets.find(pet => pet._id === petId);

    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [dateTimePickerMode, setDateTimePickerMode] = useState('date');

    const [lostTimeErrorMsg, setLostTimeErrorMsg] = useState('');

    // Close the dailog with configuration
    const handleClose = () => {
        close();

        setPetId('');
        setContent('');
        setLostTime(new Date());
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });

        setLostTimeErrorMsg('');
    };

    const handleSubmit = async () => {        
        // Start posting
        setIsLoading(true);
        
        try {
            // Add the post
            await addMission({
                petId,
                content,
                lost_time: lostTime.toISOString(),
                location: {
                    latitude: mapViewRegion.latitude, 
                    longitude: mapViewRegion.longitude, 
                },
            });

            setIsLoading(false);

            refreshAllMissions();
            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            console.log('While adding mission:', error);
        }
    };

    useEffect(() => {
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });
    }, [currentLatitude, currentLongitude]);

    useUpdateEffect(() => {
        if (!petsDialog) return;
        refreshAllMissions();
        refreshSelfPets();
    }, null, [petsDialog]);

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>發佈任務</Dialog.Title>
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
                                            !isFetchingAllMissions ? (
                                                allMissions.length ? (
                                                    selfPets.map(pet => (
                                                        <ListItem
                                                            key={pet._id}
                                                            pet={pet}
                                                            disabled={allMissions.find(mission => mission.petId === pet._id)}
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
                                <HelperText>遺失寵物:</HelperText>
                                <List.Item
                                    title={chosenPet.name}
                                    left={() => <Avatar.Image source={{ uri: `${SERVERURL}/image/${chosenPet.photoId}` }} style={{ backgroundColor: 'white' }} />}
                                />
                            </>
                        ) : null
                    }
                    <Divider style={lostTimeErrorMsg && { backgroundColor: 'red' }} />
                    <HelperText>
                        請選擇遺失日期與時間(必要)
                    </HelperText>
                    <SelectDateTime
                        show={showDateTimePicker}
                        value={lostTime}
                        disabled={isLoading}
                        dateTimePickerMode={dateTimePickerMode}
                        errorMsg={lostTimeErrorMsg}
                        onDatePress={() => {
                            setShowDateTimePicker(true);
                            setDateTimePickerMode('date');
                        }}
                        onTimePress={() => {
                            setShowDateTimePicker(true);
                            setDateTimePickerMode('time');
                        }}
                        onChange={(e, dateTime) => {
                            setShowDateTimePicker(false);
                            if (dateTime) {
                                if (dateTime > new Date()) return setLostTimeErrorMsg('不可選取未來的時間!');
                                setLostTimeErrorMsg('');
                                setLostTime(dateTime);
                            }
                        }}
                    />
                    <Divider style={lostTimeErrorMsg && { backgroundColor: 'red' }} />
                    <HelperText>
                        位置(必要)
                    </HelperText>
                    <SelectLocation
                        region={mapViewRegion}
                        onChange={setMapViewRegion}
                        isLoading={isLoading}
                        changingLocation={changingLocation}
                        setChangingLocation={setChangingLocation}
                    />
                    <Divider />
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
                submitBtnLabel='發佈'
                cancelBtnDisabled={isLoading}
                submitBtnDisabled={
                    isLoading
                    || !petId
                    || changingLocation
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
                description={disabled ? '無法選擇: 已存在此寵物的遺失任務' : null}
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