import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { memo } from 'react';
import { useTheme } from 'react-native-paper';
import Appbar from './components/Home/Appbar';
import AppSearchbar from './components/Home/AppSearchbar';
import BottomNavigation from './components/Home/BottomNavigation';
import Clue from './components/Home/Clue';
import DrawerContent from './components/Home/drawer';
import Feedback from './components/Home/Feedback';
import Search from './components/Home/PostsRoute/Search';
import QA from './components/Home/QA';
import Setting from './components/Home/Setting';

const Drawer = createDrawerNavigator();

export default memo(({ logout }) => {
    const { colors } = useTheme();

    return (
        <Drawer.Navigator
          useLegacyImplementation={true}
          drawerContent={props => <DrawerContent {...props} logoutback={logout} />}
        >
          <Drawer.Screen
            name='BottomNavigation'
            options={{ headerShown: false }}
            component={BottomNavigation}
          />
          <Drawer.Screen
            name='Setting'
            options={{ header: props => <Appbar {...props} /> }}
            component={Setting}
          />
          <Drawer.Screen
            name='Feedback'
            options={{ header: props => <Appbar {...props} /> }}
            component={Feedback}
          />
          <Drawer.Screen
            name='QA'
            options={{ header: props => <Appbar {...props} /> }}
            component={QA}
          />
          <Drawer.Screen
            name='Clue'
            options={{ header: props => <Appbar {...props} /> }}
            component={Clue}
          />
          <Drawer.Screen
            name='Search'
            options={{
              header: props => (
                <AppSearchbar
                    {...props}
                    outlineColor='transparent'
                    activeOutlineColor={colors.background2}
                />
              )
            }}
            component={Search}
          />
        </Drawer.Navigator>
    );
});