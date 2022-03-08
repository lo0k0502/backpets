import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, Text } from 'react-native';
import { Button, Portal } from 'react-native-paper';
import MissionDialog from './MissionDialog';
import MissionCard from './MissionCard';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { useMissions } from '../../../../hooks';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    emailVerifySuggest: {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderWidth: 3,
        borderColor: 'red',
        borderRadius: 10,
        margin: 10,
        padding: 5,
    },
    card: {
        margin: 20,
        justifyContent: 'center',
        elevation: 3,
        borderRadius: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTopWidth: 10,
        borderTopColor: '#be9a78',
    },
    missionaction: {
        width: '100%',
        textAlign: 'left',
        borderRadius: 0,
    },
    cardimg: {
        width: 300,
        height: 200,
        alignSelf: 'center',
    },
    cardactions: {
        justifyContent: 'flex-end',
    },
    cardbtn: {
        color: '#be9a78',
    },
    fab: {
        position: 'absolute',
        right: 40,
        bottom: 80,
            backgroundColor: '#be9a78',
        },
    });

export default ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);// State for RefreshControl component
    const [missionDialog, setMissionDialog] = useState(false);// Whether mission dialog is open

    const user = useSelector(selectUser);
    const { missions, refreshMissions } = useMissions();

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        refreshMissions().then(() => setRefreshing(false));
    }, []);
    
    return (
        <ScrollView style={styles.root} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
            <Button
                mode='contained'
                icon='plus'
                color='#be9a78'
                dark
                theme={{ roundness: 0 }}
                onPress={() => setMissionDialog(true)}
            >
                新增任務
            </Button>
            <View style={[styles.emailVerifySuggest, { display: user.info?.verified ? 'none' : 'flex' }]}>
                <Text style={{ color: 'black' }}>你的信箱還未驗證喔!</Text>
                <Text style={{ color: 'black' }}>我們強烈建議您先驗證您的信箱!</Text>
            </View>
            <Portal>
                <MissionDialog visible={missionDialog} close={() => setMissionDialog(false)} refreshMissions={refreshMissions} />
            </Portal>
            {missions.map(mission => <MissionCard mission={mission} key={mission._id} />)}
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};