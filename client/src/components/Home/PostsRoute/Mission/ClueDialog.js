import React, { useRef, useState } from 'react';
import { Image, ScrollView, TextInput as NativeTextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Dialog, TextInput } from 'react-native-paper';
import { useCurrentLocation } from '../../../../hooks';

export default ({ visible, close }) => {
    const { currentLatitude, currentLongitude } = useCurrentLocation();

    const [mapViewRegion, setMapViewRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
    });

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.
    const [isImgLoading, setIsImgLoading] = useState(false);// Whether it is during image picking, if so, disable inputs and buttons. 

    const [content, setContent] = useState('');

    // Close the dailog with configuration
    const handleClose = () => {
        close();

        setContent('');
    };

    return (
      <Dialog visible={visible} onDismiss={handleClose}>
        <Dialog.Title>回報線索</Dialog.Title>
          <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', padding: 20 }}>
                    <TextInput
                        mode='outlined'
                        label='說明'
                        disabled={isImgLoading || isLoading}
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
                    <View style={{ width: '100%', height: 200 }}>
                        <Image
                            source={require('../../../../../assets/icons8-marker-48.png')}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                zIndex: 100,
                                transform: [
                                    // { translateX: '-50%' }
                                ],
                                backgroundColor: 'white'
                            }}
                            width={10}
                            height={10}
                        />
                        <MapView
                            style={{ flex: 1 }}
                            region={{
                                latitude: currentLatitude,
                                longitude: currentLongitude,
                                latitudeDelta: 0.0122,
                                longitudeDelta: 0.003,
                            }}
                            onRegionChangeComplete={region => console.log(region)}
                        />
                    </View>
                </ScrollView>
          </Dialog.ScrollArea>
      </Dialog>
  );
};