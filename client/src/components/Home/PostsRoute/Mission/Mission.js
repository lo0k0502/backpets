import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, Text } from 'react-native';
import { ActivityIndicator, Button, Portal, Title, useTheme } from 'react-native-paper';
import MissionDialog from './MissionDialog';
import MissionCard from './MissionCard';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { useMissions } from '../../../../hooks';
import ClueDialog from './ClueDialog';

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

export default ({ route, navigation, selectedTags, searchTextState }) => {
    const [searchText, setSearchText] = searchTextState;
    const user = useSelector(selectUser);
    const { missions, refreshMissions, isFetching } = useMissions();
    const { colors } = useTheme();

    const [missionDialog, setMissionDialog] = useState(false);// Whether mission dialog is open
    const [clueDialog, setClueDialog] = useState(false);// Whether clue dialog is open

    const checkMissionMatchTagAndSearchText = (mission) => (
        (!selectedTags.length || selectedTags.includes(mission.tag))
        && (
            !searchText
            || mission.content.search(searchText) !== -1
            || mission.breed.search(searchText) !== -1
            || mission.feature.search(searchText) !== -1
        )
    );

    const checkMissionsMatchTagAndSearchText = () => {
        const missionsMatchTag = selectedTags.length ? (
            missions.filter(mission => selectedTags.includes(mission.tag))
        ) : missions;
        if (!missionsMatchTag.length) return false;
        
        const missionsMatchTagAndSearchText = searchText ? (
            missionsMatchTag.filter(mission => (
                mission.content.search(searchText) !== -1
                || mission.breed.search(searchText) !== -1
                || mission.feature.search(searchText) !== -1
            ))
        ) : missionsMatchTag;

        return missionsMatchTagAndSearchText.length ? true : false;
    };

    const handleRefresh = useCallback(() => {
        refreshMissions();
    }, []);
    
    return (
        <ScrollView style={styles.root} refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />}>
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
            <Portal>
                <MissionDialog
                    visible={missionDialog}
                    close={() => setMissionDialog(false)}
                    refreshMissions={refreshMissions}
                />
                <ClueDialog
                    visible={clueDialog}
                    close={() => setClueDialog(false)}
                />
            </Portal>
            <View style={[styles.emailVerifySuggest, { display: user.info?.verified ? 'none' : 'flex' }]}>
                <Text style={{ color: 'black' }}>你的信箱還未驗證喔!</Text>
                <Text style={{ color: 'black' }}>我們強烈建議您先驗證您的信箱!</Text>
            </View>
            {
                isFetching ? (
                    <ActivityIndicator
                        animating={true}
                        color={colors.primary}
                        size='large'
                        style={{ marginTop: 50 }}
                    />
                ) : (
                    missions.length ? (
                        selectedTags.length || searchText ? (
                            checkMissionsMatchTagAndSearchText() ? (
                                missions.map(mission => checkMissionMatchTagAndSearchText(mission) ? (
                                    <MissionCard
                                        key={mission._id}
                                        mission={mission}
                                        setClueDialog={setClueDialog}
                                    />
                                ) : null)
                            ) : (
                                <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                            )
                        ) : (
                            missions.map(mission => (
                                <MissionCard
                                    key={mission._id}
                                    mission={mission}
                                    setClueDialog={setClueDialog}
                                />
                            ))
                        )
                    ) : <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                )
            }
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};