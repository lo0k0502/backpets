import React, { useEffect, useState } from 'react';
import { Image, ScrollView, View, TextInput as NativeTextInput, Alert, RefreshControl } from 'react-native';
import MapView from 'react-native-maps';
import { Avatar, Button, Card, Dialog, Divider, HelperText, List, Portal, RadioButton, Text, TextInput, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { addPutUpForAdoption, uploadImage } from '../../../../api';
import { SERVERURL } from '../../../../api/API';
import { useCurrentLocation, usePutUpForAdoptions, useSelfPets } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';

export default ({ visible, close, refreshPutUpForAdoptions }) => {
    const user = useSelector(selectUser);
    const { pets, refreshPets, isFetching } = useSelfPets(user.info?._id);
    const { putUpForAdoptions } = usePutUpForAdoptions()
    const { colors } = useTheme();
    const { currentLatitude, currentLongitude } = useCurrentLocation();

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [changingLocation, setChangingLocation] = useState(false);

    const [petsDialog, setPetsDialog] = useState(false);

    const [petId, setPetId] = useState('');
    const [content, setContent] = useState('');
    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
    });

    const chosenPet = pets.find(pet => pet._id === petId);

    useEffect(() => {
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });
    }, [currentLatitude, currentLongitude]);

    const handleClose = () => {
        close();

        setPetId('');
        setContent('');
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });
    };

    const handleSubmit = async () => {
        // Start posting
        setIsLoading(true);
        
        try {
            // Add the put up for adoption
            await addPutUpForAdoption({
                petId,
                content,
                location: {
                    latitude: mapViewRegion.latitude, 
                    longitude: mapViewRegion.longitude, 
                },
            });

            setIsLoading(false);

            refreshPutUpForAdoptions();
            handleClose();// Close the dialog
        } catch (error) {
            setIsLoading(false);
            console.log('While adding:', error);
        }
    };

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
                                                disabled={putUpForAdoptions.find(putUpForAdoption => putUpForAdoption.petId === pet._id)}
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