import { Box } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { fetchAllMissions } from '../api';
import MissionItem from '../components/Mission/MissionItem';

export default () => {
    const isMounted = useRef(true);

    const [missions, setMissions] = useState([]);

    const fetchMissions = async () => {
        try {
            const result = await fetchAllMissions();
            if (isMounted.current) setMissions(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        fetchMissions();

        return () => { isMounted.current = false };
    }, []);

    return (
        <Box flexGrow={1}>
            {missions.map(mission => <MissionItem key={mission._id} mission={mission} />)}
        </Box>
    );
};