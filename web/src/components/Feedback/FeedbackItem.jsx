import { Avatar, Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { fetchUserById } from '../../api';
import moment from 'moment';

export default ({ feedback }) => {
    const isMounted = useRef(true);

    const [poster, setPoster] = useState({});

    const fetchPoster = async () => {
        try {
            const result = await fetchUserById(feedback.userId);
            if (isMounted.current) setPoster(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        fetchPoster();

        return () => { isMounted.current = false };
    }, [feedback]);

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
            <Text>ID: {feedback._id}</Text>
            {poster.photoId && <Avatar src={`http://localhost:8000/image/${poster.photoId}`} />}
            <Box>
                <Text fontSize='xl' fontWeight='bold'>{poster.username}</Text>
                <Text>{moment(feedback.post_time).fromNow()}</Text>
            </Box>
            <Text>Email: {poster.email}</Text>
            <Text>說明: {feedback.content}</Text>
        </Box>
    );
};