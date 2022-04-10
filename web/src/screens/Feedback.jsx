import { Box } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { fetchAllFeedbacks } from '../api';
import FeedbackItem from '../components/Feedback/FeedbackItem';

export default () => {
    const isMounted = useRef(true);

    const [feedbacks, setFeedbacks] = useState([]);

    const fetchFeedbacks = async () => {
        try {
            const result = await fetchAllFeedbacks();
            if (isMounted.current) setFeedbacks(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        fetchFeedbacks();

        return () => { isMounted.current = false };
    }, []);

    return (
        <Box flexGrow={1}>
            {feedbacks.map(feedback => <FeedbackItem key={feedback._id} feedback={feedback} />)}
        </Box>
    );
};