import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    View,
    TextInput as NativeTextInput,
} from 'react-native';
import MapView from 'react-native-maps';
import {
    Avatar,
    Button,
    Dialog,
    Divider,
    HelperText,
    List,
    Text,
    TextInput,
} from 'react-native-paper';
import { editPutUpForAdoption } from '../../../../api';
import { SERVERURL } from '../../../../api/API';
import { useCurrentLocation, usePet } from '../../../../hooks';

export default ({ putUpForAdoption, visible, close, refreshPutUpForAdoptions }) => {
    const { pet, isFetching: isFetchingPet } = usePet(putUpForAdoption.petId);
    const { currentLatitude, currentLongitude } = useCurrentLocation();

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [changingLocation, setChangingLocation] = useState(false);

    const [content, setContent] = useState('');
    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.003,
    });

    useEffect(() => {
        setMapViewRegion({
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });
    }, [currentLatitude, currentLongitude]);

    useEffect(() => {
        setContent(putUpForAdoption.content || '');
        setMapViewRegion(putUpForAdoption.location ? {
            ...putUpForAdoption.location,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        } : {
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        });
    }, [putUpForAdoption]);

    const handleClose = () => {
        close();

        setContent(putUpForAdoption.content || '');
        setMapViewRegion(putUpForAdoption.location ? {
            ...putUpForAdoption.location,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.003,
        } : {
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
            // Edit the put up for adoption
            await editPutUpForAdoption(
                putUpForAdoption._id,
                {
                    content,
                    location: {
                        latitude: mapViewRegion.latitude, 
                        longitude: mapViewRegion.longitude, 
                    },
                }
            );

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
                                source={isFetchingPet ? null : { uri: `${SERVERURL}/image/${pet.photoId}` }}
                                style={{ backgroundColor: isFetchingPet ? '#ddd' : 'white' }}
                            />
                        )}
                    />
                    <Divider />
                    <HelperText>
                        位置(必要)
                    </HelperText>
                    <View style={[ { width: '100%', height: 200 }, !changingLocation && { opacity: 0.7 } ]}>
                        <Image
                            source={require('../../../../../assets/map_marker.png')}
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
                        || changingLocation
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

const ListItem = ({ pet, onPress }) => {
    return (
        <>
            <List.Item
                title={pet.name}
                left={() => <Avatar.Image source={{ uri: `${SERVERURL}/image/${pet.photoId}` }} style={{ backgroundColor: 'white' }} />}
                onPress={onPress}
            />
            <Divider />
        </>
    );
};