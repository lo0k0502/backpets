import { Avatar, Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { fetchPetById, fetchUserById } from '../../api';
import moment from 'moment';

export default ({ mission }) => {
    const isMounted = useRef(true);

    const [poster, setPoster] = useState({});
    const [pet, setPet] = useState({});

    const fetchPoster = async () => {
        try {
            const result = await fetchUserById(mission.userId);
            if (isMounted.current) setPoster(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPet = async () => {
        try {
            const result = await fetchPetById(mission.petId);
            if (isMounted.current) setPet(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        fetchPoster();
        fetchPet();

        return () => { isMounted.current = false };
    }, [mission]);

    return (
        <Box
            p='1rem'
            display='flex'
            flexDir='row'
            alignItems='center'
            gap='1rem'
            borderBottomWidth={1}
            borderColor='border.100'
        >
            <Text>ID: {mission._id}</Text>
            {poster.photoId && <Avatar src={`http://localhost:8000/image/${poster.photoId}`} />}
            <Box>
                <Text fontSize='xl' fontWeight='bold'>{poster.username}</Text>
                <Text>{moment(mission.post_time).fromNow()}</Text>
            </Box>
            <Text>寵物名稱: {pet.name}</Text>
            <Text>品種: {pet.breed}</Text>
            <Text>完成狀態: {mission.completed ? '已完成' : '未完成'}</Text>
        </Box>
    );
};