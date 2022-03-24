import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, Text, Alert } from 'react-native';
import { ActivityIndicator, Divider, FAB, Portal, Title, useTheme } from 'react-native-paper';
import MissionDialog from './MissionDialog';
import MissionCard from './MissionCard';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/userSlice';
import { useMissions, useSelfPets } from '../../../../hooks';
import ClueDialog from './ClueDialog';
import { animalTagsArray } from '../../../../utils/constants';
import TagsView from '../TagsView';
import EditMissionDialog from './EditMissionDialog';

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

export default ({ route, navigation, searchTextState }) => {
    const [searchText, setSearchText] = searchTextState;
    const user = useSelector(selectUser);
    const { missions, refreshMissions, isFetching } = useMissions();
    const { pets } = useSelfPets(user.info?._id);
    const { colors } = useTheme();

    const [animalTags, setAnimalTags] = useState(animalTagsArray.map(tagName => ({ name: tagName, selected: false })));

    const [missionDialog, setMissionDialog] = useState(false);// Whether mission dialog is open
    const [editMissionDialog, setEditMissionDialog] = useState(false);// Whether edit mission dialog is open
    const [editMission, setEditMission] = useState({});
    const [clueDialog, setClueDialog] = useState(false);// Whether clue dialog is open

    const selectedTags = animalTagsArray.filter(tag => animalTags.find(_tag => _tag.name === tag && _tag.selected));

    const checkMissionMatchTagAndSearchText = (mission) => (
        (!selectedTags.length || selectedTags.includes(mission.tag))
        && (
            !searchText
            || mission.content.search(searchText) !== -1
            || mission.breed.search(searchText) !== -1
            || mission.feature.search(searchText) !== -1
            || mission.gender.search(searchText) !== -1
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
                || mission.gender.search(searchText) !== -1
            ))
        ) : missionsMatchTag;

        return missionsMatchTagAndSearchText.length ? true : false;
    };
    
    return (
        <>
            <TagsView tagsState={[animalTags, setAnimalTags]} />
            <Divider />
            <ScrollView
                style={styles.root}
                refreshControl={(
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refreshMissions}
                    />
                )}
            >
                <Portal>
                    <MissionDialog
                        visible={missionDialog}
                        close={() => setMissionDialog(false)}
                        refreshMissions={refreshMissions}
                    />
                    <EditMissionDialog
                        mission={editMission}
                        visible={editMissionDialog}
                        close={() => setEditMissionDialog(false)}
                        refreshMissions={refreshMissions}
                    />
                    <ClueDialog
                        visible={clueDialog}
                        close={() => setClueDialog(false)}
                    />
                </Portal>
                {
                    user.info?.verified ? null : (
                        <View style={styles.emailVerifySuggest}>
                            <Text style={{ color: 'black' }}>你的信箱還未驗證喔!</Text>
                            <Text style={{ color: 'black' }}>我們強烈建議您先驗證您的信箱!</Text>
                        </View>
                    )
                }
                {
                    isFetching ? (
                        <ActivityIndicator
                            animating={true}
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
                                            tagSelected={selectedTags.length}
                                            onViewCluePress={() => {
                                                navigation.navigate('ProfileRoute', { to: 'Clue', missionId: mission._id });
                                            }}
                                            setClueDialog={setClueDialog}
                                            setEditMission={setEditMission}
                                            setEditMissionDialog={setEditMissionDialog}
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
                                        onViewCluePress={() => {
                                            navigation.navigate('ProfileRoute', { to: 'Clue', missionId: mission._id });
                                        }}
                                        setClueDialog={setClueDialog}
                                        setEditMission={setEditMission}
                                        setEditMissionDialog={setEditMissionDialog}
                                    />
                                ))
                            )
                        ) : <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有貼文QQ</Title>
                    )
                }
                <View style={{ height: 70 }} />
            </ScrollView>
            <FAB
                icon='plus'
                color='white'
                style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 70,
                    elevation: 1,
                }}
                theme={{ colors: { accent: colors.primary } }}
                onPress={() => {
                    if (!pets.length) {
                        return Alert.alert('沒有寵物!', '您的寵物護照目前沒有寵物喔!', [{ text: '知道了' }]);
                    }
                    setMissionDialog(true);
                }}
            />
        </>
    );
};