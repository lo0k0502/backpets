import React, { useEffect, useState } from 'react';
import { TextInput as NativeTextInput, StyleSheet, ScrollView, View, Image, Alert, RefreshControl } from 'react-native';
import { getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync, launchImageLibraryAsync, MediaTypeOptions, getPendingResultAsync } from 'expo-image-picker';
import { TextInput, Dialog, Button, Card, HelperText, useTheme, Divider, Text, RadioButton, Portal, List, Avatar } from 'react-native-paper';
import { addMission, uploadImage } from '../../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { useCurrentLocation, useMissions, useSelfPets } from '../../../../hooks';
import TagsView from '../TagsView';
import { animalTagsArray } from '../../../../utils/constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView from 'react-native-maps';
import { SERVERURL } from '../../../../api/API';

const styles = StyleSheet.create({
    photoCard: { 
        width: 300, 
        height: 200, 
        alignSelf: 'center',
    },
});

export default ({ visible, close, refreshMissions }) => {
    const user = useSelector(selectUser);
    const { pets, refreshPets, isFetching } = useSelfPets(user.info?._id);
    const { missions } = useMissions();
    const { colors } = useTheme();
    const { currentLatitude, currentLongitude } = useCurrentLocation();

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [changingLocation, setChangingLocation] = useState(false);

    const [petsDialog, setPetsDialog] = useState(false);

    const [petId, setPetId] = useState('');
    const [content, setContent] = useState('');
    const [lostTime, setLostTime] = useState(new Date());
    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
    });

    const chosenPet = pets.find(pet => pet._id === petId);

    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [dateTimePickerMode, setDateTimePickerMode] = useState('date');

    const [lostTimeErrorMsg, setLostTimeErrorMsg] = useState('');

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

            refreshMissions();
            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            console.log('While adding:', error)
        }
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>發佈任務</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', padding: 20 }}>
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
                                            refreshing={isFetching}
                                            onRefresh={refreshPets}
                                        />
                                    )}
                                >
                                    <List.Section style={{ marginTop: 0 }}>
                                        {pets.map(pet => (
                                            <ListItem
                                                key={pet._id}
                                                pet={pet}
                                                disabled={missions.find(mission => mission.petId === pet._id)}
                                                onPress={() => {
                                                    setPetId(pet._id);
                                                    setPetsDialog(false);
                                                }}
                                            />
                                        ))}
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
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: colors.primary }}>日期</Text>
                            <Button
                                mode='contained'
                                dark
                                uppercase={false}
                                disabled={isLoading}
                                onPress={() => {
                                    setShowDateTimePicker(true);
                                    setDateTimePickerMode('date');
                                }}
                                style={{
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    elevation: 0,
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
                                disabled={isLoading}
                                onPress={() => {
                                    setShowDateTimePicker(true);
                                    setDateTimePickerMode('time');
                                }}
                                style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    elevation: 0,
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
                    <HelperText>
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
                            showsUserLocation={!isLoading && changingLocation}
                            scrollEnabled={!isLoading && changingLocation}
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

const ListItem = ({ pet, disabled, onPress }) => {
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