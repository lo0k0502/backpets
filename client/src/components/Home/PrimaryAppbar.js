import { useNavigationState } from '@react-navigation/native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { constants, isPageInitialWithSearchbar } from '../../utils';
import Appbar from './Appbar';
import AppSearchbar from './AppSearchbar';

export default ({ searchText, initialLocalState, ...props }) => {
    const { colors } = useTheme();
    const state = useNavigationState(state => state);
    const bottomNavigationState = state.routes.find(route => route.name === 'BottomNavigation').state;
    const currentBottomNavigationRouteName = bottomNavigationState && bottomNavigationState.routes[bottomNavigationState.index].name;
    const profileRouteState = bottomNavigationState?.routes.find(route => route.name === 'ProfileRoute').state;
    const currentProfileRouteName = profileRouteState && profileRouteState.routes[profileRouteState.index].name;

    return (
        state.index === 0 ? (
            !!searchText || isPageInitialWithSearchbar(
                bottomNavigationState ? bottomNavigationState.index : (
                    constants.pageNames.findIndex(routeName => routeName === initialLocalState.initialRoute)
                )
            ) ? (
                <AppSearchbar
                    {...props}
                    style={
                        currentBottomNavigationRouteName === 'Map' && { 
                            backgroundColor: 'transparent', 
                            elevation: 0,
                        }
                    }
                    inputStyle={currentBottomNavigationRouteName === 'Map' && { backgroundColor: 'white' }}
                    outlineColor={currentBottomNavigationRouteName === 'Map' ? colors.primary : 'transparent'}
                    activeOutlineColor={colors.background2}
                />
            ) : (
                <Appbar
                    {...props}
                    routeName={
                        bottomNavigationState && (
                            bottomNavigationState.index === 0 ? (
                                currentProfileRouteName || 'Profile'
                            ) : currentBottomNavigationRouteName
                        )
                    }
                />
            )
        ) : null
    );
};