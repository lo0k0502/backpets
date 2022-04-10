import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { MdMenu } from 'react-icons/md';

export default ({ onClick = () => {} }) => {
  return (
    <IconButton
      variant='ghost'
      color='white'
      display={{ base: 'inherit', lg: 'none' }}
      boxShadow='md'
      _hover={{ color: 'primary.100', bgColor: 'bg.300' }}
      borderRadius={20}
      icon={<MdMenu />}
      onClick={onClick}
    />
  );
};
