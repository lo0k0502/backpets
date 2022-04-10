import React from 'react';
import { Flex } from '@chakra-ui/react';

export default ({ children }) => {
  return (
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      w='100%'
      height='5rem'
      p='4'
      boxShadow='md'
      bgColor='primary.100'
    >
      {children}
    </Flex>
  );
};
