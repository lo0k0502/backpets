import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { deleteImage, fetchAllImages } from '../../api';
import { SERVERURL } from '../../api/API';

export default () => {
    const [images, setImages] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const isMounted = useRef(true);

    const fetchImages = async () => {
        setIsFetching(true);

        try {
            const result = await fetchAllImages();
            if (isMounted.current) {
                setImages(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        fetchImages();

        return () => { isMounted.current = false };
    }, []));

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} refreshControl={<RefreshControl refreshing={isFetching} onRefresh={fetchImages} />}>
            {images.map(image => (
                <Item key={image._id} image={image} refreshImages={fetchImages} />
            ))}
        </ScrollView>
    );
};

const Item = ({ image, refreshImages }) => {
    const { colors } = useTheme();

    const handleSubmit = async () => {
        try {
            await deleteImage(image._id);

            refreshImages();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Card 
            style={{
                margin: 5,
                justifyContent: 'center',
                backgroundColor: colors.background2,
            }}
        >
            <Text style={{ textAlign: 'center' }}>{image._id}</Text>
            <Card.Cover
                source={{ uri: `${SERVERURL}/image/${image._id}` }}
                style={{
                    width: 300,
                    height: 200,
                    alignSelf: 'center',
                    marginVertical: 5,
                }}
            />
            <Button
                mode='contained'
                dark
                uppercase={false}
                onPress={handleSubmit}
            >
                Delete
            </Button>
        </Card>
    );
};