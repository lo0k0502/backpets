import { Drawer, DrawerContent, useBreakpointValue } from '@chakra-ui/react';
import React, { useContext } from 'react';
import Context from '../../context';

export default ({ children }) => {
    const { isDrawerOpen, closeDrawer } = useContext(Context);
    const canDisplay = useBreakpointValue({ base: true, lg: false });

    return (
        <Drawer
          autoFocus={false}
          isOpen={canDisplay && isDrawerOpen}
          placement='left'
          onClose={closeDrawer}
          returnFocusOnClose={false}
          onOverlayClick={closeDrawer}
        >
          <DrawerContent>
              {children}
          </DrawerContent>
        </Drawer>
    );
};