import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MissionRoute from './Mission/Mission';
import ReportRoute from './Report/ReportRoute';
import PutUpForAdoptionRoute from './PutUpForAdoption/PutUpForAdoptionRoute';
import { Appbar, TextInput, useTheme } from 'react-native-paper';

const PostsTab = createMaterialTopTabNavigator();

export default ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <>
            <Appbar style={{ backgroundColor: 'white' }}>
                <TextInput
                    mode='outlined'
                    placeholder='搜尋'
                    dense={true}
                    style={{
                        backgroundColor: colors.background2,
                        flex: 1,
                        paddingVertical: 0,
                        justifyContent: 'center',
                        marginHorizontal: '2%',
                    }}
                    outlineColor='transparent'
                    activeOutlineColor={colors.background2}
                    selectionColor={colors.primary}
                    left={
                        <TextInput.Icon
                            name='menu'
                            color='gray'
                            onPress={navigation.toggleDrawer}
                        />
                    }
                    right={
                        <TextInput.Icon
                            name='magnify'
                            color='gray'
                        />
                    }
                />
            </Appbar>
            <PostsTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
                <PostsTab.Screen name='Mission' options={{ title: '任務' }}>
                {props => <MissionRoute {...props} />}
                </PostsTab.Screen>
                <PostsTab.Screen name='Report' options={{ title: '通報' }}>
                {props => <ReportRoute {...props} />}
                </PostsTab.Screen>
                <PostsTab.Screen name='PutUpForAdoption' options={{ title: '認養' }}>
                {props => <PutUpForAdoptionRoute {...props} />}
                </PostsTab.Screen>
            </PostsTab.Navigator>
        </>
    );
};