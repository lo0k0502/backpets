import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { useTheme } from 'react-native-paper';
import BuyRoute from './Buy/BuyRoute';
import ExchangeRoute from './Exchange/ExchangeRoute';

const StoreTab = createMaterialTopTabNavigator();

export default () => {
    const { colors } = useTheme();

    return (
        <StoreTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
            <StoreTab.Screen name='Exchange' options={{ title: '兌換' }} component={ExchangeRoute} />
            <StoreTab.Screen name='Buy' options={{ title: '購買' }} component={BuyRoute} />
        </StoreTab.Navigator>
    );
};