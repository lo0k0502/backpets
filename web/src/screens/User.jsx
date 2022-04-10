import { Box } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { fetchAllUsers } from '../api';
import UserItem from '../components/User/UserItem';

export default () => {
    const isMounted = useRef(true);

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const result = await fetchAllUsers();
            if (isMounted.current) setUsers(result.data.result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        fetchUsers();

        return () => { isMounted.current = false };
    }, []);

    return (
        <Box flexGrow={1}>
            {users.map(user => <UserItem key={user._id} user={user} />)}
        </Box>
    );
};