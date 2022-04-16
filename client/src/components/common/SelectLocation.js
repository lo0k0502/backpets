import React from 'react';
import { View, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Button, Text } from 'react-native-paper';

export default ({
    region,
    onChange = () => {},
    isLoading,
    changingLocation,
    setChangingLocation = () => {},
}) => {
    return (
        <>
            <View style={[ { width: '100%', height: 200 }, !changingLocation && { opacity: 0.7 } ]}>
                <Image
                    source={require('../../../assets/map_marker.png')}
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
                    region={region}
                    onRegionChangeComplete={onChange}
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
            <Text>{'緯度: ' + region.latitude.toString()}</Text>
            <Text>{'經度: ' + region.longitude.toString()}</Text>
        </>
    );
};