import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, Text } from 'react-native';
import { ActivityIndicator, Button, Portal, Title, useTheme } from 'react-native-paper';
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
        margin: 10,
        padding: 5,
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

export default ({ navigation, selectedTags }) => {
    const user = useSelector(selectUser);
    const { missions, refreshMissions } = useMissions();
    const { colors } = useTheme();

    const [refreshing, setRefreshing] = useState(false);// State for RefreshControl component
    const [missionDialog, setMissionDialog] = useState(false);// Whether mission dialog is open

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
            {missions.map(mission => selectedTags.includes(mission.tag) || !selectedTags.length ? true : false).find(e => e)
                ? missions.map(mission => selectedTags.includes(mission.tag) || !selectedTags.length ? <MissionCard mission={mission} key={mission._id} /> : null)
                : selectedTags.length
                    ? <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                    : (
                        <ActivityIndicator
                            animating={true}
                            color={colors.primary}
                            size='large'
                            style={{ marginTop: 50 }}
                        />
            )}
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};