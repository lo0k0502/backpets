import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

export default ({ user }) => {
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
            <Text>ID: {user._id}</Text>
            <Avatar src={`http://localhost:8000/image/${user.photoId}`} />
            <Box>
                <Text fontSize='xl' fontWeight='bold'>{user.username}</Text>
                <Text>{user.email}</Text>
            </Box>
            <Text>點數: {user.points}</Text>
            <Text>禮券: {user.couponIds.length}</Text>
            <Text>Email驗證狀態: {user.verified ? '已驗證' : '未驗證'}</Text>
        </Box>
    );
};