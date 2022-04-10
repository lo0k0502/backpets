import { Box, CloseButton } from '@chakra-ui/react';
import React, { useContext } from 'react';
import Context from '../../context';
import { constants } from '../../utils';
import ListItem from './ListItem';

export default ({ ...props }) => {
    const { closeDrawer } = useContext(Context);

    return (
        <Box
            transition='3s ease'
            w='25rem'
            h='100%'
            display='flex'
            flexDir='column'
            bgColor='bg.400'
            boxShadow='md'
            {...props}
        >
            <CloseButton
                alignSelf='flex-end'
                color='white'
                display={{ base: 'flex', lg: 'none' }}
                onClick={closeDrawer}
            />
            {constants.routes.map((route, index) => (
                <ListItem
                    key={index}
                    {...route}
                />
            ))}
        </Box>
    );
};