import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import User from './screens/User';
import Sidebar from './components/Sidebar';
import ViolationReport from './screens/ViolationReport';
import Context from './context';
import Drawer from './components/Drawer';
import Mission from './screens/Mission';
import './moment';
import Feedback from './screens/Feedback';

function App() {
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();

  return (
    <Context.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      <Flex
        height='100vh'
        flexDir='column'
        bgColor='bg.300'
      >
        <Navbar />
        <Box display='flex' flexDir='row'  h='calc(100vh - 5rem)'>
          <Drawer>
            <Sidebar />
          </Drawer>
          <Sidebar display={{ base: 'none', lg: 'block' }} />
          <Routes>
            <Route path='/' element={<Navigate to='/user' replace />} />
            <Route path='/user' element={<User />} />
            <Route path='/mission' element={<Mission />} />
            <Route path='/feedback' element={<Feedback />} />
            <Route path='/violation-report' element={<ViolationReport />} />
            <Route path='*' element={() => 404} />
          </Routes>
        </Box>
      </Flex>
    </Context.Provider>
  );
};

export default App;
