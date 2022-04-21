import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import AdoptionRoute from './Adoption/AdoptionRoute';
import PutUpForAdoptionRoute from './PutUpForAdoption/PutUpForAdoptionRoute';

const AdoptionTab = createMaterialTopTabNavigator();

export default () => {
  const { colors } = useTheme();

  return (
    <AdoptionTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
      <AdoptionTab.Screen name='PutUpForAdoption' options={{ title: '個人' }} component={PutUpForAdoptionRoute} />
      <AdoptionTab.Screen name='Adoption' options={{ title: '機構' }} component={AdoptionRoute} />
    </AdoptionTab.Navigator>
  );
};