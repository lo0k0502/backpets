import { Avatar, Box, Text } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { fetchUserById } from '../../api';
import moment from 'moment';
import { constants } from '../../utils';

export default ({ violationReport }) => {
    const isMounted = useRef(true);

    const [poster, setPoster] = useState({});

    const fetchPoster = async () => {
        try {
            const result = await fetchUserById(violationReport.userId);
            if (isMounted.current) setPoster(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        fetchPoster();

        return () => { isMounted.current = false };
    }, [violationReport]);

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
            <Text>ID: {violationReport._id}</Text>
            {poster.photoId && <Avatar src={`http://localhost:8000/image/${poster.photoId}`} />}
            <Box>
                <Text fontSize='xl' fontWeight='bold'>{poster.username}</Text>
                <Text>{moment(violationReport.post_time).fromNow()}</Text>
            </Box>
            <Text>Email: {poster.email}</Text>
            <Text>說明: {violationReport.content}</Text>
            <Text>貼文類型: {constants.postTypeENtoCH(violationReport.post_type)}</Text>
            <Text>貼文ID: {violationReport.postId}</Text>
        </Box>
    );
};