import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, HStack, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';

export default () => {
  return (
    <LinkBox>
      <LinkOverlay as={Link} to='/'>
        <HStack ml='1rem'>
          <Avatar src='../../../assets/B.png' />
          <Text
            fontSize='2xl'
            fontWeight='bold'
            color='white'
            transform='translateY(8%)'
          >
            BackPets
          </Text>
        </HStack>
      </LinkOverlay>
    </LinkBox>
  );
};
