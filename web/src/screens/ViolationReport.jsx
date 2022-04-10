import { Box } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { fetchAllViolationReports } from '../api';
import ViolationReportItem from '../components/ViolationReport/ViolationReportItem';

export default () => {
    const isMounted = useRef(true);

    const [violationReports, setViolationReports] = useState([]);

    const fetchViolationReports = async () => {
        try {
            const result = await fetchAllViolationReports();
            if (isMounted.current) setViolationReports(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        fetchViolationReports();

        return () => { isMounted.current = false };
    }, []);

    return (
        <Box flexGrow={1}>
            {violationReports.map(violationReport => <ViolationReportItem key={violationReport._id} violationReport={violationReport} />)}
        </Box>
    );
};