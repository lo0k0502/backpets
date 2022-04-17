import React, { memo, useEffect, useState } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import {
    Dialog,
    HelperText,
    Divider,
    List,
    Avatar,
} from 'react-native-paper';
import { addMission, editMission } from '../../../../api';
import { useCurrentLocation, usePet, useUpdateEffect } from '../../../../hooks';
import { SERVERURL } from '../../../../api/API';
import SelectDateTime from '../../../common/SelectDateTime';
import TextArea from '../../../common/TextArea';
import SelectLocation from '../../../common/SelectLocation';
import DialogActions from '../../../common/DialogActions';
import { constants, isEmptyObject } from '../../../../utils';
import { Skeleton } from '../../Skeleton';
import SelectPet from '../../../common/SelectPet';

export default memo(({
    visible,
    close,
    mission,
    setMission = () => {},
    allMissions,
    refreshAllMissions,
    isFetchingAllMissions,
    selfPets,
    refreshSelfPets,
    isFetchingSelfPets,
}) => {
    const { pet, isFetching: isFetchingPet } = usePet(mission.petId);
    const { currentLatitude, currentLongitude } = useCurrentLocation();

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [changingLocation, setChangingLocation] = useState(false);

    const [petId, setPetId] = useState('');
    const [content, setContent] = useState('');
    const [lostTime, setLostTime] = useState(new Date());
    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        ...constants.locationDeltas,
    });
    
    const [petsDialog, setPetsDialog] = useState(false);

    const chosenPet = selfPets.find(_pet => _pet._id === petId);

    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [dateTimePickerMode, setDateTimePickerMode] = useState('date');

    const [lostTimeErrorMsg, setLostTimeErrorMsg] = useState('');

    // Close the dailog with configuration
    const handleClose = () => {
        close();

        setMission({});

        setPetId('');
        setContent('');
        setLostTime(new Date());
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            ...constants.locationDeltas,
        });

        setLostTimeErrorMsg('');
    };

    const handleSubmit = async () => {        
        // Start posting
        setIsLoading(true);
        
        try {
            if (isEmptyObject(mission)) {
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
            } else {
                // Edit the post
                await editMission(
                    mission._id,
                    {
                        content,
                        lost_time: lostTime.toISOString(),
                        location: {
                            latitude: mapViewRegion.latitude, 
                            longitude: mapViewRegion.longitude, 
                        },
                    },
                );
            }

            setIsLoading(false);

            refreshAllMissions();
            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            console.log(`While ${isEmptyObject(mission) ? 'adding' : 'editing'} mission:`, error);
        }
    };

    useEffect(() => {
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            ...constants.locationDeltas,
        });
    }, [currentLatitude, currentLongitude]);

    useUpdateEffect(() => {
        if (isEmptyObject(mission) || !petsDialog) return;
        refreshAllMissions();
        refreshSelfPets();
    }, null, [petsDialog]);

    useEffect(() => {
        if (isEmptyObject(mission)) return;

        setContent(mission.content);
        setLostTime(new Date(mission.lost_time));
        setMapViewRegion({
            ...mission.location,
            ...constants.locationDeltas,
        });
    }, [mission]);

    useEffect(() => {
        if (isEmptyObject(pet)) return;
        setPetId(pet._id);
    }, [pet]);

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>{isEmptyObject(mission) ? '發布' : '編輯'}任務</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', paddingHorizontal: 20 }}>
                    {
                        isEmptyObject(mission) ? (
                            <SelectPet
                                petId={petId}
                                mode='mission'
                                petsDialog={petsDialog}
                                setPetsDialog={setPetsDialog}
                                selfPets={selfPets}
                                isFetchingSelfPets={isFetchingSelfPets}
                                refreshSelfPets={refreshSelfPets}
                                isFetchingPosts={isFetchingAllMissions}
                                posts={allMissions}
                                onPetPress={_pet => {
                                    setPetId(_pet._id);
                                    setPetsDialog(false);
                                }}
                                disabled={isLoading}
                            />
                        ) : null
                    }
                    <HelperText>遺失寵物:</HelperText>
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
                    <HelperText></HelperText>
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
                submitBtnLabel={isEmptyObject(mission) ? '發布' : '編輯'}
                cancelBtnDisabled={isLoading}
                submitBtnDisabled={
                    isLoading
                    || (isEmptyObject(mission) && !petId)
                    || changingLocation
                }
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleClose}
            />
        </Dialog>
    );
});

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