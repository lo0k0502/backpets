import React, { useContext } from 'react';
import Logo from './Logo';
import NavBarContainer from './NavBarContainer';
import HambugerButton from './HambugerButton';
import { HStack } from '@chakra-ui/react';
import Context from '../../context';

export default () => {
    const { openDrawer } = useContext(Context);

    return (
        <NavBarContainer>
            <HStack>
                <HambugerButton onClick={openDrawer} />
                <Logo />
            </HStack>
        </NavBarContainer>
    );
};