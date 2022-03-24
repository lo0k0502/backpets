import React, { useEffect, useState } from 'react';
import { TextInput as NativeTextInput, StyleSheet, ScrollView, View, Image, RefreshControl } from 'react-native';
import { TextInput, Dialog, Button, HelperText, useTheme, Divider, Text, Portal, List, Avatar } from 'react-native-paper';
import { addMission, editMission } from '../../../../api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { useCurrentLocation, useMissions, usePet, useSelfPets } from '../../../../hooks';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView from 'react-native-maps';
import { SERVERURL } from '../../../../api/API';

export default ({ mission, visible, close, refreshMissions }) => {
    const { colors } = useTheme();
    const { currentLatitude, currentLongitude } = useCurrentLocation();
    
    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [changingLocation, setChangingLocation] = useState(false);
    
    const [petId, setPetId] = useState('');
    const { pet } = usePet(petId);

    const [content, setContent] = useState('');
    const [lostTime, setLostTime] = useState(new Date());
    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
    });

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

    useEffect(() => {
        setPetId(mission.petId || '');
        setContent(mission.content || '');
        setLostTime(mission.lost_time ? new Date(mission.lost_time) : new Date());
        setMapViewRegion(mission.location ? {
            ...mission.location,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        } : {
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });
    }, [mission]);

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
        // Start editing
        setIsLoading(true);
        
        try {
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
                    {
                        pet?.photoId ? (
                            <>
                                <HelperText>遺失寵物:</HelperText>
                                <List.Item
                                    title={pet.name}
                                    left={() => <Avatar.Image source={{ uri: `${SERVERURL}/image/${pet.photoId}` }} style={{ backgroundColor: 'white' }} />}
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
                    編輯
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};