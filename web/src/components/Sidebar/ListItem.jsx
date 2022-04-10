import React from 'react';
import { Link } from 'react-router-dom';
import { HStack, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';

export default ({ name, routeName }) => {
    return (
        <LinkBox
            color='white'
            fontWeight='bold'
            borderBottomWidth={1}
            borderColor='border.100'
            _hover={{
                color: '#111',
                bgColor: 'rgba(255, 255, 255, 0.5)',
                opacity: 0.5,
            }}
        >
            <LinkOverlay as={Link} to={`/${routeName}`}>
                <HStack p='1rem'>
                    <Text transform='translateY(8%)'>
                        {name}
                    </Text>
                </HStack>
            </LinkOverlay>
        </LinkBox>
    );
};